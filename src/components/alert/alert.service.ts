import { Alert } from '../alert/alert.model';
import { CreateAlertInput } from './alert.interface';
import logger from '../../logger';

export class AlertService {
  constructor(private readonly alertModel = Alert) {}

  // Check for duplicates and merge
  private async checkDuplicateAlert(data: CreateAlertInput, newDate: Date): Promise<any> {
    try {
      const duplicateAlert = await this.alertModel.query().where({ alert: data.alert, serialNumber: data.serialNumber, resolved: 'new' });

      if (duplicateAlert.length) {
        return await this.alertModel.query().patch({ alertDate: newDate }).where({ alert: data.alert, serialNumber: data.serialNumber, resolved: 'new' });
      }
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * BE-DEV-2 - A device will continually report its sensor readings to the server (secure endpoint, requires auth)
   * @param data
   * @returns
   */
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

  /**
   * BE-DEV-5 - Device alerts may self resolve (internal logic)
   * @param req
   * @param res
   * @returns
   */
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
