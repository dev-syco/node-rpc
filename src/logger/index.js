import { currentDateTime } from "../utils";

export class Logger {
  static info(message) {
    console.log(`[Log ${ currentDateTime() }]:`, message);
  }

  static error(message) {
    console.log(`[Error ${ currentDateTime() }]:`, message);
  }
}

export const LoggerMessage = {
  INFO: {
    CLIENT_CONNECTED: '[Client] connected',
    CLIENT_EVENT: (name, data) => `[Client] received ${ name } event${ data && `, with data: ${ data }` }`,
    SERVER_EVENT: (name) => `[Server] received ${ name } event`,
    CLIENT_MESSAGE_SENT: (message, receiverId) => `[Client] message '${ message }' sent to ${ receiverId === -1 ? 'all' : `#${ receiverId }` }`,
    CLIENT_MESSAGE_RECEIVED: (message, senderId, receiverId) => `[Client #${ receiverId }] received message '${ message }'${ receiverId !== -1 ? '' : `from #${ receiverId }` }`
  },
  ERROR: {
    CONNECTION_REFUSED: 'Server not available',
    CLIENT_NOT_READY: 'Client not ready',
    SERVICE_REQUIRES_NAME: 'Service should contain name property',
    ERROR_WHILE_DESERIALIZING_OBJECT: 'Error while deserializing object',
    ERROR_WHILE_SERIALIZING_OBJECT: 'Error while serializing object',
    CLIENT_NOT_FOUND: (id) => `Client with id ${ id } not found`
  }
}
