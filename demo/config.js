const cli = require('jvc-cli').override({ persistent: false, opts: {} })
const fs = require('fs')

const writeState = () =>
  fs.writeFile(
    'config.json',
    JSON.stringify({ bot: cli.state.jvc.user }, null, 2) + '\n'
  )

cli.user.login()
  .then(writeState)
