import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { CurrentUserType } from '../../shared/types/CurrentUser';
import { AdminService } from './admin.service';

export interface IAdminController {
  register: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
}

export function AdminControllerFactory(adminService: AdminService): IAdminController {
  return {
    /**
     * Signs up a new user
     */
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
  };
}
