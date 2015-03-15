# jvc-auth [![npm version](http://img.shields.io/npm/v/jvc-auth.svg?style=flat-square)](https://www.npmjs.org/package/jvc-auth)

> Authenticate [jeuxvideo.com] users.

[jeuxvideo.com]: https://www.jeuxvideo.com/

Overview
--------

This library uses [antisocial-auth] over [jvc] to allow any website to
authenticate jeuxvideo.com users, being sure they own the username they
claimed.

[antisocial-auth]: https://github.com/valeriangalliat/antisocial-auth
[jvc]: https://github.com/valeriangalliat/jvc

Protocol
--------

1. An user wants to authenticate to your application with their
   jeuxvideo.com username.
1. You generate a nonce and ask them to send it in a private mesage to a
   bot user you own.
1. When the user confirm they're done, check the bot private messages
   for the nonce.
1. If the nonce is found, the user is authenticated.

Usage
-----

You need to override the `jvc` property with a logged in instance
(in a bot account) so the library can access the bot private messages.

You can use the [`jvc.login`](https://github.com/valeriangalliat/jvc#login)
method to go through the login/password/captcha process. But you're
encouraged to do this just once and store the cookie to reuse it. In the
example below, I assume you already have a valid cookie.

```js
const defaultAuth = require('jvc-auth')

const auth = defaultAuth.override({
  jvc: defaultAuth.jvc.override({ user: { cookie: 'your-bot-cookie' } }),
})
```

### Generate a nonce

```js
// Get nonce buffer.
const nonce = await auth.generateNonce()

// Nice encoding of the nonce to show to the user.
const displayNonce = auth.beautify(nonce)
```

### Verify a message

```js
if (await auth.checkMessage('user', nonce)) {
  // The user is authenticated.
}
```

Demo
----

See the [`demo`](demo) directory, which contains a concrete usage
example with an Express web app.
