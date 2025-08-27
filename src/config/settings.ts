// import { AccessifyService } from '@modules/accessify/service/accessify.service';
// import { PropertyConfig, SendIndicatorConfig, Settings, TagConfig } from '@modules/webhook/types/config.types';
// import { config } from './config';

// const constructSettings = async () => {
//     const [properties, sendIndicator, tagConfigs, hardCodedMetaProperties] = await Promise.all([
//         AccessifyService.fetchFieldProperty(),
//         AccessifyService.fetchSendIndicatorProperty(),
//         AccessifyService.fetchTagConfig(),
//         AccessifyService.fetchHardCodedMetaProperties(),

//     ]);

//     const propertyConfig = {
//         name: 'properties',
//         value: properties,
//     } as PropertyConfig;
//     const tagConfig = {
//         name: 'tagConfig',
//         value: tagConfigs,
//     } as TagConfig;

//     // const folderMappingConfig = {
//     //   name: 'folders',
//     //   value: folderMapping,
//     // } as FolderConfig;

//     const sendIndicatorConfig = {
//         name: 'sendIndicator',
//         value: sendIndicator,
//     } as SendIndicatorConfig;

//     const deleteBehavior = {
//         name: 'deleteBehaviour',
//         value: config.config.deleteBehavior,
//     };

//     const useExternalTag = {
//         name: 'useExternalTag',
//         value: config.bynder.useExternalTag,
//     };
//     const bynderHardCodedMetaPropertyConfig = {
//         name: 'bynderHardCodedMetaProperties',
//         value: hardCodedMetaProperties,
//     };

//     return [propertyConfig, sendIndicatorConfig, deleteBehavior, useExternalTag, tagConfig, bynderHardCodedMetaPropertyConfig] as Settings;
// };

// export const settings = constructSettings();
