import { DeviceReport } from '../deviceReport/deviceReport.model';
import { Device } from '../device/device.model';
import { CreateDeviceReportInput } from './deviceReport.interface';
import logger from '../../logger';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';
import { AlertService } from '../../components/alert/alert.service';

export class DeviceReportService {
  constructor(private readonly deviceReportModel = DeviceReport, private deviceModel = Device, private readonly alertService: AlertService) {}
  async addDeviceReport(data: CreateDeviceReportInput): Promise<any> {
    const utcDate = new Date(Date.now());
    try {
      // Find the device via serial number
      const device = await this.deviceModel.query().findOne({ serialNumber: data.serialNumber });
      if (!device) {
        logger.info('Device does not exist, should reregister');
        throw new BadRequestError('Device does not exist, should reregister');
      }

      // Check for out of range values
      let sensorValues = { temperature: data.temperature, humidity: data.humidity, carbonMonoxide: data.carbonMonoxide };

      logger.info('Server taking readings...');

      for (const key in sensorValues) {
        if (key === 'temperature') {
          if (sensorValues[key] < -30.0 || sensorValues[key] > 100.0) {
            console.log('Alert 1');

            // Send alert
            await this.alertService.saveAlertData({
              serialNumber: data.serialNumber,
              alert: 'Sensor temperature has value out of range',
              alertDate: utcDate,
              deviceReportId: device.id,
              viewState: 'new',
              resolved: 'new',
            });
          }
        } else if (key === 'humidity') {
          if (sensorValues[key] < 0.0 || sensorValues[key] > 100.0) {
            // Send alert
            await this.alertService.saveAlertData({
              serialNumber: data.serialNumber,
              alert: 'Sensor humidity has value out of range',
              alertDate: utcDate,
              deviceReportId: device.id,
              viewState: 'new',
              resolved: 'new',
            });
          }
        } else if (key === 'carbonMonoxide') {
          if (sensorValues[key] < 0.0 || sensorValues[key] > 1000.0) {
            console.log('Alert 3');

            // Send alert
            await this.alertService.saveAlertData({
              serialNumber: data.serialNumber,
              alert: 'Sensor carbon monoxide has value out of range',
              alertDate: utcDate,
              deviceReportId: device.id,
              viewState: 'new',
              resolved: 'new',
            });
          }
        }
      }

      // socket.emit('Hi');

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
