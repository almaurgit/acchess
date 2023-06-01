const mode = 'prod'

let serverDomain = ''

if (mode === 'dev') serverDomain = 'http://localhost:3000'
if (mode === 'prod') serverDomain = 'https://acchess.herokuapp.com'

export default serverDomain
