import Guards from '../../shared/guards';
import { tokenService } from '../token';
import { Device } from './device.model';
import { DeviceControllerFactory } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceValidator } from './device.dto';
import { DeviceRouter } from './device.router';

export const deviceService = new DeviceService(Device, tokenService);

export const deviceController = DeviceControllerFactory(deviceService);

export const deviceRouter = DeviceRouter({
  controller: deviceController,
  guards: Guards,
  validator: new DeviceValidator(),
});
