import { DeviceReport } from '../deviceReport/deviceReport.model';
import { Device } from '../device/device.model';
import { CreateDeviceReportInput } from './deviceReport.interface';
import logger from '../../logger';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';

export class DeviceReportService {
  constructor(private readonly deviceReportModel = DeviceReport, private deviceModel = Device) {}
  async addDeviceReport(data: CreateDeviceReportInput): Promise<any> {
    const utcDate = new Date(Date.now());
    try {
      // Find the device via serial number
      const device = await this.deviceModel.query().findOne({ serialNumber: data.serialNumber });
      if (!device) {
        logger.info('Device does not exist, should reregister');
        throw new BadRequestError('Device does not exist, should reregister');
      }

      // Append device readings
      const deviceReports = await this.deviceReportModel.query().insert({
        deviceId: device.id,
        temperature: data.temperature,
        humidity: data.humidity,
        carbonMonoxide: data.carbonMonoxide,
        healthStatus: data.healthStatus,
        deviceReadingDate: data.deviceReadingDate,
        serverReadingDate: utcDate,
      });

      return deviceReports;
    } catch (error) {
      logger.info(JSON.stringify(error));
      return {
        status: 'error',
        message: 'Internal server error',
      };
    }
  }
}
