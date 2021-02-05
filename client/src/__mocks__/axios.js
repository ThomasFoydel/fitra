export default {
  get: jest.fn().mockResolvedValue(),
  post: jest.fn((url, body) => {
    return Promise.resolve({
      data: {
        active: body.value,
      },
    });
  }),
  post: (url, body) => {
    return Promise.resolve({
      data: {
        active: body.value,
      },
    });
  },
};
