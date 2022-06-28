import { Organization } from "./organization-model";
import { User } from "./user-model";

export interface Staff{
    userId: string;
    user: User;
    organization?: Organization;
}
