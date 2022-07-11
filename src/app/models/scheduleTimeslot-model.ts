
import { InterviewApproach, ObjectState } from "../_shared/enum/enum";
import { User } from "./user-model";
import { Vacancy } from "./vacancy-model";

export interface ScheduleTimeslot{
    scheduleTimeslotId?: number;
    vacancy: Vacancy;
    availableDateTime: Date;
    interviewApproach: InterviewApproach;
    bookedBy?: User;

    objectState: ObjectState;
    createdBy?: string;
    createdDate?: Date;
    modifiedBy?: string;
    lastModifiedDate?: Date;

    matchedTag?: number;
}
