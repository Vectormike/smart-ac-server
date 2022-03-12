import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { DeviceReportService } from './deviceReport.service';

export interface IDeviceReportController {
  addDeviceReport: RequestHandler;
}

export function DeviceReportControllerFactory(deviceReportService: DeviceReportService): IDeviceReportController {
  return {
    async addDeviceReport(req: Request, res: Response): Promise<ResponseType | any> {
      const { body } = req;
      logger.info(body);

      try {
        const deviceReport = await deviceReportService.addDeviceReport(body);
        if (deviceReport.status === 'error') {
          return res.status(httpStatus.CREATED).json({
            status: 'success',
            statusCode: httpStatus.CREATED,
            message: 'Device report not registered',
          });
        }
        return res.status(httpStatus.CREATED).json({
          status: 'success',
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: 'Device report registered successfully',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
