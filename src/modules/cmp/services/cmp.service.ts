import fs from 'fs';

import { Service } from '@helper/common/service.helper';
import { ensureAssetsFolder } from '@helper/utils/file.manager';
import { cmpApiInstance } from '@modules/cmp/utils/axios.cmp';

import { asyncErrorHandler } from '@helper/decorators/asyncErrorHandler.decorator';
import { fileDownloadInstance } from '@helper/utils/file.download';
import { Asset, AssetField, AssetLabel, AssetLineage, PaginatedData } from '../types/library.types';

/**
 * Abstract CMP API Service class.
 * An instance of this class cannot be created.
 * Use the static functions of this class.
 * @example
 * const fields = await CmpApiService.fetchAssetFields(assetId)
 */
export abstract class CmpAssetService extends Service {
    /**
     * Does an GET api call in CMP in the given url and returns data.
     * @param url the url for GET api call
     * @returns The data returned from the Api call
     */
    private static async getApiCall<DataType>(url: string, headers?: any) {
        const { data } = await cmpApiInstance.get<PaginatedData<DataType>>(url, { headers });
        return data;
    }

    /**
     * Fetches fields list for an asset.
     * @param assetId Id of the asset in CMP
     * @returns Promise of cumulative fields array over all the paginated results
     */
    public static async fetchAssetFields(assetId: string) {
        const initialUrl = `/v3/assets/${assetId}/fields?offset=0&page_size=20`;
        return await this.getAllPaginatedData(this.getApiCall<AssetField>, initialUrl);
    }
    /**
     * Fetches fields list for CMP.
     * @param
     * @returns Promise of cumulative fields array over all the paginated results
     */
    public static async fetchCMPFields() {
        const initialUrl = `/v3/fields?offset=0&page_size=20`;
        return await this.getAllPaginatedData(this.getApiCall<AssetField>, initialUrl);
    }

    /**
     * Fetches lineage list for an asset.
     * @param assetId Id of the asset in CMP
     * @returns Promise of cumulative lineage array over all the paginated results
     */
    public static async fetchAssetLineage(assetId: string) {
        const initialUrl = `/v3/asset-lineages?asset_id=${assetId}&offset=0&page_size=10`;
        return await this.getAllPaginatedData<AssetLineage>(this.getApiCall, initialUrl);
    }

    /**
     * Fetches information an asset.
     * @param assetId Id of the asset in CMP
     * @returns Promise of Asset information data
     */

    @asyncErrorHandler
    public static async fetchAsset(assetUrl: string) {
        //+
        const url = `/v3/${assetUrl}`; //+
        const { data } = await cmpApiInstance.get<Asset>(url); //+
        return data; //+
    } //+

    /**
     * Deletes an asset lineage from CMP.
     * @param assetId Id of the asset in CMP
     * @param lineageId Id of the lineage we want to remove from CMP
     */
    @asyncErrorHandler
    public static async removeAssetLineage(assetId: string, lineageId: string) {
        await cmpApiInstance.delete(`/v3/assets/${assetId}/lineages/${lineageId}`);
    }

    /**
     * Fetches an asset labels (among other things).
     * @param assetUrl FULL URL of the asset's link.
     * @returns Asset information, but we (ts) are only interested in the labels array.
     */
    @asyncErrorHandler
    public static async fetchAssetLabel(assetUrl: string) {
        const { data } = await cmpApiInstance.get<{ labels: AssetLabel[] }>(assetUrl);
        return data;
    }

    /**
     * Downloads and saves a file from the given Url, in a given path, in a given name.
     * @param downloadUrl Download Url of the asset
     * @param fileName Name of the file, it will be saved under this name
     * @param assetsPath Path where the file will be downloaded
     * @returns A Promise, resolves it in success and rejects it in error
     */
    @asyncErrorHandler
    public static async downloadFile(downloadUrl: string, fileName: string, assetsPath: string) {
        ensureAssetsFolder(assetsPath);

        const writer = fs.createWriteStream(`${assetsPath}/${fileName}`);
        const { data } = await fileDownloadInstance.get(downloadUrl, { responseType: 'stream' });

        // Pipe the response data (file stream) to the file
        data.pipe(writer);

        // Return a promise that resolves when the file is completely written
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    /**
     * Fetches all campaigns from the API, handling pagination automatically.
    *
    * @param headers - Optional HTTP headers to include in the API request.
    * @returns A promise that resolves with the complete list of campaigns.
    */
    @asyncErrorHandler
    public static async fetchAllCampaigns(headers?: any) {
        const initialUrl = `/v3/campaigns?offset=0&page_size=20`;
        return await this.getAllPaginatedData(this.getApiCall<any>, initialUrl, headers);
    }
}
