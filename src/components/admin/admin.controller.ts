import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { AdminService } from './admin.service';

export interface IAdminController {
  register: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
  getDevices: RequestHandler;
  getSensorReadings: RequestHandler;
  searchDevice: RequestHandler;
  listActiveAlerts: RequestHandler;
  markAlertViewed: RequestHandler;
  markAlertIgnored: RequestHandler;
  filteredDevices: RequestHandler;
  aggregateSensorReading: RequestHandler;
}

export function AdminControllerFactory(adminService: AdminService): IAdminController {
  return {
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { body } = req;

      try {
        const user = await adminService.register(body);

        return res.status(httpStatus.CREATED).json({
          message: 'User account was created successfully.',
          status: 'success',
          statusCode: httpStatus.CREATED,
          data: user,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * Attempts to log in a user
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { body } = req;

      try {
        const loginData = await adminService.login(body);

        return res.status(httpStatus.OK).json({
          message: 'Logged in successfully',
          status: 'success',
          statusCode: httpStatus.OK,
          data: loginData,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { refreshToken } = req.body;

        await adminService.logout(refreshToken);

        return res.status(httpStatus.OK).send({
          message: 'Successfully logged out',
          statusCode: httpStatus.OK,
          status: 'success',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async getDevices(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { query } = req;

      try {
        const devices = await adminService.getDevices(query);
        return res.status(httpStatus.OK).send({
          message: 'Devices fetched successfully',
          statusCode: httpStatus.OK,
          status: 'success',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async getSensorReadings(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { params, query } = req;

      try {
        const devices = await adminService.getSensorReadings(params, query);
        return res.status(httpStatus.OK).send({
          message: 'Sensor readings fetched successfully',
          statusCode: httpStatus.OK,
          status: 'success',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async listActiveAlerts(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const device = await adminService.listActiveAlerts();
        return res.status(httpStatus.OK).send({
          message: 'Device fetched successfully',
          statusCode: httpStatus.OK,
          status: 'success',
          data: device,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async searchDevice(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { params } = req;

      try {
        const device = await adminService.searchDevice(params);
        return res.status(httpStatus.OK).send({
          message: 'Device fetched successfully',
          statusCode: httpStatus.OK,
          status: 'success',
          data: device,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async markAlertViewed(req: Request, res: Response): Promise<any> {
      const { params } = req;

      try {
        await adminService.markAlertViewed(params.alertId);
        return res.status(httpStatus.OK).json({
          success: 'success',
          statusCode: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },

    async markAlertIgnored(req: Request, res: Response): Promise<any> {
      const { params } = req;

      try {
        await adminService.markAlertIgnored(params.alertId);
        return res.status(httpStatus.OK).json({
          success: 'success',
          statusCode: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },

    async aggregateSensorReading(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { params, query } = req;

      try {
        const devices = await adminService.aggregateSensorReading(params, query);
        return res.status(httpStatus.OK).send({
          message: 'Sensor readings fetched successfully',
          statusCode: httpStatus.OK,
          status: 'success',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async filteredDevices(req: Request, res: Response): Promise<any> {
      const { query } = req;

      try {
        const devices = await adminService.filterDevicesByDate(query);
        return res.status(httpStatus.OK).json({
          success: 'success',
          statusCode: httpStatus.OK,
          message: 'Device filtered successfully',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },
  };
}
