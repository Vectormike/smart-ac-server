import { Router } from 'express';
import { IAdminController } from './admin.controller';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { AdminValidator } from './admin.dto';

export function AuthRouter(options: ComponentRouterOptions<IAdminController, AdminValidator>): Router {
  const { controller, validator } = options;

  const router = Router();

  router.post('/register', validator.CreateAdminDto.validate, controller.register);

  router.post('/login', validator.LoginDto.validate, controller.login);

  router.post('/logout', validator.RefreshTokenDto.validate, controller.logout);

  router.get('/get-devices', controller.getDevices);

  return router;
}
