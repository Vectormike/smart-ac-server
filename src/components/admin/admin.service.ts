import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import env from '../../helpers/env';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../errors';
import { DeviceReport } from '../deviceReport/deviceReport.model';
import { Alert } from '../alert/alert.model';
import { CreateAdminInput, DateRange, LoginInput } from './admin.interface';
import { LoggedInType } from './admin.type';
import { AdminShape, Admin } from '../admin/admin.model';
import { Device } from '../device/device.model';
import logger from '../../logger';
import { ParamsDictionary } from 'express-serve-static-core';

export class AdminService {
  JWT_AUTH_SECRET: string = env.get('JWT_AUTH_SECRET');
  REFRESH_TOKEN_SECRET: string = env.get('REFRESH_TOKEN_SECRET');
  private BCRYPT_SALT: number = parseInt(env.get('BCRYPT_SALT'));

  constructor(private readonly adminModel = Admin, private readonly deviceModel = Device, private readonly deviceReportModel = DeviceReport, private readonly alertModel = Alert) {}

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateJWT(user: AdminShape): string {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };
    return jwt.sign(payload, this.JWT_AUTH_SECRET, { expiresIn: '1d' });
  }

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateRefreshToken(user: AdminShape): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: '90d' }, (err: any, token: string | PromiseLike<string>) => {
        if (err) {
          reject(new Error('Internal Server Error'));
        }
        resolve(token);
      });
    });
  }

  /**
   * Hashes a password and returns the hash
   * @param { string } password - A regular raw readable string
   * @returns a hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_SALT);
  }

  /**
   * Runs a set of necessary operations before a user account is created
   * @param { createUserInput } createUserInput - An object containing the data required for creating a new user
   */
  async runPreUserCreationProcesses(createUserInput: CreateAdminInput): Promise<any> {
    const hashedPassword = await this.hashPassword(createUserInput.password);
    return {
      hashedPassword,
    };
  }

  async createAdmin(createAdminInput: CreateAdminInput): Promise<AdminShape> {
    const { hashedPassword } = await this.runPreUserCreationProcesses(createAdminInput);
    return await this.adminModel.query().insert({
      ...createAdminInput,
      password: hashedPassword,
    });
  }

  /**
   * Finds a user by username
   */
  async findByEmail(email: string): Promise<AdminShape> {
    return await this.adminModel.query().findOne({ email });
  }

  /**
   * Composes the login data
   */
  private composeLoginData(user: AdminShape, token: string, refreshToken: string): LoggedInType {
    return {
      id: user.id,
      email: user.email,
      token,
      refreshToken,
    };
  }

  async register(data: CreateAdminInput): Promise<any> {
    try {
      const user = await this.createAdmin({
        email: data.email,
        password: data.password,
      });

      return {
        email: user.email,
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-1 - User Login (open endpoint, no auth)
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async login(data: LoginInput): Promise<LoggedInType> {
    const genericMessage = 'Invalid email or password';

    const admin = await this.findByEmail(data.email);

    if (!admin) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    if (!admin.password) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const match = await bcrypt.compare(data.password, admin.password);

    if (!match) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const jwt = this.generateJWT(admin);

    const refreshToken = await this.generateRefreshToken(admin);

    return this.composeLoginData(admin, jwt, refreshToken);
  }

  /**
   *
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      logger.info('Provide a refresh token');
      throw new Error('Provide a refresh token');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET, (err: any, payload: any) => {
        if (err) {
          logger.info('Invalid refresh token');
          return reject(new UnauthorizedError('Invalid refresh token'));
        }

        // redisClient.DEL(`refreshToken:${payload.id}:${refreshToken}`, async (err, result) => {
        //   if (err) {
        //     logger.info('Invalid refresh token');
        //     reject(Error('Invalid refresh token'));
        //   }
        //   resolve();
        // });
      });
    });
  }

  /**
   * BE-ADM-3 - List recently registered devices (secure endpoint, requires auth)
   * @param data
   * @returns
   */
  async getDevices(data: any): Promise<any> {
    try {
      let { page, size } = data;
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 10;
      }
      const pagination: any = {};
      const limit = parseInt(size);
      const offset = (page - 1) * size;

      const devices = await this.deviceModel.query().offset(offset).limit(limit);

      pagination.count = size;
      pagination.page = page;
      return { pagination, devices };
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-4 - List sensor readings for a device by date range (secure endpoint, requires auth)
   * @param param
   * @param query
   * @returns
   */
  async getSensorReadings(param: ParamsDictionary, query: any) {
    const serialNumber = param.serialNumber;
    const dateFrom = query.from;
    const dateTo = query.to;

    try {
      logger.info('Getting sensor readings...');
      const device = await this.deviceModel.query().where({ serialNumber }).first();

      if (!device) {
        throw new NotFoundError('Device not registered');
      }
      return await this.deviceReportModel.query().where({ deviceId: device.id }).whereBetween('serverReadingDate', [dateFrom, dateTo]);
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-6 - List alerts active in the system (secure endpoint, requires auth)
   * @returns
   */
  async listActiveAlerts() {
    try {
      const activeAlerts = await this.alertModel.query().where({ viewState: 'new', resolved: 'new' });
      return activeAlerts;
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-10 - Search for a device by serial number (secure endpoint, requires auth)
   * @param data
   * @returns
   */
  async searchDevice(data: any) {
    const { serialNumber } = data;

    try {
      logger.info('Searching device...');
      const device = await this.deviceModel.query().findOne({ serialNumber });
      return device;
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-7 - Alerts can be marked viewed (secure endpoint, requires auth)
   * @param alertId
   * @returns
   */
  async markAlertViewed(alertId: string): Promise<any> {
    const utcDate = new Date(Date.now());

    try {
      return await this.alertModel.query().update({ resolveDate: utcDate, viewState: 'viewed' }).where({ id: alertId });
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-8 - Alerts can be marked ignored (secure endpoint, requires auth)
   * @param alertId
   * @returns
   */
  async markAlertIgnored(alertId: string): Promise<any> {
    const utcDate = new Date(Date.now());

    try {
      return await this.alertModel.query().update({ resolveDate: utcDate, resolved: 'ignored' }).where({ id: alertId });
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-5 - Aggregate sensor readings for a device by date range (secure endpoint, requires auth)
   * @param param
   * @param query
   */
  async aggregateSensorReading(param: string, query: any): Promise<any> {
    const serialNumber = param;
    const dateFrom = query.from;
    const dateTo = query.to;

    try {
      logger.info('Getting sensor readings...');
      const device = await this.deviceModel.query().where({ serialNumber }).first();
      if (!device) {
        throw new NotFoundError('Device not registered');
      }

      logger.info('Aggregating...');

      const res = await this.deviceReportModel
        .query()
        .select('temperature', 'humidity', 'carbonMonoxide', 'serverReadingDate')
        .where({ deviceId: device.id })
        .whereBetween('serverReadingDate', [dateFrom, dateTo])
        .sum('temperature as totalTemperature')
        .sum('carbonMonoxide as totalCarbonMonoxide')
        .sum('humidity as totalHumidity')
        .groupBy('serverReadingDate');

      return res;
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-11 - Filter devices by registration date (secure endpoint, requires auth)
   * @param query
   * @returns
   */
  async filterDevicesByDate(query: any): Promise<any> {
    const dateFrom = query.from;
    const dateTo = query.to;

    try {
      logger.info('Filtering dates readings...');
      return await this.deviceModel.query().whereBetween('registrationDate', [dateFrom, dateTo]).orderBy('id', 'desc');
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-ADM-9 - Alert data can be listed along with sensor readings (internal logic)
   */
  async getAlertWithReadings(deviceReportId: string): Promise<any> {
    try {
      let results: any = {};

      const alertResponse = await this.alertModel.query().where({ deviceReportId: deviceReportId }).first();
      console.log(alertResponse);

      const deviceReport = await this.deviceReportModel.query().where({ id: alertResponse.deviceReportId }).first();

      results.alert = alertResponse;
      results.report = deviceReport;
      return results;
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
