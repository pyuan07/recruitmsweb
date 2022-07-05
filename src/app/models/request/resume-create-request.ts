import { ObjectState } from "src/app/_shared/enum/enum";

export interface ResumeCreateRequest{
    profilePicture: string;
    owner: string;
    tags: string[];
    //skills :ProgrammingLanguageSkill[];
    countryISO: string;
    totalExperienceYear: number;
    salaryExpectation:number;
    remarks: string;
    resumePdf:string;

    objectState: ObjectState;
}

// export interface ProgrammingLanguageSkill {
//     programmingLanguageId:number;
//     experienceYear:number;
// }
