// import { ActionHandler } from '@helper/interface/action.handler.interface';
// import { CreateAsset } from '../events/create.asset';
// import { DeleteAsset } from '../events/delete.asset';
// import { EventData } from '../types/webhook.event.types';
// import { logger } from '@config/logger';

// type EventConfig = {
//     [key: string]: (eventData: EventData) => ActionHandler;
// };

// const eventConfig: EventConfig = {
//     asset_added: (eventData: EventData) => new CreateAsset(eventData),
//     asset_modified: (eventData: EventData) => new CreateAsset(eventData),
//     asset_removed: (eventData: EventData) => new DeleteAsset(eventData),
// };

// export const eventFactory = async (eventData: EventData) => {
//     if (eventConfig[eventData.event_name] == null) {
//         logger.error(`No event of name ${eventData['event_name']} found!`);
//         return;
//     }

//     await eventConfig[eventData.event_name](eventData).handle();
// };
