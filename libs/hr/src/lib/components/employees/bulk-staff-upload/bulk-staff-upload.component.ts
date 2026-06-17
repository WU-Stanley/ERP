import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, DepartmentService } from '@erp/auth';
import { DepartmentDto } from '@erp/auth';
import { EmploymentTypeDto } from '@erp/auth';
import { JobCategoryDto } from '@erp/auth';
import { BulkStaffUploadResultDto } from '../../../dtos/bulk-staff-upload.dto';
import { StaffBulkUploadService } from '../../../services/staff-bulk-upload.service';

@Component({
  selector: 'lib-bulk-staff-upload',
  templateUrl: './bulk-staff-upload.component.html',
  imports: [CommonModule, RouterModule],
})
export class BulkStaffUploadComponent implements OnInit {
  selectedFile: File | null = null;
  isUploading = false;
  isLoadingTemplateData = false;
  errorMessage = '';
  result: BulkStaffUploadResultDto | null = null;
  departments: DepartmentDto[] = [];
  employmentTypes: EmploymentTypeDto[] = [];
  jobCategories: JobCategoryDto[] = [];

  readonly requiredColumns = [
    'FirstName',
    'LastName',
    'Email',
    'Department',
    'EmploymentType',
    'JobCategory',
    'JobTitle',
    'SingleSignOnEnabled',
  ];

  constructor(
    private bulkUploadService: StaffBulkUploadService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTemplateData();
  }

  loadTemplateData() {
    this.isLoadingTemplateData = true;
    forkJoin({
      departments: this.departmentService.getDepartments(),
      employmentTypes: this.authService.getEmploymentTypes(),
      jobCategories: this.authService.getJobCategories(),
    }).subscribe({
      next: ({ departments, employmentTypes, jobCategories }) => {
        this.departments = departments.data ?? [];
        this.employmentTypes = employmentTypes.data ?? [];
        this.jobCategories = jobCategories.data ?? [];
        this.isLoadingTemplateData = false;
      },
      error: () => {
        this.isLoadingTemplateData = false;
        this.errorMessage = 'Unable to load template lookup values. You can still upload an existing file.';
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.result = null;
    this.errorMessage = '';

    if (!file) {
      this.selectedFile = null;
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'csv'].includes(extension ?? '')) {
      this.selectedFile = null;
      this.errorMessage = 'Please upload an .xlsx or .csv staff file.';
      return;
    }

    this.selectedFile = file;
  }

  upload() {
    if (!this.selectedFile || this.isUploading) {
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.result = null;

    this.bulkUploadService.uploadStaff(this.selectedFile).subscribe({
      next: (response) => {
        this.result = response.data ?? null;
        this.isUploading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || error?.error?.error || 'Bulk staff upload failed.';
        this.isUploading = false;
      },
    });
  }

  async downloadTemplate() {
    if (!this.departments.length || !this.employmentTypes.length || !this.jobCategories.length) {
      this.errorMessage = 'Template values are still loading or unavailable. Please try again in a moment.';
      return;
    }

    const blob = new Blob([this.buildXlsxTemplate()], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'staff-upload-template.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  }

  private buildXlsxTemplate(): Uint8Array {
    const rows = [
      this.requiredColumns,
      [
        'Jane',
        'Doe',
        'jane.doe@wigweuniversity.edu.ng',
        this.departments[0]?.name ?? '',
        this.employmentTypes[0]?.name ?? '',
        this.jobCategories[0]?.name ?? '',
        'HR Officer',
        'TRUE',
      ],
    ];

    const files: XlsxFile[] = [
      { path: '[Content_Types].xml', content: this.contentTypesXml() },
      { path: '_rels/.rels', content: this.rootRelsXml() },
      { path: 'xl/workbook.xml', content: this.workbookXml() },
      { path: 'xl/_rels/workbook.xml.rels', content: this.workbookRelsXml() },
      { path: 'xl/styles.xml', content: this.stylesXml() },
      {
        path: 'xl/worksheets/sheet1.xml',
        content: this.sheetXml('Staff Upload', rows, [
          { column: 'D', formula: `'Departments'!$A$2:$A$${this.departments.length + 1}` },
          { column: 'E', formula: `'Employment Types'!$A$2:$A$${this.employmentTypes.length + 1}` },
          { column: 'F', formula: `'Job Categories'!$A$2:$A$${this.jobCategories.length + 1}` },
          { column: 'H', formula: '"TRUE,FALSE"' },
        ]),
      },
      {
        path: 'xl/worksheets/sheet2.xml',
        content: this.sheetXml('Departments', [
          ['Name', 'Id'],
          ...this.departments.map((item) => [item.name, item.id]),
        ]),
      },
      {
        path: 'xl/worksheets/sheet3.xml',
        content: this.sheetXml('Employment Types', [
          ['Name', 'Id'],
          ...this.employmentTypes.map((item) => [item.name, item.id]),
        ]),
      },
      {
        path: 'xl/worksheets/sheet4.xml',
        content: this.sheetXml('Job Categories', [
          ['Name', 'Id'],
          ...this.jobCategories.map((item) => [item.name, item.id]),
        ]),
      },
    ];

    return createZip(files);
  }

  private sheetXml(
    name: string,
    rows: string[][],
    validations: { column: string; formula: string }[] = []
  ) {
    const rowXml = rows
      .map((row, rowIndex) => {
        const number = rowIndex + 1;
        const cells = row
          .map((value, columnIndex) => {
            const ref = `${columnName(columnIndex + 1)}${number}`;
            return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
          })
          .join('');
        return `<row r="${number}">${cells}</row>`;
      })
      .join('');

    const validationXml = validations.length
      ? `<dataValidations count="${validations.length}">${validations
          .map(
            (validation) =>
              `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${validation.column}2:${validation.column}500"><formula1>${escapeXml(validation.formula)}</formula1></dataValidation>`
          )
          .join('')}</dataValidations>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
  <dimension ref="A1:H500"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <sheetData>${rowXml}</sheetData>
  ${validationXml}
</worksheet>`;
  }

  private contentTypesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;
  }

  private rootRelsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  }

  private workbookXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Staff Upload" sheetId="1" r:id="rId1"/>
    <sheet name="Departments" sheetId="2" r:id="rId2"/>
    <sheet name="Employment Types" sheetId="3" r:id="rId3"/>
    <sheet name="Job Categories" sheetId="4" r:id="rId4"/>
  </sheets>
</workbook>`;
  }

  private workbookRelsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  }

  private stylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>`;
  }
}

type XlsxFile = {
  path: string;
  content: string;
};

function createZip(files: XlsxFile[]): Uint8Array {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const content = encoder.encode(file.content);
    const crc = crc32(content);
    const local = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(content.length),
      u32(content.length),
      u16(name.length),
      u16(0),
      name,
      content,
    ]);

    const central = concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(content.length),
      u32(content.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);

    localParts.push(local);
    centralParts.push(central);
    offset += local.length;
  }

  const centralDirectory = concatBytes(centralParts);
  const end = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDirectory.length),
    u32(offset),
    u16(0),
  ]);

  return concatBytes([...localParts, centralDirectory, end]);
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function u32(value: number): Uint8Array {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ]);
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function columnName(index: number): string {
  let name = '';
  while (index > 0) {
    const modulo = (index - 1) % 26;
    name = String.fromCharCode(65 + modulo) + name;
    index = Math.floor((index - modulo) / 26);
  }
  return name;
}

function escapeXml(value: string): string {
  return `${value ?? ''}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
