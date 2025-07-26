import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { LeaveTypeDto } from '../dtos/leave.dto';

@Injectable({providedIn:'root'})
export class LeaveTypeService {
private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

constructor() { }

getLeaveTypes(){
    return this.http.get<ApiResponse<LeaveTypeDto[]>>(this.env.apiUrl+"/leavetype/all")
}
createLeaveType(data:LeaveTypeDto){
return this.http.post(this.env.apiUrl+'/leavetype/create',data)
}
}
