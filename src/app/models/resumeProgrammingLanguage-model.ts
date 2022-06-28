import { ObjectState } from "../_shared/enum/enum";

export interface ResumeProgrammingLanguage{
    categoryId: number;
    name: string;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}