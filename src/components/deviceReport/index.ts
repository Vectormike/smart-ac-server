import Guards from '../../shared/guards';
import { tokenService } from '../token';
import { DeviceReport } from './deviceReport.model';
import { DeviceReportControllerFactory } from './deviceReport.controller';
import { DeviceReportService } from './deviceReport.service';
import { DeviceReportValidator } from './deviceReport.dto';
import { DeviceReportRouter } from './deviceReport.router';

export const deviceReportService = new DeviceReportService(DeviceReport);

export const deviceReportController = DeviceReportControllerFactory(deviceReportService);

export const deviceReportRouter = DeviceReportRouter({
  controller: deviceReportController,
  guards: Guards,
  validator: new DeviceReportValidator(),
});
