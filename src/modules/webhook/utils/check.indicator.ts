import { AssetField } from '@modules/cmp/types/library.types';
import { SendIndicatorConfig } from '../types/config.types';

/**
 * Sanity checker class.
 * Use the static function `checkFieldSendIndicator` for status and corresponding message.
 */
export abstract class SanityCheck {
    private static sendResponse(isOk: boolean, message: string) {
        return { isOk, message };
    }

    /**
     * Checks fields of an asset against config of send indicator to check if it's okay to proceed with the event.
     * @param fields Fields of an asset
     * @param sendIndicator Send indicator object from config
     * @returns An object with the key isOk - status of the event, and message string - the cause of failing check
     */
    public static checkFieldSendIndicator = (
        fields: AssetField[],
        sendIndicator: SendIndicatorConfig,
        folderId: string,
        organizationId: string
    ) => {
        const sendIndicatorFolder = sendIndicator.value.find(
            (si) => si.sendIndicatorType === 'folder' && si.organizationId === organizationId
        );
        const doesSendIndicatorCmpFolderMatches = sendIndicatorFolder?.cmpApiFieldReference === folderId;

        if (doesSendIndicatorCmpFolderMatches) {
            return this.sendResponse(true, 'Sanity check passed');
        }
        if (fields.length === 0) {
            return this.sendResponse(false, 'No field to map');
        }

        const sendIndicatorLabel = sendIndicator.value.find(
            (si) => si.sendIndicatorType === 'label' && si.organizationId === organizationId
        );
        const sendIndicatorCmpValue = sendIndicatorLabel?.valueMapping.at(0)?.cmpValue || '';
        if (sendIndicatorCmpValue == '') {
            return this.sendResponse(false, 'Send indicator value not found');
        }

        const fieldToCheck = fields.find((f) => f.name === 'Asset Destination');
        if (fieldToCheck == null) {
            return this.sendResponse(false, 'Asset destination field not found');
        }

        const fieldValueChoice = fieldToCheck.choices.find((c: any) => c.id === fieldToCheck.values.at(0));
        if (fieldValueChoice == null) {
            return this.sendResponse(false, 'Asset destination field value not found');
        }

        if (fieldValueChoice.name !== sendIndicatorCmpValue) {
            return this.sendResponse(false, 'Asset destination does not match the send indicator');
        }

        return this.sendResponse(true, 'Sanity check passed');
    };
}
