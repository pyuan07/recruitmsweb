import { ObjectState } from "src/app/_shared/enum/enum";
import { Country } from "../country-model";
import { Image } from "../image-model";

export interface ResumeCreateRequest{
    profilePicture: Image;
    tags: string[];
    skills :ProgrammingLanguageSkill[];
    countryIso: string;
    totalExperienceYear: number;
    salaryExpectation:number;
    remarks: string;
    resumePdf:File;

    objectState: ObjectState;
}

export interface ProgrammingLanguageSkill {
    programmingLanguageId:number;
    experienceYear:number;
}
