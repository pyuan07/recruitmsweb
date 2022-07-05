import { ObjectState } from "../_shared/enum/enum";
import { Tag } from "./tag-model";
import { Country } from "./country-model";

export interface Resume{
    resumeId: string;
    profilePicture: File;
    tags: Tag[];
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
}
