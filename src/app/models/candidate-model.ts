import { Resume } from './resume-model';
import { User } from "./user-model";

export interface Candidate{
    userId: string;
    user: User;
    resume?: Resume;
}
