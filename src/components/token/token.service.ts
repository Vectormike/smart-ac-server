import env from '../../helpers/env';
import { Token } from './token.model';
import { CreateTokenInput } from './token.interface';
import { TokenType } from './token.type';
import * as jwt from 'jsonwebtoken';

export class TokenService {
  constructor(private readonly tokenModel = Token) {}

  /**
   * Generates JWT for a user
   * @param data - An object containing the serial number and shared secret
   * @returns { string } - JWT
   */
  private generateJWT(data: CreateTokenInput): string {
    const payload = {
      serialNumber: data.serialNumber,
      sharedSecret: data.sharedSecret,
    };
    return jwt.sign(payload, data.sharedSecret, { expiresIn: '1d' });
  }

  /**
   * Creates a new token
   */
  async create(createTokenInput: CreateTokenInput): Promise<TokenType> {
    const authToken = this.generateJWT(createTokenInput);
    return await this.tokenModel.query().select('token').insert({ token: authToken, deviceId: createTokenInput.deviceId });
  }
}
