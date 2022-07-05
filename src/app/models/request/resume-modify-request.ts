import { ObjectState } from "src/app/_shared/enum/enum";
import { Country } from "../country-model";
import { Tag } from "../tag-model";
import { User } from "../user-model";

export interface ResumeModifyRequest{
    resumeId: string;
    profilePicture: string;
    candidate: User;
    tags: Tag[];
    country: Country;
    totalExperienceYear: number;
    salaryExpectation:number;
    remarks: string;
    resumePdf:string;

    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;

    tagString?: string[];
}
