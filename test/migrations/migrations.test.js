const test = require('ava')
const config = require('config')
const Knex = require('knex')

test('should migrate all the way up and down', (t) => {
  const knex = new Knex(config.knex)
  // check that currentversion is 'none' at the start
  return knex.migrate.currentVersion().then((currentVersion) => {
    t.is(currentVersion, 'none')
  }).then(() => (
    knex.migrate.latest().then(() => (
      // should have a version now
      knex.migrate.currentVersion().then((currentVersion) => {
        t.not(currentVersion, 'none')
      })
    )).then(() => (
      knex.migrate.rollback()).then(() => (
        // check that currentversion is 'none' at the end
        knex.migrate.currentVersion().then((currentVersion) => {
          t.is(currentVersion, 'none')
        })
      )))
  ))
})

