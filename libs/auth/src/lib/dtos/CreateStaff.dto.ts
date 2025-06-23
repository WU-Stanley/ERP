export interface CreateStaffDto{
    userEmail:string;
    userName:string;
    fullName:string;
    password:string;
    dateCreated:Date;
    departmentId:string;
    userTypeId:string;
}