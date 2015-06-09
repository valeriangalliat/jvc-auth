const auth = require('antisocial-auth')
const jvc = require('jvc')

export default auth.override({
  core: {
    checkMessage: ({ uglify, jvc }) =>
      async (user, nonce) => {
        const lowerUser = user.toLowerCase()
        const findByAuthor = x => x.author.toLowerCase() === lowerUser

        const findOrThrow = (xs, f) => {
          const x = Array.find(xs, f)
          if (!x) { throw new Error('Message not found.') }
          return x
        }

        const thread = findOrThrow(
          (await jvc.pm.list()).threads,
          findByAuthor
        )

        const post = findOrThrow(
          (await jvc.pm.thread({ id: thread.id })).messages,
          findByAuthor
        ).post

        return nonce.equals(auth.uglify(post))
      }
  },

  jvc,

  checkMessage: _ => _.core.checkMessage({
    uglify: _.uglify,
    jvc: _.jvc
  })
})
