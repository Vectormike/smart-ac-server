import Guards from '../../shared/guards';
import { tokenService } from '../token';
import { AdminControllerFactory } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminValidator } from './admin.dto';
import { AuthRouter } from './admin.router';
import { Admin } from './admin.model';
import { Device } from '../device/device.model';

export const authService = new AdminService(Admin, Device);

export const adminController = AdminControllerFactory(authService);

export const adminRouter = AuthRouter({
  controller: adminController,
  guards: Guards,
  validator: new AdminValidator(),
});
