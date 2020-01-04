const setUpModelTest = require('test/models/setUpModelTest')
const path = require('path')
const randomstring = require('randomstring').generate

const seedLocation = path.join(__dirname, 'user.seed.yaml')

test('inserting user', async () => {
  const { models, seed } = await setUpModelTest(seedLocation)
  const User = models.user
  const role = seed.role[0]

  const payload = {
    username: randomstring(),
    password: randomstring(),
  }

  const user = await role.$relatedQuery('users').insert(payload)

  expect(user).toBeInstanceOf(User)

  // check inserted values
  expect(user.username).toBe(payload.username)

  // check automaticly inserted values
  expect(user.passwordHash.length).toBe(96)
  expect(user.passwordHash.startsWith('$argon2i')).toBe(true)
  expect(user.password).toEqual(undefined)
})

test('querying users', async () => {
  const { models, seed } = await setUpModelTest(seedLocation)
  const User = models.user
  const role = seed.role[0]

  const payload = {
    username: randomstring(),
    password: randomstring(),
  }

  // should only contain the system user at the start
  let users = await User.query()
  expect(users.length).toBe(1)

  // insert the role
  await role.$relatedQuery('users').insert(payload)

  // query again
  users = await User.query()
  // all tests are standalone,
  // we should have no interference from the insert in
  // the previous test
  expect(users.length).toBe(2)
  expect(users[1].username).toBe(payload.username)
})

test('Two users with the same password should have unequal hash', async () => {
  const { seed } = await setUpModelTest(seedLocation)
  const role = seed.role[0]

  const password = randomstring(15)

  const inserted = await Promise.all([
    role.$relatedQuery('users').insert({
      username: randomstring(),
      password,
    }),
    role.$relatedQuery('users').insert({
      username: randomstring(),
      password,
    }),
  ])

  expect(inserted[0].passwordHash).not.toBe(inserted[1].passwordHash)
})

test('Checking user password', async () => {
  const { seed } = await setUpModelTest(seedLocation)
  const role = seed.role[0]

  const payload = {
    username: randomstring(),
    password: randomstring(),
  }

  const user = await role.$relatedQuery('users').insert(payload)

  await Promise.all([
    user.checkPassword(payload.password).then((result) => {
      expect(result).toBe(true)
    }),
    user.checkPassword(`${payload.password} invalid`).then((result) => {
      expect(result).toBe(false)
    }),
  ])
})

test('Weak password should error out', async () => {
  const { seed } = await setUpModelTest(seedLocation)
  const role = seed.role[0]

  const payload = {
    username: randomstring(),
    password: 'guessable',
  }

  const e = 'Password is too weak'
  await expect(role.$relatedQuery('users').insert(payload)).rejects.toThrow(e)
})
