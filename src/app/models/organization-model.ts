import { Country } from './country-model';
import { ObjectState } from "../_shared/enum/enum";

export interface Organization{
    organizationId: string;
    name: string;
    description: string;
    address: string;
    country: Country;
    email: string;
    phone: string;
    website: string;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}
