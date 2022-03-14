import request from 'supertest';
import setupTestDB from '../util/setupDB';
import app from '../../app';
import { Alert } from '../../components/alert/alert.model';
import { Device } from '../../components/device/device.model';
import { Token } from '../../components/token/token.model';

setupTestDB();

describe('Admin', () => {
  let authToken;

  it('BE-ADM-1: User Login', async (done) => {
    const res = await request(app).post(`/api/admin/login`).send({
      email: 'nigel@email.com',
      password: 'tehpassword$$$',
    });

    authToken = res.body.data.token;

    expect(res.status).toBe(200);
    done();
  });

  it('BE-ADM-3: List recently registered devices', async (done) => {
    const res = await request(app).get(`/api/admin/get-devices`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    done();
  });

  it('BE-ADM-4: List sensor readings for a device by date range', async (done) => {
    const device = await Device.query().where({ id: 1 }).first();
    const res = await request(app)
      .get(`/api/admin/get-sensor-readings/${device.serialNumber}`)
      .query({ from: '2022-03-10', to: '2022-03-13' })
      .set('Authorization', `Bearer ${authToken}`);

    expect(device).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });

  it('BE-ADM-5 - Aggregate sensor readings for a device by date range', async (done) => {
    const device = await Device.query().where({ id: 1 }).first();
    const res = await request(app)
      .get(`/api/admin/get-sensor-readings/${device.serialNumber}`)
      .query({ from: '2022-03-10', to: '2022-03-13' })
      .set('Authorization', `Bearer ${authToken}`);

    expect(device).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });

  it('BE-ADM-6: List alerts active in the system', async (done) => {
    const res = await request(app).get(`/api/admin/list-active-alerts`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    done();
  });

  it('BE-ADM-7: Alerts can be marked viewed', async (done) => {
    const alert = await Alert.query().where({ id: 1 }).first();
    const res = await request(app).get(`/api/admin/mark-alert-viewed/${alert.id}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    done();
  });

  it('BE-ADM-8: Alerts can be marked ignored', async (done) => {
    const alert = await Alert.query().where({ id: 1 }).first();
    const res = await request(app).get(`/api/admin/mark-alert-ignored/${alert.id}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(alert).toBeDefined();

    done();
  });

  it('BE-ADM-9: Alert data can be listed along with sensor readings.', async (done) => {
    // const device = await Device.query().where({ id: 1 }).first();
    const res = await request(app).get(`/api/admin/get-alert-readings/${1}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res).toBeDefined();

    done();
  });

  it('BE-ADM-10: Search for a device by serial number', async (done) => {
    const device = await Device.query().where({ id: 1 }).first();
    const res = await request(app).get(`/api/admin/search-device/${device.serialNumber}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(device).toBeDefined();

    done();
  });
});
