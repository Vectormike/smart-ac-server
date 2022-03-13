import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { IHelperResponse } from '../../shared/types/Response';
import logger from '../../logger';
import { DeviceService } from './device.service';

export interface IDeviceController {
  registerDevice: RequestHandler;
}

export function DeviceControllerFactory(deviceService: DeviceService): IDeviceController {
  return {
    /**
     * BE-DEV-1 - A device can self-register with the server (open endpoint, no auth)
     * @param req
     * @param res
     * @returns
     */
    async registerDevice(req: Request, res: Response): Promise<IHelperResponse> {
      const { body } = req;

      try {
        const device = await deviceService.registerDevice(body);
        return {
          success: true,
          status: httpStatus.CREATED,
          message: 'Device registered successfully',
          data: device,
        };
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
