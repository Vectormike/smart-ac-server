import { DeviceReport } from '../../components/deviceReport/deviceReport.model';
import { Model, ModelObject } from 'objection';

export class Alert extends Model {
  id!: number;
  serialNumber: string;
  alert: string;
  alertDate: Date;
  resolveDate: Date;
  deviceReportId: number;
  viewState: string;
  resolved: string;

  static tableName = 'alerts'; // database table name
  static idColumn = 'id'; // id column name

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: DeviceReport,
        join: {
          from: 'alerts.deviceReportId',
          to: 'deviceReports.id',
        },
      },
    };
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    return json;
  }
}

export type AlertShape = ModelObject<Alert>;
