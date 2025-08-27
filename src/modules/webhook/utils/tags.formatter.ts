import { arrayToCommaSeparatedString } from '@helper/common/common.helper';
import { AssetField } from '@modules/cmp/types/library.types';
import { PropertyConfig, PropertyConfigValue, TagConfigValue } from '../types/config.types';

export abstract class TagsFormatter {
    public static getCMPFieldNames = (properties: PropertyConfigValue[]): string[] => {
        return properties.map((field) => field.cmpFieldName);
    };
    public static getBynderTagValues = (tagConfigValue: TagConfigValue[], organizationId: string): string[] => {
        const tagConfigs = tagConfigValue.filter((tagConfig) => tagConfig.organizationId !== organizationId);
        return tagConfigs.map((tagConfig) => tagConfig.BynderTag);
    };

    public static getFieldValues = (fields: AssetField[]) => {
        const values: string[] = [];
        for (const field of fields) {
            if (field.choices && field.values) {
                for (const value of field.values) {
                    const choice = field.choices.find((c) => c.id === value);
                    if (choice) {
                        values.push(choice.name);
                    }
                    // choice && values.push(choice.name);
                }
            }
        }
        return values;
    };
    public static mapTagsFromField = (
        fields: AssetField[],
        useExternalTags: boolean,
        tagConfig: TagConfigValue[],
        propertyConfigs: PropertyConfig,
        organizationId: string
    ) => {
        const properties = propertyConfigs.value.filter((property) => property.organizationId === organizationId);
        const cmpFieldNames = this.getCMPFieldNames(properties);
        cmpFieldNames.push('Asset Destination');

        const filteredFields: AssetField[] = [];
        for (const field of fields) {
            if (!cmpFieldNames.includes(field.name)) {
                filteredFields.push(field);
            }
        }
        if (useExternalTags) {
            const tags = this.getFieldValues(filteredFields);
            return arrayToCommaSeparatedString(tags);
        } else {
            const bynderTagConfigValues = this.getBynderTagValues(tagConfig, organizationId);
            const cmpFieldValues = this.getFieldValues(filteredFields);
            const tags = cmpFieldValues.filter((value) => bynderTagConfigValues.includes(value));
            return arrayToCommaSeparatedString(tags);
        }
    };
}
