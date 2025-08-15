import request from 'supertest';
import app from '../app'; // senin Express app dosyan

describe('Health Check', () => {
  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
