import { Gender } from './../../_shared/enum/enum';
import { Role } from 'src/app/_shared/enum/enum';
export interface SignupRequest {
    username: string;
    password: string;
    email: string;
    fullName: string;
    gender: Gender;
    role: Role;
}
