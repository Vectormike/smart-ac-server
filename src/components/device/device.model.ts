import { Model, ModelObject } from 'objection';

export class Device extends Model {
  id!: number;
  serialNumber: string;
  firmwareVersion: string;
  registrationDate: Date;
  recentRegistrationDate!: Date;

  static tableName = 'devices'; // database table name
  static idColumn = 'id'; // id column name

  $formatJson(json) {
    json = super.$formatJson(json);
    return json;
  }
}

export type DeviceShape = ModelObject<Device>;
