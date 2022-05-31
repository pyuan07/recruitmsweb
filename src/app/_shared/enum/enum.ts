
export enum Role {
    ADMIN,
    STAFF,
    USER,
    NOT_AUTH
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