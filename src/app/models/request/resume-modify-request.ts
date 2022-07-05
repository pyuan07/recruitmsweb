import { ObjectState } from "src/app/_shared/enum/enum";
import { Country } from "../country-model";
import { Tag } from "../tag-model";

export interface ResumeModifyRequest{
    profilePicture: File;
    userId: string;
    tags: string[];
    // skills: ProgrammingLanguageSkill[];
    country: Country;
    totalExperienceYear: number;
    salaryExpectation:number;
    remarks: string;
    resumePdf:File;

    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;


    tagString?: string[];
}
