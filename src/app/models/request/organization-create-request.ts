import { ObjectState } from "src/app/_shared/enum/enum";

export interface OrganizationCreateRequest{
    name: string;
    description: string;
    address: string;
    countryISO: string;
    email: string;
    phone: string;
    website: string;
    owner: string;
    objectState: ObjectState;
}
