import Guards from '../../shared/guards';
import { tokenService } from '../token';
import { AdminControllerFactory } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminValidator } from './admin.dto';
import { AuthRouter } from './admin.router';
import { Admin } from './admin.model';

export const authService = new AdminService(Admin, tokenService);

export const adminController = AdminControllerFactory(authService);

export const adminRouter = AuthRouter({
  controller: adminController,
  guards: Guards,
  validator: new AdminValidator(),
});
