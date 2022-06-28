import { ObjectState } from "../_shared/enum/enum";
import { Tag } from "./tag-model";
import { Image } from "./image-model";

export interface Resume{
    resumeId: string;
    profilePicture: Image;
    tag: Set<Tag>;
    
    objectState: ObjectState;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    lastModifiedDate: Date;
}
