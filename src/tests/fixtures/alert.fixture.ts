import { Alert } from '../../components/alert/alert.model';

const alertOne = {
  id: 1,
  serialNumber: '123456789',
  alert: 'Sensor temperature has value out of range',
  alertDate: '2012-02-23',
  resolveDate: '2012-02-23',
  deviceReportId: 1,
  viewState: 'new',
  resolved: 'new',
};

const alertTwo = {
  id: 2,
  serialNumber: '0022345543',
  alert: 'Sensor humidity has value out of range',
  alertDate: '2012-02-20',
  resolveDate: '2012-02-22',
  deviceReportId: 2,
  viewState: 'new',
};

const inserAlerts = async (alerts: any) => {
  await Alert.query().insert(alerts.map((alert: any) => alert));
};

export { alertOne, alertTwo, inserAlerts };
