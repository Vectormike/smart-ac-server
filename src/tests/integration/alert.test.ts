import request from 'supertest';
import setupTestDB from '../util/setupDB';
import app from '../../app';

setupTestDB();

describe('BE-DEV-5', () => {
  it('Device alerts may self resolve.', async (done) => {
    const res = await request(app).get(`/api/alert/resolve-alert/:alertId`);
    expect(res.status).toBe(200);
    done();
  });
});
