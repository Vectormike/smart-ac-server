import Guards from '../../shared/guards';
import { DeviceReport } from './deviceReport.model';
import { DeviceReportControllerFactory } from './deviceReport.controller';
import { DeviceReportService } from './deviceReport.service';
import { DeviceReportValidator } from './deviceReport.dto';
import { DeviceReportRouter } from './deviceReport.router';
import { alertService } from '../../components/alert';
import { Device } from '../../components/device/device.model';

export const deviceReportService = new DeviceReportService(DeviceReport, Device, alertService);

export const deviceReportController = DeviceReportControllerFactory(deviceReportService);

export const deviceReportRouter = DeviceReportRouter({
  controller: deviceReportController,
  guards: Guards,
  validator: new DeviceReportValidator(),
});
