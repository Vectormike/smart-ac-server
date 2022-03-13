import { Device } from '../../components/device/device.model';

const deviceOne = {
  id: 1,
  serialNumber: '123456789',
  firmwareVersion: '1.0',
  registrationDate: '2020-2-2',
  recentRegistrationDate: '2020-2-2',
};

const deviceTwo = {
  id: 2,
  serialNumber: '234567532',
  firmwareVersion: '2.0',
  registrationDate: '2020-1-2',
  recentRegistrationDate: '2020-3-2',
};

const inserDevices = async (devices: any) => {
  await Device.query().insert(devices.map((device: any) => device));
};

export { deviceOne, deviceTwo, inserDevices };
