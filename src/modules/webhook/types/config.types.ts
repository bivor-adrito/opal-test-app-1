import { BynderHardCodedMetaProperty } from '@modules/bynder/types/bynder.upload.types';
import { AssetField } from '@modules/cmp/types/library.types';

export interface IParentReference {
    site: string;
    siteId: string;
    webId: string;
    driveName: string;
    driveId: string;
    drivePath: string;
}

export interface IFolderMapping {
    cmpValue: string;
    cmpApiValue: string;
    folderName: string;
    folderId: string;
    webUrlName: string;
    parentReference: IParentReference;
}

export type SendIndicatorValue = {
    sendIndicatorType: string;
    cmpFieldName: string;
    cmpApiFieldReference: string;
    organizationId: string;
    valueMapping: {
        cmpValue: string;
        cmpApiValue: string;
        externalValue: string;
        externalApiValue: string;
    }[];
};

export type SendIndicatorConfig = {
    name: string;
    value: SendIndicatorValue[];
};

export type PropertyConfigValueMapping = {
    cmpValue: string;
    cmpApiValue: string;
    externalValue: string | boolean;
    externalApiValue: string | boolean;
};

export type PropertyConfigValue = {
    cmpFieldName: string;
    cmpFieldType: string;
    cmpApiFieldReference: string;
    externalFieldName: string;
    externalApiFieldReference: string;
    externalFieldType: string;
    organizationId: string;
    valueMapping: PropertyConfigValueMapping[];
};

export type PropertyConfig = {
    name: string;
    value: PropertyConfigValue[];
};

export type TagConfigValue = {
    organizationId: string;
    CMPLabel: string;
    BynderMetaProperty: string;
    BynderTag: string;
    BynderTagID: string;
};

export type TagConfig = {
    name: string;
    value: TagConfigValue[] | [];
};

export type DeleteBehaviour = {
    name: string;
    value: string;
};
export type UseExternalTag = {
    name: string;
    value: boolean;
};

export type FolderConfigValueMapping = {
    cmpValue: string;
    cmpApiValue: string;
    folderName: string;
    folderId: string;
    webUrlName: string;
    parentReference: {
        site: string;
        siteId: string;
        webId: string;
        driveName: string;
        driveId: string;
        drivePath: string;
    };
};

export type FolderConfigValue = {
    cmpFieldName: string;
    cmpApiFieldReference: string;
    cmpFieldType: string;
    valueMapping: FolderConfigValueMapping[];
};

export type FolderConfig = {
    name: string;
    value: FolderConfigValue[];
};
export type BynderHardCodedMetaPropertiesConfig = {
    name: string;
    value: BynderHardCodedMetaProperty;
};

export type Settings = (
    | PropertyConfig
    | FolderConfig
    | DeleteBehaviour
    | SendIndicatorConfig
    | UseExternalTag
    | TagConfig
    | BynderHardCodedMetaPropertiesConfig
)[];

export type LabelValuesType = string | number | undefined | boolean | (string | boolean)[];
export type MappedExternalLabels = { [key: string]: LabelValuesType };
export type FieldWithProperty = { field: AssetField; property: PropertyConfigValue };
