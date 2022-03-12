import { Alert } from '../alert/alert.model';
import { CreateAlertInput } from './alert.interface';
import logger from '../../logger';

export class AlertService {
  constructor(private readonly alertModel = Alert) {}

  private async checkDuplicateAlert(data: CreateAlertInput, newDate: Date): Promise<any> {
    try {
      // Check for duplicates and merge
      const duplicateAlert = await this.alertModel.query().where({ alert: data.alert, serialNumber: data.serialNumber, resolved: 'new' });
      console.log(duplicateAlert.length);

      if (duplicateAlert.length) {
        return await this.alertModel.query().patch({ alertDate: newDate }).where({ alert: data.alert, serialNumber: data.serialNumber, resolved: 'new' });
      }
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  async saveAlertData(data: CreateAlertInput): Promise<any> {
    const utcDate = new Date(Date.now());

    try {
      const response = await this.checkDuplicateAlert(data, utcDate);

      if (!response) {
        // Save Alert Data
        return await this.alertModel.query().insert({
          serialNumber: data.serialNumber,
          alert: data.alert,
          alertDate: utcDate,
          deviceReportId: data.deviceReportId,
          viewState: data.viewState,
          resolved: data.resolved,
        });
      }
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  async resolveAlert(alertId: string): Promise<any> {
    const utcDate = new Date(Date.now());

    try {
      return await this.alertModel.query().update({ resolveDate: utcDate, resolved: 'viewed' }).where({ id: alertId });
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
