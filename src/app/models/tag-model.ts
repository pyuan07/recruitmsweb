import { ObjectState, TagType } from "../_shared/enum/enum";

export interface Tag{
    tagId: string;
    name: string;
    tagType: TagType;
    totalUsed: number;
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;

    matched?: boolean;
}
