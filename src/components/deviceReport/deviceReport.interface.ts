export interface CreateDeviceReportInput {
  serialNumber: string;
  temperature: number;
  humidity: number;
  carbonMonoxide: number;
  healthStatus: string;
  deviceReadingDate: Date;
}
