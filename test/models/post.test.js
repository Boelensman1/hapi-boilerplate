const test = require('ava')
const initModels = require('./initModels')
const PostModel = require('../../models/post')

test.beforeEach((t) => (
  initModels().then((knex) => {
    t.context.Post = PostModel.bindKnex(knex)
  })
))

test('inserting post', (t) => {
  const Post = t.context.Post

  return Post
    .query()
    .insert({ title: 'test post', contents: 'Lorum Ipsum.' })
    .then((post) => {
      t.truthy(post instanceof Post)
      t.is(post.title, 'test post')
      t.is(post.contents, 'Lorum Ipsum.')
    })
})

test('querying posts', (t) => {
  const Post = t.context.Post

  return Post
  .query()
  .then((posts) => {
    t.is(posts.length, 0)
  }).then(() => (
  Post
    .query()
    .insert({ title: 'test post 2', contents: 'Lorum Ipsum.' })
    .then(() => (
      Post
      .query()
      .then((posts) => {
        // all tests are standalone,
        // we should have no interference from the insert in the previous test
        t.is(posts.length, 1)
      })
    ))
  ))
})

