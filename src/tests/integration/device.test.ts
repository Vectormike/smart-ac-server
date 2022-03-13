import request from 'supertest';
import dotenv from 'dotenv';
import setupTestDB from '../util/setupDB';
import app from '../../app';

setupTestDB();

describe('BE-DEV-1', () => {
  it('A device can self-register with the server (open endpoint, no auth)', async (done) => {
    const res = await request(app).post(`/api/device/register-device`).send({
      serialNumber: '123456789',
      firmwareVersion: '1.0',
    });

    expect(res.status).toBe(201);
    done();
  });
});
