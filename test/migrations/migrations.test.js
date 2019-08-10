const config = require('config')
const Knex = require('knex')

describe('Migrations', () => {
  test('Should migrate all the way up and down', async () => {
    const knex = new Knex(config.knex)

    // check that currentversion is 'none' at the start
    let currentVersion = await knex.migrate.currentVersion()
    expect(currentVersion).toBe('none')

    await knex.migrate.latest()
    // should have a version now
    currentVersion = await knex.migrate.currentVersion()
    expect(currentVersion).not.toBe('none')

    // check that currentversion is 'none' at the end
    await knex.migrate.rollback()
    currentVersion = await knex.migrate.currentVersion()
    expect(currentVersion).toBe('none')
  })
})
