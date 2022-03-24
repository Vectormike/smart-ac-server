import { Model, ModelObject } from 'objection';

export class Admin extends Model {
  id!: number;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'admins'; // database table name
  static idColumn = 'id'; // id column name

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    delete json.createAt;
    delete json.updatedAt;
    delete json.role;
    return json;
  }
}

export type AdminShape = ModelObject<Admin>;
