import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { IHelperResponse } from '../../shared/types/Response';
import logger from '../../logger';
import { AlertService } from './alert.service';

export interface IAlertController {
  resolveAlert: RequestHandler;
}

export function AlertControllerFactory(alertService: AlertService): IAlertController {
  return {
    /**
     * BE-DEV-5 - Device alerts may self resolve (internal logic)
     * @param req
     * @param res
     * @returns
     */
    async resolveAlert(req: Request, res: Response): Promise<IHelperResponse | any> {
      const { params } = req;

      try {
        await alertService.resolveAlert(params.alertId);
        return res.send({
          success: true,
          status: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
