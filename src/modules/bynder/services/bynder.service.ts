import { parseXmlToObj } from '@helper/common/common.helper';
import { Service } from '@helper/common/service.helper';
import { asyncErrorHandler } from '@helper/decorators/asyncErrorHandler.decorator';
import FormData from 'form-data';
import * as fs from 'fs';
import qs from 'qs';
import { BynderAssetUpdateData } from '../types/bynder.asset.types';
import {
    BynderFinalizeUploadResponse,
    CompletedAssetSaveRes,
    PollUploadResponse,
    UploadInitResponse,
    XMLResponse,
} from '../types/bynder.upload.types';
import { bynderApiInstance } from '../utils/axios.bynder';
import { fileUploadInstance } from '../utils/file.upload';

export abstract class BynderApiService extends Service {
    @asyncErrorHandler
    public static async fetchUploadEndpoint() {
        const { data } = await bynderApiInstance.get<string>('/api/upload/endpoint');
        return data;
    }

    @asyncErrorHandler
    public static async initUpload(filename: string) {
        const payload = qs.stringify({ filename });
        const { data } = await bynderApiInstance.post<UploadInitResponse>('/api/upload/init', payload);
        return data;
    }

    @asyncErrorHandler
    public static async uploadFileToS3(
        filePath: string,
        s3Url: string,
        fileName: string,
        uploadInitResponse: UploadInitResponse,
        chunk: string,
        chunks: string
    ) {
        // const fileContent = fs.readFileSync(filePath);
        // const blob = new fetch.Blob([fileContent]);
        const data = new FormData();
        data.append('Content-Type', 'image/*');
        data.append('Policy', uploadInitResponse.multipart_params.Policy);
        data.append('X-Amz-Signature', uploadInitResponse.multipart_params['X-Amz-Signature']);
        data.append('acl', uploadInitResponse.multipart_params.acl);
        data.append('key', uploadInitResponse.multipart_params.key);
        data.append('success_action_status', uploadInitResponse.multipart_params.success_action_status);
        data.append('x-amz-algorithm', uploadInitResponse.multipart_params['x-amz-algorithm']);
        data.append('x-amz-credential', uploadInitResponse.multipart_params['x-amz-credential']);
        data.append('x-amz-date', uploadInitResponse.multipart_params['x-amz-date']);
        data.append('name', fileName);
        data.append('chunk', chunk);
        data.append('chunks', chunks);
        data.append('Filename', uploadInitResponse.s3_filename);
        data.append('file', fs.readFileSync(filePath));

        const headers = {
            ...data.getHeaders(),
        };
        // const { data } = await fileUploadInstance.get<any>(`/api/upload/poll?items=${items}`);

        const res = await fileUploadInstance.post(s3Url, data, { headers });
        const resultObj = await parseXmlToObj<XMLResponse>(res?.data);
        return resultObj?.PostResponse;
    }

    @asyncErrorHandler
    public static async registerUploadChunk(chunkNumber: string, uploadInitResponse: UploadInitResponse) {
        const payload = {
            chunkNumber: chunkNumber,
            targetid: uploadInitResponse.s3file.targetid,
            filename: uploadInitResponse.s3_filename,
        };

        const headers = {
            charset: 'utf-8',
        };
        const { data } = await bynderApiInstance.post<any>(
            `/api/v4/upload/${uploadInitResponse.s3file.uploadid}`,
            payload,
            { headers }
        );
        return data;
    }

    @asyncErrorHandler
    public static async finalizeCompletelyUploadedFile(
        chunks: string,
        originalFilename: string,
        uploadInitResponse: UploadInitResponse
    ) {
        const payload = qs.stringify({
            chunks: chunks,
            targetid: uploadInitResponse.s3file.targetid,
            s3_filename: uploadInitResponse.s3_filename,
            original_filename: originalFilename,
        });
        const { data } = await bynderApiInstance.post<BynderFinalizeUploadResponse>(
            `/api/v4/upload/${uploadInitResponse.s3file.uploadid}`,
            payload
        );
        return data;
    }

    @asyncErrorHandler
    public static async pollUploadStatus(items: string) {
        const { data } = await bynderApiInstance.get<PollUploadResponse>(`/api/v4/upload/poll/?items=${items}`);
        return data;
    }

    @asyncErrorHandler
    public static async savingACompletedUpload(
        brandId: string,
        originalFilename: string,
        itemsDone: string,
        audit: boolean
    ) {
        const payload = qs.stringify({
            brandId: brandId,
            name: originalFilename,
            audit: audit,
        });
        const { data } = await bynderApiInstance.post<CompletedAssetSaveRes>(
            `/api/v4/media/save/${itemsDone}`,
            payload
        );
        return data;
    }
    @asyncErrorHandler
    public static async savingANewVersionUpload(
        brandId: string,
        originalFilename: string,
        itemsDone: string,
        audit: boolean,
        media_id: string
    ) {
        const payload = qs.stringify({
            brandId: brandId,
            name: originalFilename,
            audit: audit,
        });
        const { data } = await bynderApiInstance.post<CompletedAssetSaveRes>(
            `/api/v4/media/${media_id}/save/${itemsDone}`,
            payload
        );
        return data;
    }

    @asyncErrorHandler
    public static async updateBynderAsset(media_id: string, payload: BynderAssetUpdateData) {
        const { data } = await bynderApiInstance.post(`/api/v4/media/${media_id}`, payload);
        return data;
    }
    @asyncErrorHandler
    public static async archiveBynderAsset(media_id: string) {
        const payload = {
            archive: true,
        };
        const { data } = await bynderApiInstance.post(`/api/v4/media/${media_id}`, payload);
        return data;
    }
    @asyncErrorHandler
    public static async deleteBynderAsset(media_id: string) {
        const { data } = await bynderApiInstance.delete(`/api/v4/media/${media_id}`);
        return data;
    }

    @asyncErrorHandler
    public static async fetchBynderMetaProperties() {
        const { data } = await bynderApiInstance.get(`/api/v4/metaproperties`);
        return data;
    }
}
