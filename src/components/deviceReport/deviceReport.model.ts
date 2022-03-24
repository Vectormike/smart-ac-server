import { Model, ModelObject } from 'objection';

export class DeviceReport extends Model {
  id!: number;
  deviceId: number;
  temperature: number;
  humidity: number;
  carbonMonoxide: number;
  healthStatus: string;
  deviceReadingDate: Date;
  serverReadingDate: Date;
  invalidDataCount: number;

  static tableName = 'deviceReports'; // database table name
  static idColumn = 'id'; // id column name

  $formatJson(json) {
    json = super.$formatJson(json);
    return json;
  }
}

export type DeviceShape = ModelObject<DeviceReport>;
