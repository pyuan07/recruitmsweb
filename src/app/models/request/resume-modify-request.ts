import { ObjectState } from "src/app/_shared/enum/enum";
import { Country } from "../country-model";
import { Image } from "../image-model";
import { Tag } from "../tag-model";
import { ProgrammingLanguageSkill } from "./resume-create-request";

export interface ResumeModifyRequest{
    profilePicture: Image;
    tags: string[];
    skills: ProgrammingLanguageSkill[];
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
