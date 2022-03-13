import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { IHelperResponse } from '../../shared/types/Response';
import logger from '../../logger';
import { DeviceReportService } from './deviceReport.service';

export interface IDeviceReportController {
  addDeviceReport: RequestHandler;
}

export function DeviceReportControllerFactory(deviceReportService: DeviceReportService): IDeviceReportController {
  return {
    /**
     * BE-DEV-2 - A device will continually report its sensor readings to the server (secure endpoint, requires auth)
     * @param req
     * @param res
     * @returns
     */
    async addDeviceReport(req: Request, res: Response): Promise<IHelperResponse> {
      const { body } = req;
      logger.info(body);

      try {
        const deviceReport = await deviceReportService.addDeviceReport(body);
        if (deviceReport.status === 'error') {
          return {
            success: true,
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Device report not registered',
          };
        }
        return {
          success: true,
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: 'Device report registered successfully',
        };
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
