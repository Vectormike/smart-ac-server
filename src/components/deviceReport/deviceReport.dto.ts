import createValidator from '../../helpers/createValidator';

export class DeviceReportValidator {
  CreateDeviceReportDto = createValidator((Joi) => {
    return {
      serialNumber: Joi.string().required().trim().error(new Error('Serial number is required')),
      temperature: Joi.number().required().error(new Error('Temperature is required')),
      humidity: Joi.number().required().error(new Error('Humidity is required')),
      carbonMonoxide: Joi.number().required().error(new Error('CO level is required')),
      healthStatus: Joi.string().required().error(new Error('Health status is required')),
      deviceReadingDate: Joi.string().required().error(new Error('Device reading time is required')),
    };
  });
}
