import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { DeviceService } from './device.service';

export interface IDeviceController {
  registerDevice: RequestHandler;
}

export function DeviceControllerFactory(deviceService: DeviceService): IDeviceController {
  return {
    async registerDevice(req: Request, res: Response): Promise<any> {
      const { body } = req;

      try {
        const device = await deviceService.registerDevice(body);
        return res.status(httpStatus.CREATED).json({
          success: 'success',
          statusCode: httpStatus.CREATED,
          message: 'Device registered successfully',
          data: device,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
