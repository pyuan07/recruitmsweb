import { ObjectState } from "src/app/_shared/enum/enum";

export interface VacancyCreateRequest{
    name: string;
    description: string;
    tags: string[];
    countryISO: string
    organizationId: string;
    numberOfOpening: number;
    minSalary: number;
    maxSalary: number;
    enableQuiz: boolean;
    remarks: string;
    objectState: ObjectState;
}