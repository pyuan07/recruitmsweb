import { Organization } from './organization-model';
import { ObjectState, TagType } from "../_shared/enum/enum";
import { Tag } from "./tag-model";
import { Country } from './country-model';

export interface Vacancy{
    vacancyId: string;
    name: string;
    description: string;
    tags: Set<Tag>;
    country: Country
    organization: Organization;
    numberOfOpening: number;
    minSalary: number;
    maxSalary: number;
    enableQuiz:boolean;
    remarks:string;

    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}
