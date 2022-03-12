import { Router } from 'express';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { IDeviceReportController } from './deviceReport.controller';
import { DeviceReportValidator } from './deviceReport.dto';

export function DeviceReportRouter(options: ComponentRouterOptions<IDeviceReportController, DeviceReportValidator>): Router {
  const { controller, validator, guards } = options;

  const router = Router();

  router.post('/add-device-report', validator.CreateDeviceReportDto.validate, controller.addDeviceReport);

  return router;
}
