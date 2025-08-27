import { ActionHandler } from '@helper/interface/action.handler.interface';
import { Asset } from '@modules/cmp/types/library.types';
import { BynderUtility } from '../utils/bynder.utils';

export class UploadNewVersionAssetBynder extends BynderUtility implements ActionHandler {
    constructor(assetInfo: Asset, mediaId: string) {
        super(assetInfo);
        this.mediaId = mediaId;
    }
    public getBynderCompletedUpload() {
        return this.savingNewVersionCompletedUpload;
    }

    handle = async () => {
        await Promise.all([this.downloadAssetFromCmp(), this.fetchUploadEndpoint()]);
        await this.initializeUpload();
        await this.uploadToS3();
        await this.registerUploadChunk();
        await this.finalizeUploadedFile();
        await this.pollUploadStatusUntilDone();
        await this.saveAsNewVersion();
        await Promise.all([this.addLineageInCmp(), this.deleteDownloadedAsset()]) ;
    };
}
