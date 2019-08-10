const setUpModelTest = require('test/models/setUpModelTest')
const randomstring = require('randomstring').generate

describe('Test the role model', () => {
  test('Inserting role', async () => {
    const { models } = await setUpModelTest()
    const Role = models.role

    const payload = {
      name: randomstring(),
    }

    const role = await Role.query().insert(payload)
    expect(role).toBeInstanceOf(Role)
    expect(role.name).toBe(payload.name)
  })

  test('Querying roles', async () => {
    const { models } = await setUpModelTest()
    const Role = models.role

    // should only contain the system role at the start
    let roles = await Role.query()
    expect(roles.length).toBe(1)

    await Role.query().insert({ name: 'test role 2' })

    roles = await Role.query()
    // all tests are standalone,
    // we should have no interference from the insert in the previous test
    // therefore we should now have 2 roles
    expect(roles.length).toBe(2)
  })
})
