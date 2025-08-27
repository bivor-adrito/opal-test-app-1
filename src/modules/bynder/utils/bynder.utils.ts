import { config } from '@config/config';
import { deleteLocalFile, generateFileName } from '@helper/common/common.helper';
import { CmpAssetService } from '@modules/cmp/services/cmp.service';
import { Asset } from '@modules/cmp/types/library.types';
import path from 'path';
import { BynderApiService } from '../services/bynder.service';
import { BynderAssetUpdateData } from '../types/bynder.asset.types';
import {
    BynderFinalizeUploadResponse,
    CompletedAssetSaveRes,
    PollUploadResponse,
    UploadInitResponse,
} from '../types/bynder.upload.types';

export abstract class BynderUtility {
    private brandId: string = config.bynder.brandId;
    private bynderS3Url: string = '';
    private initUpload: UploadInitResponse | null = null;
    private chunkNumber: number = 1;
    private chunks: number = 1;
    protected assetName: string;
    protected fileName: string;
    protected assetsPath: string;
    protected assetDownloadUrl: string;
    protected finalizeCompletelyUploadedFile: BynderFinalizeUploadResponse | null = null;
    protected items: string = '';
    protected itemsDone: string = '';
    protected pollUploadStatus: PollUploadResponse | null = null;
    protected audit: boolean = config.bynder.waitingRoom == 'YES';
    protected savingACompletedUpload: CompletedAssetSaveRes | null = null;
    protected savingNewVersionCompletedUpload: CompletedAssetSaveRes | null = null;
    protected bynderUpdateData: BynderAssetUpdateData | null = null;
    protected mediaId: string | null = null;
    constructor(private assetInfo: Asset) {
        this.assetName = this.getAssetName();
        this.fileName = generateFileName(assetInfo);
        this.assetsPath = path.join(__dirname, `../../../assets`);
        // this.assetsPath = ensureAssetsFolder();
        this.assetDownloadUrl = assetInfo.url;
    }

    private getAssetName() {
        if (this.assetInfo?.title.includes('.')) {
            return `${this.assetInfo.title.split('.')[0]}.${this.assetInfo.file_extension}`;
        }

        return `${this.assetInfo.title}.${this.assetInfo.file_extension}`;
    }

    protected async downloadAssetFromCmp() {
        await CmpAssetService.downloadFile(this.assetDownloadUrl, this.fileName, this.assetsPath);
    }
    protected async fetchUploadEndpoint() {
        this.bynderS3Url = await BynderApiService.fetchUploadEndpoint();
    }

    protected async initializeUpload() {
        if (!this.fileName) {
            throw Error('No file name provided');
        }
        this.initUpload = await BynderApiService.initUpload(this.fileName);
    }

    protected async uploadToS3() {
        if (this.bynderS3Url && this.initUpload) {
            await BynderApiService.uploadFileToS3(
                path.join(this.assetsPath, this.fileName),
                this.bynderS3Url,
                this.fileName,
                this.initUpload,
                this.chunkNumber.toString(),
                this.chunks.toString()
            );
        } else {
            throw Error('S3 url or upload initialization failed');
        }
    }

    protected async registerUploadChunk() {
        if (this.initUpload) {
            await BynderApiService.registerUploadChunk(this.chunkNumber.toString(), this.initUpload);
        } else {
            throw Error('No upload initialization found');
        }
    }

    protected async finalizeUploadedFile() {
        if (this.initUpload) {
            this.finalizeCompletelyUploadedFile = await BynderApiService.finalizeCompletelyUploadedFile(
                this.chunks.toString(),
                this.fileName,
                this.initUpload
            );

            this.items = [this.finalizeCompletelyUploadedFile.importId].join('%2C');
        } else {
            throw Error('No upload initialization found');
        }
    }

    protected async pollUploadStatusUntilDone() {
        if (this.items) {
            while (true) {
                const pollUploadStatus = await BynderApiService.pollUploadStatus(this.items);

                if (pollUploadStatus?.itemsDone.length) {
                    // this.pollUploadStatus = pollUploadStatus; // Return once items are marked as "done."
                    this.itemsDone = pollUploadStatus.itemsDone.join('%2C') || this.items;
                    break;
                }

                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying.
            }
        } else {
            throw Error('No items provided to pollUploadStatus');
        }
    }

    protected async saveCompetedUpload() {
        if (this.brandId) {
            this.savingACompletedUpload = await BynderApiService.savingACompletedUpload(
                this.brandId,
                this.fileName,
                this.itemsDone,
                this.audit
            );
        } else {
            throw Error('Bynder New Asset Upload failed, brandID not found');
        }
    }
    protected async saveAsNewVersion() {
        if (this.mediaId && this.brandId) {
            this.savingNewVersionCompletedUpload = await BynderApiService.savingANewVersionUpload(
                this.brandId,
                this.fileName,
                this.itemsDone,
                this.audit,
                this.mediaId
            );
        } else {
            throw Error('Bynder Asset New Version failed');
        }
    }

    protected async addLineageInCmp() {
        if (this.savingACompletedUpload) {
            const bynderAssetUri = `${config.urls.bynderBase}/media/?mediaId=${this.savingACompletedUpload.mediaid}`;
            await CmpAssetService.addAssetLineage(this.assetInfo.id, bynderAssetUri);
        } else if (this.savingNewVersionCompletedUpload) {
            const bynderAssetUri = `${config.urls.bynderBase}/media/?mediaId=${this.savingNewVersionCompletedUpload.mediaid}`;
            await CmpAssetService.addAssetLineage(this.assetInfo.id, bynderAssetUri);
        } else {
            throw Error('Bynder Asset New Version failed');
        }
    }

    protected async updateBynderAsset() {
        if (this.mediaId && this.bynderUpdateData) {
            await BynderApiService.updateBynderAsset(this.mediaId, { name: this.assetName, ...this.bynderUpdateData });
        } else {
            throw Error('No mediaId or Bynder Asset Data provided');
        }
    }

    protected async deleteDownloadedAsset() {
        deleteLocalFile(`${this.assetsPath}/${this.assetName}`);
    }

    protected async deleteBynderAsset(mediaId: string) {
        await BynderApiService.deleteBynderAsset(mediaId);
    }
}
