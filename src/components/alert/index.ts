import { Alert } from './alert.model';
import { AlertService } from './alert.service';
import { AlertControllerFactory } from './alert.controller';
import { AlertRouter } from '../alert/alert.route';

export const alertService = new AlertService(Alert);

export const alertController = AlertControllerFactory(alertService);

export const alertRouter = AlertRouter({
  controller: alertController,
});
