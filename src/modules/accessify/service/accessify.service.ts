import { Service } from '@helper/common/service.helper';
import { asyncErrorHandler } from '@helper/decorators/asyncErrorHandler.decorator';
import { BynderHardCodedMetaProperty } from '@modules/bynder/types/bynder.upload.types';
import {
    FolderConfigValue,
    PropertyConfigValue,
    SendIndicatorValue,
    TagConfigValue,
} from '@modules/webhook/types/config.types';
import { accessifyApiInstance } from '../utils/axios.accessify';

/**
 * Abstract Accessify API Service class.
 * An instance of this class cannot be created.
 * Use the static functions of this class.
 * @example
 * const fields = await AccessifyService.fetchFieldProperty(workRequestProperty)
 */
export abstract class AccessifyService extends Service {
    // @asyncErrorHandler
    // public static async fetchFieldProperty() {
    //     const { data } = await accessifyApiInstance.get<PropertyConfigValue[]>('_config_field_mapping');
    //     return data;
    // }
    // public static async fetchTagConfig() {
    //     const { data } = await accessifyApiInstance.get<TagConfigValue[]>('_config_tag_mapping');
    //     return data;
    // }

    // @asyncErrorHandler
    // public static async fetchFolderProperty() {
    //     const { data } = await accessifyApiInstance.get<FolderConfigValue[]>('_config_folder_mapping');
    //     return data;
    // }

    // @asyncErrorHandler
    // public static async fetchSendIndicatorProperty() {
    //     const { data } = await accessifyApiInstance.get<SendIndicatorValue[]>('_config_send_indicator');
    //     return data;
    // }
    // @asyncErrorHandler
    // public static async fetchHardCodedMetaProperties() {
    //     const { data } = await accessifyApiInstance.get<BynderHardCodedMetaProperty>(
    //         '_bynder_hard_coded_meta_properties'
    //     );
    //     return data;
    // }
}
