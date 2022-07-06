
export enum Role {
    ADMIN = 'ADMIN',
    EMPLOYER = 'EMPLOYER',
    STAFF = 'STAFF',
    CANDIDATE = 'CANDIDATE',
    NOT_AUTH = ''
}

export enum Gender {
    MALE,
    FEMALE
}

export enum ObjectState {
    CREATED,
    TERMINATED,
    ACTIVE,
    PENDING,
    DRAFT,
    FROZEN
}

export enum DataState {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR' 
}

export enum TagType {
    RESUME,
    VACANCY
}

export enum ApplicationStatus{
    APPLIED,
    VIEWED,
    IN_PROGRESS,
    CANCEL,
    COMPLETED
}