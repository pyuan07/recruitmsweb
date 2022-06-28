import { Organization } from "./organization-model";
import { User } from "./user-model";

export interface Employer{
    userId: string;
    user: User;
    organization?: Organization;
}
