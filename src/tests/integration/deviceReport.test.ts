import request from 'supertest';
import setupTestDB from '../util/setupDB';
import app from '../../app';

setupTestDB();

describe('BE-DEV-2', () => {
  it('A device will continually report its sensor readings to the server (secure endpoint, requires auth)', async (done) => {
    const res = await request(app).post(`/api/device-report/add-device-report`).send({
      serialNumber: '123456789',
      temperature: 20.0,
      humidity: 100.0,
      carbonMonoxide: 20.0,
      healthStatus: 'Ok',
      deviceReadingDate: '2021-02-01',
    });
    expect(res.status).toBe(201);
    done();
  });
});
