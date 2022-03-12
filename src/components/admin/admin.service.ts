import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import env from '../../helpers/env';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../errors';
import { TokenService } from '../token/token.service';
import { CreateAdminInput, LoginInput } from './admin.interface';
import { LoggedInType } from './admin.type';
import { AdminShape, Admin } from '../admin/admin.model';
import logger from '../../logger';

export class AdminService {
  JWT_AUTH_SECRET: string = env.get('JWT_AUTH_SECRET');
  REFRESH_TOKEN_SECRET: string = env.get('REFRESH_TOKEN_SECRET');
  private BCRYPT_SALT: number = parseInt(env.get('BCRYPT_SALT'));

  constructor(private readonly adminModel = Admin, private readonly tokenService: TokenService) {}

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateJWT(user: AdminShape): string {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };
    return jwt.sign(payload, this.JWT_AUTH_SECRET, { expiresIn: '1d' });
  }

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateRefreshToken(user: AdminShape): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: '90d' }, (err, token) => {
        console.log(payload);
        if (err) {
          reject(new Error('Internal Server Error'));
        }
        resolve(token);
      });
    });
  }

  /**
   * Hashes a password and returns the hash
   * @param { string } password - A regular raw readable string
   * @returns a hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_SALT);
  }

  /**
   * Runs a set of necessary operations before a user account is created
   * @param { createUserInput } createUserInput - An object containing the data required for creating a new user
   */
  async runPreUserCreationProcesses(createUserInput: CreateAdminInput): Promise<any> {
    const hashedPassword = await this.hashPassword(createUserInput.password);
    return {
      hashedPassword,
    };
  }

  async createAdmin(createAdminInput: CreateAdminInput): Promise<AdminShape> {
    const { hashedPassword } = await this.runPreUserCreationProcesses(createAdminInput);
    return await this.adminModel.query().insert({
      ...createAdminInput,
      password: hashedPassword,
    });
  }

  /**
   * Finds a user by username
   */
  async findByEmail(email: string): Promise<AdminShape> {
    return await this.adminModel.query().findOne({ email });
  }

  /**
   * Composes the login data
   */
  private composeLoginData(user: AdminShape, token: string, refreshToken: string): LoggedInType {
    return {
      id: user.id,
      email: user.email,
      token,
      refreshToken,
    };
  }

  /**
   * Creates a new user account
   */
  async register(data: CreateAdminInput): Promise<any> {
    try {
      const user = await this.createAdmin({
        email: data.email,
        password: data.password,
      });

      return {
        email: user.email,
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Logs a user in
   */
  async login(data: LoginInput): Promise<LoggedInType> {
    const genericMessage = 'Invalid email or password';
    console.log('Hi');

    const admin = await this.findByEmail(data.email);

    if (!admin) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    if (!admin.password) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const match = await bcrypt.compare(data.password, admin.password);

    if (!match) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const jwt = this.generateJWT(admin);

    const refreshToken = await this.generateRefreshToken(admin);

    return this.composeLoginData(admin, jwt, refreshToken);
  }

  /**
   *
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      logger.info('Provide a refresh token');
      throw new Error('Provide a refresh token');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
          logger.info('Invalid refresh token');
          return reject(new UnauthorizedError('Invalid refresh token'));
        }

        // redisClient.DEL(`refreshToken:${payload.id}:${refreshToken}`, async (err, result) => {
        //   if (err) {
        //     logger.info('Invalid refresh token');
        //     reject(Error('Invalid refresh token'));
        //   }
        //   resolve();
        // });
      });
    });
  }
}
