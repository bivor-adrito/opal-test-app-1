import { ActionHandler } from '@helper/interface/action.handler.interface';
import { BynderApiService } from '@modules/bynder/services/bynder.service';
import { CmpAssetService } from '@modules/cmp/services/cmp.service';
import { FieldConfigObj } from './types';
export type Obj = Record<string, any>;

export class FieldMapper implements ActionHandler {
    private fieldsToMap: string[];

    constructor(fieldsToMap: string[]) {
        this.fieldsToMap = fieldsToMap;
    }

    handle = async () => {
        function findByLabels(obj: Obj, targetLabels: string[], results: Obj[] = []): Obj[] {
            if (typeof obj !== 'object' || obj === null) return results;

            for (const key in obj) {
                if (key === 'label' && targetLabels.includes(obj[key])) {
                    results.push(obj);
                } else if (typeof obj[key] === 'object') {
                    findByLabels(obj[key], targetLabels, results);
                }
            }

            return results;
        }
        const [cmpFields, bynderMetaproperties] = await Promise.all([
            CmpAssetService.fetchCMPFields(),
            BynderApiService.fetchBynderMetaProperties(),
        ]);

        const cmpFieldsToMap = cmpFields.filter((field) => this.fieldsToMap.includes(field.name));
        const bynderMetapropertiesToMap = findByLabels(bynderMetaproperties, this.fieldsToMap);
        const configFields = [];
        for (const cmpField of cmpFieldsToMap) {
            const bynderField = bynderMetapropertiesToMap.find((field) => field.label === cmpField.name);
            if (bynderField) {
                if (bynderField)
                    if (bynderField.type === 'longtext') {
                        const configObj: FieldConfigObj = {
                            externalFieldName: bynderField.label,
                            cmpFieldName: cmpField.name,
                            cmpApiFieldReference: cmpField.id,
                            externalFieldType: bynderField.type,
                            externalApiFieldReference: bynderField.id,
                            valueMapping: [],
                            cmpFieldType: cmpField.type,
                        };
                        configFields.push(configObj);
                    }
                if (bynderField.type === 'select') {
                    const configObj: FieldConfigObj = {
                        externalFieldName: bynderField.label,
                        cmpFieldName: cmpField.name,
                        cmpApiFieldReference: cmpField.id,
                        externalFieldType: bynderField.type,
                        externalApiFieldReference: bynderField.id,
                        valueMapping: bynderField.options.map((option: any) => {
                            for (const cmpFieldOption of cmpField.choices) {
                                if (cmpFieldOption.name == option.label) {
                                    return {
                                        cmpValue: cmpFieldOption.name,
                                        externalValue: option.label,
                                        externalApiValue: option.id,
                                        cmpApiValue: cmpFieldOption.id,
                                    };
                                }
                            }
                        }),
                        cmpFieldType: cmpField.type,
                    };
                    configFields.push(configObj);
                }
                if (bynderField.type === 'date') {
                    const configObj: FieldConfigObj = {
                        externalFieldName: bynderField.label,
                        cmpFieldName: cmpField.name,
                        cmpApiFieldReference: cmpField.id,
                        externalFieldType: bynderField.type,
                        externalApiFieldReference: bynderField.id,
                        valueMapping: [],
                        cmpFieldType: cmpField.type,
                    };
                    configFields.push(configObj);
                }
            }
        }

        return configFields;
    };
}
