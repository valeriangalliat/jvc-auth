const config = require('./config.json')
const defaultAuth = require('../index.es6.js')

const auth = defaultAuth.override({
  jvc: defaultAuth.jvc.override({ user: config.bot }),
})

const app = require('express')()
const then = require('express-then')

app.use(require('cookie-parser')('not-so-secret'))
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', (req, res) => {
  const user = req.signedCookies.user
  const profile = user && `https://www.jeuxvideo.com/profil/${user.toLowerCase()}?mode=infos`

  res.render('index', { user, profile })
})

app.get('/logout', (req, res) => {
  res.clearCookie('user')
  res.redirect('/')
})

app.get('/auth', then(async (req, res) => {
  const user = req.query.user
  const nonce = await auth.generateNonce()
  const nonce64 = nonce.toString('base64')
  const beginTime = Date.now()
  const link = `https://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=${user}`

  res.cookie('auth', { user, nonce64, beginTime }, { httpOnly: true, signed: true })
  res.render('auth', { bot: config.bot.user, link, nonce: auth.beautify(nonce) })
}))

app.get('/auth/confirm', then(async (req, res) => {
  const { user, nonce64, beginTime } = req.signedCookies.auth
  const nonce = new Buffer(nonce64, 'base64')

  if (!auth.checkTime(beginTime)) {
    return res.status(401).render('error', { message: 'Authentication timeout expired.' })
  }

  if (!await auth.checkMessage(user, nonce)) {
    return res.status(401).render('error', { message: 'No valid code recieved.' })
  }

  res.cookie('user', user, { httpOnly: true, signed: true })
  res.clearCookie('auth')
  res.redirect('/')
}))

app.listen(1337, () => console.log('Listening at http://localhost:1337/'))
