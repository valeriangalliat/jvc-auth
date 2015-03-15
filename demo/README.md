Demo
====

> Demo for [jvc-auth] usage.

[jvc-auth]: https://github.com/valeriangalliat/jvc-auth

Description
-----------

This is an interactive example to show how to reliably authenticate
[jeuxvideo.com] users using jvc-auth.

[jeuxvideo.com]: https://www.jeuxvideo.com/

Usage
-----

```js
npm install
npm run config
npm start
```

During the `config` step, you will be prompted for the bot username and
password, then a captcha will be [opened] for you to fill. This step is
required so the server can have a persistent connection cookie, and be
restarted without prompting for captcha.

[opened]: https://www.npmjs.com/package/open

The `start` script starts a server on `http://localhost:1337/`, where
you can try the authentication process.
