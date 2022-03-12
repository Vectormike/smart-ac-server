import { Alert } from './alert.model';
import { AlertService } from './alert.service';

export const alertService = new AlertService(Alert);
