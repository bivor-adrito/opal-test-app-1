import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FieldMapper } from './field.mapper';
import { FieldMapperData } from './types';
import { ActionHandler } from '@helper/interface/action.handler.interface';
type MapperConfig = {
    [key: string]: (eventData: FieldMapperData) => ActionHandler;
};
const mapperConfig: MapperConfig = {
    fieldMapper: (mapperData: FieldMapperData) => new FieldMapper(mapperData.fieldsToMap ??  []),
    // asset_modified: (body) => new CreateAsset(eventData), //todo: WIP
    //   asset_removed: (eventData: EventData) => new DeleteAsset(eventData),
    // };
};

class MapperController {
    public static async handleMapper(req: Request, res: Response, next: NextFunction) {
        const acceptedMapperTypes = ['fieldMapper', 'tagMapper'];

        try {
            const body = req.body as FieldMapperData;
            if (!acceptedMapperTypes.includes(body.mapperType)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'type not allowed' });
                return;
            }

            const mapperHandler = mapperConfig[body['mapperType']];
            if (mapperHandler == null) {
                const message = `No mapper of name ${body['mapperType']} found!`;
                res.status(StatusCodes.BAD_REQUEST).json({ message });
                return;
            }
            const field = await mapperHandler(body).handle();
            return res.status(StatusCodes.OK).json(field)
        } catch (error) {
            next(error);
        }
    }
}

export default MapperController.handleMapper;
