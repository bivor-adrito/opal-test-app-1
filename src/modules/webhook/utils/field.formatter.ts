import { arrayToCommaSeparatedString } from '@helper/common/common.helper';
import { AssetField } from '@modules/cmp/types/library.types';
import { FieldWithProperty, LabelValuesType, PropertyConfig, PropertyConfigValue } from '../types/config.types';

type MapperFunction = (fieldWithProperty: FieldWithProperty) => { [key: string]: LabelValuesType };
type ConfigType = Record<ExternalFieldReference, { mapperFn: MapperFunction }>;

enum ExternalFieldReference {
    Date = 'date',
    LongText = 'longtext',
    Select = 'select',
}

export abstract class FieldFormatter {
    private static readonly formatterFactory: ConfigType = {
        [ExternalFieldReference.Date]: {
            mapperFn: (fieldWithProperty) => {
                const dateTimeValue = this.getFieldsValue(fieldWithProperty.field);
                const formattedDateTimeValue = !dateTimeValue
                    ? ''
                    : new Date(dateTimeValue).toISOString().split('T')[0];
                return {
                    [`metaproperty.${fieldWithProperty.property.externalApiFieldReference}`]: formattedDateTimeValue,
                };
            },
        },
        [ExternalFieldReference.Select]: {
            mapperFn: (fieldWithProperty) => {
                // const checkboxFieldValue = properties.value.find((p) => p.cmpFieldName === field.name);
                const ids = this.getExternalMultiChoiceNames(fieldWithProperty);
                const idsString = arrayToCommaSeparatedString(ids);

                return { [`metaproperty.${fieldWithProperty.property.externalApiFieldReference}`]: idsString };
            },
        },

        [ExternalFieldReference.LongText]: {
            mapperFn: (fieldWithProperty) => {
                const text = this.getFieldsValue(fieldWithProperty.field);
                return { [`metaproperty.${fieldWithProperty.property.externalApiFieldReference}`]: text };
            },
        },
    };

    private static getFieldsValue = (field: AssetField) => {
        return field.values.at(0) ?? '';
    };

    private static getValidChoiceNamesFromField = (field: AssetField) => {
        const unfilteredFieldChoiceNames = field.choices.map((c) =>
            field.values.some((v) => v === c.id) ? c.name : null
        );
        return unfilteredFieldChoiceNames.filter((c) => c != null);
    };

    private static getMappedMultiChoicesForFieldChoices = (fieldChoices: string[], property: PropertyConfigValue) => {
        return fieldChoices
            .map((c) => property.valueMapping.find((vm) => vm.cmpValue === c)?.externalValue)
            .filter((v) => v != null);
    };

    private static getExternalMultiChoiceNames = (fieldWithProperty: FieldWithProperty) => {
        const fieldChoices = this.getValidChoiceNamesFromField(fieldWithProperty.field);
        const { property } = fieldWithProperty;
        return this.getMappedMultiChoicesForFieldChoices(fieldChoices, property);
    };

    private static getParsedNumber = (stringNumberValue: string, denominator: number = 1) => {
        return stringNumberValue !== '' ? parseFloat(stringNumberValue) / denominator : undefined;
    };

    private static mapFieldsWithProperty = (fields: AssetField[], propertyConfigs: PropertyConfig, organizationId: string) => {
        const properties = propertyConfigs.value.filter((p) => p.organizationId === organizationId);
        const mappedFieldsWithProperty = fields.map((field) => {
            const property = properties.find((p) => field.name === p.cmpFieldName);
            if (property == null) return null;
            return { field, property };
        });

        return mappedFieldsWithProperty.filter((fp) => fp != null);
    };

    private static createExternalFieldValues = (fieldWithProperty: FieldWithProperty[]) => {
        return fieldWithProperty.reduce((accumulatedFields, fieldWithProperty) => {
            const { externalFieldType } = fieldWithProperty.property;

            const formatterFn = this.formatterFactory[externalFieldType as ExternalFieldReference];
            if (formatterFn == null) return accumulatedFields;

            return { ...accumulatedFields, ...formatterFn.mapperFn(fieldWithProperty) };
        }, {});
    };

    public static mapExternalLabelsFromField = (fields: AssetField[], properties: PropertyConfig, organizationId: string) => {
        const mappedFieldsWithProperty = this.mapFieldsWithProperty(fields, properties, organizationId);
        return this.createExternalFieldValues(mappedFieldsWithProperty);
    };
}
