import { Model, ModelObject } from 'objection';

export class Alert extends Model {
  id!: number;
  serialNumber: string;
  alert: string;
  alertDate: Date;
  deviceReportId: number;
  viewState: string;
  resolved: string;

  static tableName = 'alerts'; // database table name
  static idColumn = 'id'; // id column name

  $formatJson(json) {
    json = super.$formatJson(json);
    return json;
  }

  //   static get relationMappings() {
  //     return {
  //       account: {
  //         relation: Model.HasOneRelation,
  //         modelClass: Device,
  //         join: {
  //           from: 'account.accountNumber',
  //           to: 'users.id',
  //         },
  //       },
  //     };
  //   }
}

export type AlertShape = ModelObject<Alert>;
