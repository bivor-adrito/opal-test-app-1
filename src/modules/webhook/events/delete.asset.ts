import { getMediaIdFromUrl } from '@helper/common/common.helper';
import { ActionHandler } from '@helper/interface/action.handler.interface';
import { BynderApiService } from '@modules/bynder/services/bynder.service';
import { CmpAssetService } from '@modules/cmp/services/cmp.service';
import { BynderLabel } from '@modules/cmp/types/library.types';
import { EventData } from '../types/webhook.event.types';
import { getConfigSettings } from '../utils/config.settings';

export class DeleteAsset implements ActionHandler {
    private assetId: string;

    constructor(private eventData: EventData) {
        this.assetId = eventData.data.asset.id;
    }

    handle = async () => {
        const configSettings = await getConfigSettings();
        const { deleteBehaviour } = configSettings;

        if (deleteBehaviour.value === 'Delete' || deleteBehaviour.value === 'Archive') {
            await this.executeBynderAssetDeleteOperation(deleteBehaviour.value);
        }
    };

    private async executeBynderAssetDeleteOperation(action: 'Delete' | 'Archive') {
        const allLineages = await CmpAssetService.fetchAssetLineage(this.assetId);
        const bynderMediaIds = allLineages
            .filter((l) => l.name === BynderLabel)
            .map((l) => getMediaIdFromUrl(l.uri.split('?').at(-1)))
            .filter((idInfo): idInfo is { mediaId: string } => idInfo != null);

        const actionMethod =
            action === 'Delete' ? BynderApiService.deleteBynderAsset : BynderApiService.archiveBynderAsset;

        await Promise.all(bynderMediaIds.map(({ mediaId }) => actionMethod(mediaId)));
    }
}
