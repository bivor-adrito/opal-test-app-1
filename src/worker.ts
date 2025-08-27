const path = require('path');

require('ts-node').register();

require(path.resolve(__dirname, `./worker.${process.env.NODE_ENV === 'production' ? 'js' : 'ts'}`));

const { QueuingService } = require('./modules/queue/queue.service');
const { eventFactory } = require('./modules/webhook/utils/event.factory');

QueuingService.setWorker(eventFactory);
