import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { AdminService } from './admin.service';
import { IHelperResponse } from '../../shared/types/Response';

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
  getAlertWithReadings: RequestHandler;
}

export function AdminControllerFactory(adminService: AdminService): IAdminController {
  return {
    async register(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { body } = req;

      try {
        const user = await adminService.register(body);

        return res.send({
          success: true,
          status: httpStatus.CREATED,
          message: 'User account was created successfully.',
          data: user,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-1 - User Login (open endpoint, no auth)
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { body } = req;

      try {
        const loginData = await adminService.login(body);
        return res.send({
          message: 'Logged in successfully',
          success: true,
          status: httpStatus.OK,
          data: loginData,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      try {
        const { refreshToken } = req.body;

        await adminService.logout(refreshToken);

        return res.send({
          message: 'Successfully logged out',
          status: httpStatus.OK,
          success: true,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-3 - List recently registered devices (secure endpoint, requires auth)
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getDevices(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { query } = req;

      try {
        const devices = await adminService.getDevices(query);
        return res.send({
          message: 'Devices fetched successfully',
          status: httpStatus.OK,
          success: true,
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-4 - List sensor readings for a device by date range (secure endpoint, requires auth)
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getSensorReadings(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { params, query } = req;

      try {
        const devices = await adminService.getSensorReadings(params, query);
        return res.send({
          message: 'Sensor readings fetched successfully',
          status: httpStatus.OK,
          success: true,
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-6 - List alerts active in the system (secure endpoint, requires auth)
     * @returns
     */
    async listActiveAlerts(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      try {
        const device = await adminService.listActiveAlerts();
        return res.send({
          message: 'Device fetched successfully',
          status: httpStatus.OK,
          success: true,
          data: device,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-10 - Search for a device by serial number (secure endpoint, requires auth)
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async searchDevice(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { params } = req;

      try {
        const device = await adminService.searchDevice(params);
        return res.send({
          message: 'Device fetched successfully',
          status: httpStatus.OK,
          success: true,
          data: device,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-7 - Alerts can be marked viewed (secure endpoint, requires auth)
     * @param req
     * @param res
     * @returns
     */
    async markAlertViewed(req: Request, res: Response): Promise<IHelperResponse | any> {
      const { params } = req;

      try {
        await adminService.markAlertViewed(params.alertId);
        return res.send({
          success: true,
          status: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },

    /**
     * BE-ADM-8 - Alerts can be marked ignored (secure endpoint, requires auth)
     * @param req
     * @param res
     * @returns
     */
    async markAlertIgnored(req: Request, res: Response): Promise<IHelperResponse | any> {
      const { params } = req;

      try {
        await adminService.markAlertIgnored(params.alertId);
        return res.send({
          success: true,
          status: httpStatus.OK,
          message: 'Device alert resolved',
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
      }
    },

    /**
     * BE-ADM-5 - Aggregate sensor readings for a device by date range (secure endpoint, requires auth)
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async aggregateSensorReading(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { params, query } = req;

      try {
        const devices = await adminService.aggregateSensorReading(params.serialNumber, query);
        return res.send({
          message: 'Aggregation successfully',
          status: httpStatus.OK,
          success: true,
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-11 - Filter devices by registration date (secure endpoint, requires auth)
     * @param req
     * @param res
     * @returns
     */
    async filteredDevices(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { query } = req;

      try {
        const devices = await adminService.filterDevicesByDate(query);
        return res.send({
          success: true,
          status: httpStatus.OK,
          message: 'Device filtered successfully',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * BE-ADM-11 - Filter devices by registration date (secure endpoint, requires auth)
     * @param req
     * @param res
     * @returns
     */
    async getAlertWithReadings(req: Request, res: Response, next: NextFunction): Promise<IHelperResponse | any> {
      const { params } = req;

      try {
        const devices = await adminService.getAlertWithReadings(params.deviceReportId);
        return res.send({
          success: true,
          status: httpStatus.OK,
          message: 'Device filtered successfully',
          data: devices,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },
  };
}
