export interface FieldMapperData {
    mapperType: string;
    fieldsToMap?: string[];
}

export type FieldConfigObj = {

        externalFieldName: string,
        cmpFieldName: string,
        cmpApiFieldReference: string,
        externalFieldType:string,
        externalApiFieldReference: string,
        valueMapping: ValueMappingObj[] | [],
        cmpFieldType: string

}

export type ValueMappingObj = {
    cmpValue: string,
    externalValue: string,
    externalApiValue: string,
    cmpApiValue: string

}