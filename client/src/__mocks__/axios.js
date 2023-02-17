export default {
  post: jest.fn((_, body) => Promise.resolve({ data: { active: body.value } })),
  put: jest.fn((_, body) => Promise.resolve({ data: { active: body.value } })),
  get: jest.fn((_, body) => Promise.resolve({ data: { active: body.value } })),
}
