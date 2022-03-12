import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { AlertService } from './alert.service';

export interface IAlertController {
  resolveAlert: RequestHandler;
}

export function AlertControllerFactory(alertService: AlertService): IAlertController {
  return {
    async resolveAlert(req: Request, res: Response): Promise<any> {
      const { params } = req;

      try {
        await alertService.resolveAlert(params.alertId);
        return res.status(httpStatus.OK).json({
          success: 'success',
          statusCode: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
