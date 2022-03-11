import env from '../../helpers/env';
import { TokenService } from '../token/token.service';
import { Device } from '../device/device.model';
import { CreateDeviceInput } from './device.interface';
import { DeviceResponseType } from './device.type';
import logger from '../../logger';

export class DeviceService {
  private DEVICE_SHARED_SECRET: string = env.get('DEVICE_SHARED_SECRET');

  constructor(private readonly deviceModel = Device, private readonly tokenService: TokenService) {}
  async registerDevice(data: CreateDeviceInput): Promise<DeviceResponseType> {
    const utcDate = new Date(Date.now());

    try {
      let device: any;
      // Check if Device already exists
      const deviceExists = await this.deviceModel.query().findOne({ serialNumber: data.serialNumber });
      if (!deviceExists) {
        device = await this.deviceModel.query().insert({
          serialNumber: data.serialNumber,
          firmwareVersion: data.firmwareVersion,
          registrationDate: utcDate,
          recentRegistrationDate: utcDate,
        });
      } else {
        let newDate = utcDate;
        device = await this.deviceModel.query().patch({ recentRegistrationDate: newDate }).where({ id: deviceExists.id });
      }
      return await this.tokenService.create({ serialNumber: data.serialNumber, sharedSecret: this.DEVICE_SHARED_SECRET, deviceId: device.id });
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
