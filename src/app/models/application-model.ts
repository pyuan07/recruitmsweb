import { ObjectState } from "../_shared/enum/enum";
import { Candidate } from "./candidate-model";
import { Resume } from "./resume-model";
import { Vacancy } from "./vacancy-model";

export interface Application{
    applicationId: string;
    candidate: Candidate;
    resume: Resume;
    vacancy: Vacancy;
    password: string;
    dob: Date;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}
