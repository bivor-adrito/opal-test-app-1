import { ActionHandler } from '@helper/interface/action.handler.interface';
import { Asset } from '@modules/cmp/types/library.types';
import { BynderAssetUpdateData } from '../types/bynder.asset.types';
import { BynderUtility } from '../utils/bynder.utils';

export class UpdateBynderAsset extends BynderUtility implements ActionHandler {
    constructor(assetInfo: Asset, mediaId: string, bynderUpdateData: BynderAssetUpdateData) {
        super(assetInfo);
        this.mediaId = mediaId;
        this.bynderUpdateData = bynderUpdateData;
        // this.tagsToAdd = tagsToAdd;
    }

    handle = async () => {
        await this.updateBynderAsset();
    };
}
