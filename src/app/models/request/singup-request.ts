import { Role } from 'src/app/_shared/enum/enum';
export interface SignupRequest {
    username: string;
    password: string;
    email: string;
    role: Role;
}
