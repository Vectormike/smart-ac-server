import { Router } from 'express';
import { IAdminController } from './admin.controller';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { AdminValidator } from './admin.dto';

export function AuthRouter(options: ComponentRouterOptions<IAdminController, AdminValidator>): Router {
  const { controller, validator, guards } = options;

  const router = Router();

  router.post('/register', validator.CreateAdminDto.validate, controller.register);

  router.post('/login', validator.LoginDto.validate, controller.login);

  router.post('/logout', validator.RefreshTokenDto.validate, controller.logout);

  router.get('/get-devices', guards.AuthGuard({ strict: true }), controller.getDevices);

  router.get('/get-sensor-readings/:serialNumber', guards.AuthGuard({ strict: true }), controller.getSensorReadings);

  router.get('/search-device/:serialNumber', guards.AuthGuard({ strict: true }), controller.searchDevice);

  router.get('/list-active-alerts', guards.AuthGuard({ strict: true }), controller.listActiveAlerts);

  router.get('/mark-alert-viewed/:alertId', guards.AuthGuard({ strict: true }), controller.markAlertViewed);

  router.get('/mark-alert-ignored/:alertId', guards.AuthGuard({ strict: true }), controller.markAlertIgnored);
  //WIP
  router.get('/aggregate-sensor-readings/:serialNumber', guards.AuthGuard({ strict: true }), controller.aggregateSensorReading);

  router.get('/filter-devices', guards.AuthGuard({ strict: true }), controller.filteredDevices);

  return router;
}
