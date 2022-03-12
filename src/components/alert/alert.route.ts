import { Router } from 'express';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { IAlertController } from './alert.controller';

export function AlertRouter(options: ComponentRouterOptions<IAlertController, IAlertController>): Router {
  const { controller } = options;

  const router = Router();

  router.get('/resolve-alert/:alertId', controller.resolveAlert);

  return router;
}
