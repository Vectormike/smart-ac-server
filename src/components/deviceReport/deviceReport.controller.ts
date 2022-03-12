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
        const deviceReport = deviceReportService.addDeviceReport(body);
        return res.status(httpStatus.CREATED).json({
          status: 'success',
          statusCode: httpStatus.CREATED,
          message: 'Device report registered successfully',
          data: deviceReport,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
