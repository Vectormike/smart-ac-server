import createValidator, { IValidator } from '../../helpers/createValidator';

export class AdminValidator {
  CreateAdminDto = createValidator((Joi) => {
    return {
      email: Joi.string().required().trim().error(new Error('Email is required')),
      password: Joi.string().required().error(new Error('Password is required')),
    };
  });

  LoginDto = createValidator((Joi) => {
    return {
      email: Joi.string().required().trim().error(new Error('Email is required')),
      password: Joi.string().required().error(new Error('Password is required')),
    };
  });

  RefreshTokenDto = createValidator((Joi) => {
    return {
      refreshToken: Joi.string().required().trim().error(new Error('Refresh token is required')),
    };
  });

  GetSensorReadingsDto = createValidator((Joi) => {
    return {
      from: Joi.string().required().trim().error(new Error('Start date is required')),
      to: Joi.string().required().trim().error(new Error('End date is required')),
    };
  });
}
