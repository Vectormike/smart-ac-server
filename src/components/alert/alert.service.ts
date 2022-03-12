import env from '../../helpers/env';
import { TokenService } from '../token/token.service';
import { Alert } from '../alert/alert.model';
import { CreateAlertInput } from './alert.interface';
import logger from '../../logger';

export class AlertService {
  constructor(private readonly alertModel = Alert) {}
  async saveAlertData(data: CreateAlertInput): Promise<any> {
    const utcDate = new Date(Date.now());

    try {
      // Emit notification

      // Save Alert Data
      return await this.alertModel.query().insert({
        serialNumber: data.serialNumber,
        alert: data.alert,
        alertDate: utcDate,
        deviceReportId: data.deviceReportId,
        viewState: data.viewState,
        resolved: data.resolved,
      });
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
