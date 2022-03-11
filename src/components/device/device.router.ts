import { Router } from 'express';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { IDeviceController } from './device.controller';
import { DeviceValidator } from './device.dto';

export function DeviceRouter(options: ComponentRouterOptions<IDeviceController, DeviceValidator>): Router {
  const { controller, validator } = options;

  const router = Router();

  /**
   * @register - register a user
   */
  router.post('/register-device', validator.CreateDeviceDto.validate, controller.registerDevice);

  return router;
}
