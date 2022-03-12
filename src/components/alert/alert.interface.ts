export interface CreateAlertInput {
  serialNumber: string;
  alert: string;
  alertDate: Date;
  deviceReportId: number;
  viewState: string;
  resolved: string;
}
