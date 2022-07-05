import { ObjectState } from "../_shared/enum/enum";
import { Tag } from "./tag-model";
import { Country } from "./country-model";
import { User } from "./user-model";

export interface Resume{
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
}
