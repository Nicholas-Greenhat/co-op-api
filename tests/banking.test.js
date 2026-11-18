const request = require('supertest');
const app = require('../src/app');

describe('Banking API', () => {
  const validPayload = {
    senderAccountNumber: 'ACC001',
    receiverAccountNumber: 'ACC002',
    amount: 100,
    description: 'Test payment',
  };

  // --- POST /api/transactions ---
  describe('POST /api/transactions', () => {
    it('saves a transaction with PENDING status', async () => {
      const res = await request(app).post('/api/transactions').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.senderAccountNumber).toBe('ACC001');
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app).post('/api/transactions').send({ amount: 100 });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when amount is zero', async () => {
      const res = await request(app).post('/api/transactions').send({ ...validPayload, amount: 0 });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when sender account does not exist', async () => {
      const res = await request(app).post('/api/transactions').send({ ...validPayload, senderAccountNumber: 'INVALID' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // --- POST /api/transfers ---
  describe('POST /api/transfers', () => {
    it('transfers funds and returns COMPLETED status', async () => {
      const res = await request(app).post('/api/transfers').send(validPayload);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
    });

    it('returns 400 on insufficient funds', async () => {
      const res = await request(app).post('/api/transfers').send({ ...validPayload, amount: 999999 });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Insufficient funds/);
    });

    it('returns 400 when sender and receiver are the same', async () => {
      const res = await request(app).post('/api/transfers').send({ ...validPayload, receiverAccountNumber: 'ACC001' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // --- GET /api/accounts/:accountNumber/balance ---
  describe('GET /api/accounts/:accountNumber/balance', () => {
    it('returns balance for a valid account', async () => {
      const res = await request(app).get('/api/accounts/ACC001/balance');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accountNumber).toBe('ACC001');
      expect(res.body.data.currency).toBe('NGN');
      expect(typeof res.body.data.balance).toBe('number');
    });

    it('returns 400 for a non-existent account', async () => {
      const res = await request(app).get('/api/accounts/INVALID/balance');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
