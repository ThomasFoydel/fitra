export default {
  post: jest.fn((url, body) => {
    return Promise.resolve({
      data: {
        active: body.value,
      },
    });
  }),
  get: jest.fn((url, body) => {
    return Promise.resolve({
      data: {
        active: body.value,
      },
    });
  }),
};
