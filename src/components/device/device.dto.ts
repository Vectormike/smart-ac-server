import createValidator from '../../helpers/createValidator';

export class DeviceValidator {
  CreateDeviceDto = createValidator((Joi) => {
    return {
      serialNumber: Joi.string().required().trim().error(new Error('Serial number is required')),
      firmwareVersion: Joi.string().required().error(new Error('Firmware version is required')),
    };
  });
}
