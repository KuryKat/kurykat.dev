import app from '../app'
import debugModule from 'debug'
import http from 'http'
const debug = debugModule('kurykat.dev')

/**
 * Get port from environment and store in Express.
 */

const port = app.config.server.port
app.app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app.app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error: Record<string, unknown>): void {
  if (error.syscall !== 'listen') {
    throw (error as unknown as Error)
  }

  const type = typeof port === 'string' ? 'Pipe' : 'Port'
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const bind = `${type} ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw (error as unknown as Error)
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening (): void {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port ?? 'nulo'}`
  debug('Listening on ' + bind)
  console.log('Listening on ' + bind)
}
