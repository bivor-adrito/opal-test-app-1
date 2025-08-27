import { ActionHandler } from '@helper/interface/action.handler.interface';
import { Asset } from '@modules/cmp/types/library.types';
import { BynderUtility } from '../utils/bynder.utils';

export class UploadAssetBynder extends BynderUtility implements ActionHandler {
    constructor(assetInfo: Asset) {
        super(assetInfo);
    }
    public getBynderCompletedUpload() {
        return this.savingACompletedUpload;
    }

    handle = async () => {
        await Promise.all([this.downloadAssetFromCmp(), this.fetchUploadEndpoint()]);
        await this.initializeUpload();
        await this.uploadToS3();
        await this.registerUploadChunk();
        await this.finalizeUploadedFile();
        await this.pollUploadStatusUntilDone();
        await this.saveCompetedUpload();
        await Promise.all([this.addLineageInCmp(), this.deleteDownloadedAsset()]) ;
    };
}
