
import { ApplicationStatus, ObjectState } from "../_shared/enum/enum";
import { Application } from './application-model';
import { ScheduleTimeslot } from "./scheduleTimeslot-model";

export interface Schedule{
    scheduleId?: number;
    application: Application;
    scheduleTimeslot: ScheduleTimeslot;
    meetingUrl?: string;

    objectState: ObjectState;
    createdBy?: string;
    createdDate?: Date;
    modifiedBy?: string;
    lastModifiedDate?: Date;
}
