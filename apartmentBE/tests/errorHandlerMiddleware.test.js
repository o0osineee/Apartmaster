const errorHandler = require('../src/middlewares/errorHandlerMiddleware');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandlerMiddleware', () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('uses err.statusCode when present instead of defaulting to 500', () => {
    const err = new Error('Not found');
    err.statusCode = 404;
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Not found' })
    );
  });

  it('defaults to 500 when no statusCode is attached', () => {
    const err = new Error('boom');
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('maps MySQL duplicate-entry errors to 409 with a friendly message', () => {
    const err = new Error('Duplicate entry');
    err.code = 'ER_DUP_ENTRY';
    err.sqlMessage = "Duplicate entry 'A102' for key 'apartment.code'";
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json.mock.calls[0][0].message).toContain('code');
  });

  it('only includes the stack trace in development', () => {
    const err = new Error('boom');

    process.env.NODE_ENV = 'production';
    const prodRes = mockRes();
    errorHandler(err, {}, prodRes, () => {});
    expect(prodRes.json.mock.calls[0][0].stack).toBeUndefined();

    process.env.NODE_ENV = 'development';
    const devRes = mockRes();
    errorHandler(err, {}, devRes, () => {});
    expect(devRes.json.mock.calls[0][0].stack).toBeDefined();
  });
});
