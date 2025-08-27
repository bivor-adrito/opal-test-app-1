// import { config } from '@config/config';
// import { ActionHandler } from '@helper/interface/action.handler.interface';
// import { ApiError } from '@helper/utils/error.helper';
// import { UpdateBynderAsset } from '@modules/bynder/actions/update.asset';
// import { UploadAssetBynder } from '@modules/bynder/actions/upload.asset';
// import { UploadNewVersionAssetBynder } from '@modules/bynder/actions/version.asset';
// import { BynderApiService } from '@modules/bynder/services/bynder.service';
// import { BynderAssetUpdateData } from '@modules/bynder/types/bynder.asset.types';
// import { CmpAssetService } from '@modules/cmp/services/cmp.service';
// import { Asset, AssetLineage } from '@modules/cmp/types/library.types';
// import { StatusCodes } from 'http-status-codes';
// import { EventData } from '../types/webhook.event.types';
// import { SanityCheck } from '../utils/check.indicator';
// import { getConfigSettings } from '../utils/config.settings';
// import { FieldFormatter } from '../utils/field.formatter';
// import { TagsFormatter } from '../utils/tags.formatter';
// // import  CmpAssetService  from '@modules/cmp/cmp.service';

// export class CreateAsset implements ActionHandler {
//     private assetId: string;
//     private assetUrlSuffix: string;
//     private attributesChanged: string[];
//     private organizationId: string;

//     constructor(private eventData: EventData) {
//         const { asset } = this.eventData.data;
//         const { id: assetId } = asset;

//         this.assetId = assetId;
//         this.assetUrlSuffix = asset.links.self.split('/v3/').at(-1) ?? '';
//         this.attributesChanged = this.eventData.data.attributes_changed ?? [];
//         this.organizationId = asset.owner_organization_id;
//     }

//     /**
//      * Terminates the event with proper message and does related clean up.
//      * @param terminationMessage The message we want to return as the response of the request
//      * @param lineage Asset lineage if we want to clean up
//      */
//     private async terminateAndCleanUp(terminationMessage: string, deleteBehaviour: string, lineage?: AssetLineage) {
//         if (lineage != null) {
//             const mediaId = lineage.uri.split('?mediaId=').at(-1);
//             if (mediaId) {
//                 if (deleteBehaviour === 'Delete') {
//                     await BynderApiService.deleteBynderAsset(mediaId);
//                 }
//                 if (deleteBehaviour === 'Archive') {
//                     await BynderApiService.archiveBynderAsset(mediaId);
//                 }
//             }
//             await CmpAssetService.removeAssetLineage(this.assetId, lineage.id);
//         }

//         throw new ApiError(StatusCodes.METHOD_NOT_ALLOWED, terminationMessage);
//     }

//     handle = async () => {
//         const [assetInfo, lineages, fields, configSettings] = await Promise.all([
//             CmpAssetService.fetchAsset(this.assetUrlSuffix),
//             CmpAssetService.fetchAssetLineage(this.assetId),
//             CmpAssetService.fetchAssetFields(this.assetId),
//             getConfigSettings(),
//         ]);

//         const lastLineage = lineages.filter((lineage: any) => lineage.name === 'Bynder').at(-1);
//         const status = SanityCheck.checkFieldSendIndicator(
//             fields,
//             configSettings.sendIndicator,
//             assetInfo.folder_id,
//             this.organizationId
//         );
//         if (!status.isOk) {
//             return this.terminateAndCleanUp(status.message, configSettings.deleteBehaviour.value, lastLineage);
//         }

//         const fieldsToAdd = FieldFormatter.mapExternalLabelsFromField(
//             fields,
//             configSettings.properties,
//             this.organizationId
//         );
//         const tagsToAdd = TagsFormatter.mapTagsFromField(
//             fields,
//             configSettings.useExternalTag.value,
//             configSettings.tagConfigs.value,
//             configSettings.properties,
//             this.organizationId
//         );

//         //comment to test accessify
//         const bynderUpdateData: BynderAssetUpdateData = {
//             ...fieldsToAdd,
//             tags: tagsToAdd,
//             ...(config.bynder.useHardCodedMetaProperties && configSettings.bynderHardCodedMetaPropertiesConfig.value),
//         };
//         if (!lastLineage) {
//             await this.uploadAssetToBynder(assetInfo, bynderUpdateData);
//         } else {
//             const mediaId = lastLineage?.uri.split('?mediaId=').at(-1);
//             if (mediaId) {
//                 if (this.attributesChanged.includes('version_number')) {
//                     await this.uploadAssetNewVersionToBynder(assetInfo, bynderUpdateData, mediaId);
//                 } else {
//                     await new UpdateBynderAsset(assetInfo, mediaId, bynderUpdateData).handle();
//                 }
//             }
//         }
//     };

//     private async uploadAssetToBynder(assetInfo: Asset, bynderUpdateData: BynderAssetUpdateData) {
//         const upload = new UploadAssetBynder(assetInfo);
//         await upload.handle();
//         const uploadResponse = upload.getBynderCompletedUpload();
//         if (uploadResponse) {
//             await new UpdateBynderAsset(assetInfo, uploadResponse.mediaid, bynderUpdateData).handle();
//         }
//     }

//     private async uploadAssetNewVersionToBynder(
//         assetInfo: Asset,
//         bynderUpdateData: BynderAssetUpdateData,
//         mediaId: string
//     ) {
//         const upload = new UploadNewVersionAssetBynder(assetInfo, mediaId);
//         await upload.handle();
//         const uploadResponse = upload.getBynderCompletedUpload();
//         if (uploadResponse) {
//             await new UpdateBynderAsset(assetInfo, uploadResponse.mediaid, bynderUpdateData).handle();
//         }
//     }
// }
