const setUpModelTest = require('test/models/setUpModelTest')

describe('Test the post model', () => {
  test('inserting post', async () => {
    const { models } = await setUpModelTest()
    const Post = models.post

    const post = await Post
      .query()
      .insert({ title: 'test post', contents: 'Lorum Ipsum.', author: 'testr' })

    expect(post).toBeInstanceOf(Post)
    expect(post.title).toBe('test post')
    expect(post.contents).toBe('Lorum Ipsum.')
  })

  test('querying posts', async () => {
    const { models } = await setUpModelTest()
    const Post = models.post

    let posts = await Post.query()
    expect(posts.length).toBe(0)

    await Post
      .query()
      .insert({ title: 'test post 2', contents: 'Lorum Ipsum.', author: 'testr' })

    posts = await Post.query()
    // all tests are standalone,
    // we should have no interference from the insert in the previous test
    expect(posts.length).toBe(1)
  })
})
