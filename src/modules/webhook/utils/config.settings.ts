
// import { singleton } from '@helper/decorators/singleton.decorator';
// import { PropertyConfig, SendIndicatorConfig, DeleteBehaviour, FolderConfig, Settings, UseExternalTag, TagConfig, BynderHardCodedMetaPropertiesConfig } from '../types/config.types';
// import { settings } from '@config/settings';
// import { logger } from '@config/logger';

// @singleton
// class ConfigSettings {
//   public sendIndicator: SendIndicatorConfig;
//   public properties: PropertyConfig;
//   public deleteBehaviour: DeleteBehaviour;
//   public useExternalTag: UseExternalTag;
//   public tagConfigs: TagConfig;
//   public bynderHardCodedMetaPropertiesConfig: BynderHardCodedMetaPropertiesConfig;
//   // public folderMapping: FolderConfig;

//   constructor(settings: Settings) {
//     const _sendIndicator = settings.find((s) => s.name === 'sendIndicator');
//     if (_sendIndicator == null) {
//       throw Error('Send indicator not found in config');
//     }

//     const _properties = settings.find((s) => s.name === 'properties');
//     if (_properties == null) {
//       throw Error('Property not found in config');
//     }
//     const _tagConfigs = settings.find((s) => s.name === 'tagConfig');
//     if (_tagConfigs == null) {
//       throw Error('tag mapping not found in config');
//     }

//     const _deleteBehaviour = settings.find((s) => s.name === 'deleteBehaviour');
//     if (_deleteBehaviour == null) {
//       throw Error('Delete behaviour not found in config');
//     }
//     const _useExternalTag = settings.find((s) => s.name === 'useExternalTag');
//     if (_useExternalTag == null) {
//       throw Error('Use External Tags not found in config');
//     }

//     const _bynderHardCodedMetaPropertiesConfig = settings.find((s) => s.name === 'bynderHardCodedMetaProperties');

//     // const _folderMapping = settings.find((s) => s.name === 'folders');
//     // if (_folderMapping == null) {
//     //   throw Error('Folder mapping not found in config');
//     // }

//     this.sendIndicator = _sendIndicator as SendIndicatorConfig;
//     this.properties = _properties as PropertyConfig;
//     this.deleteBehaviour = _deleteBehaviour as DeleteBehaviour;
//     this.useExternalTag = _useExternalTag as UseExternalTag;
//     this.tagConfigs = _tagConfigs as TagConfig;
//     this.bynderHardCodedMetaPropertiesConfig = _bynderHardCodedMetaPropertiesConfig as BynderHardCodedMetaPropertiesConfig;
//     // this.folderMapping = _folderMapping as FolderConfig;
//   }
// }

// export async function getConfigSettings() {
//   const _settings = await settings;
//   logger.info('Settings loaded', _settings);
//   return new ConfigSettings(_settings);
// }
