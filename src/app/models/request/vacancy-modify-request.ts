import { Organization } from './../organization-model';
import { Country } from './../country-model';
import { ObjectState } from "src/app/_shared/enum/enum";
import { Tag } from "../tag-model";

export interface VacancyModifyRequest{
    vacancyId: number;
    name: string;
    description: string;
    tags: Tag[];
    country: Country;
    organization: Organization;
    numberOfOpening: number;
    minSalary: number;
    maxSalary: number;
    // enableQuiz:boolean;
    remarks:string;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;

    tagString?: string[];
}