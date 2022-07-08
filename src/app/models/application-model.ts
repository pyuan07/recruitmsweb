import { User } from './user-model';
import { ApplicationStatus, ObjectState } from "../_shared/enum/enum";
import { Resume } from "./resume-model";
import { Vacancy } from "./vacancy-model";

export interface Application{
    applicationId?: number;
    candidate: User;
    resume: Resume;
    vacancy: Vacancy;
    status: ApplicationStatus;
    remarks: string;
    // viewBy?: User;

    objectState: ObjectState;
    createdBy?: string;
    createdDate?: Date;
    modifiedBy?: string;
    lastModifiedDate?: Date;

    matchedTag?: number;
}
