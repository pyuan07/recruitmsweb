import { Gender, ObjectState, Role, } from "../_shared/enum/enum";

export interface User{
    userId: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
    roles: Role;
    dob: Date;
    gender?: Gender;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}
