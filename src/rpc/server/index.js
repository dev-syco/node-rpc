import Network from 'net';
import { Logger, LoggerMessage } from '../../logger';
import { clientEvents } from '../client';
import { deserializeObject, serializeObject } from '../../utils';

export class Server extends Network.Server {
  constructor(options = {}) {
    const { ip, port, services } = options;
    super(options, (socket) => {
      socket.id = this.sockets.push(socket) - 1;
      socket.write(serializeObject({ event: serverEvents.ID_ASSIGN, payload: { id: socket.id } }));

      socket.on(clientEvents.DATA, (data) => {
        const { event, payload } = deserializeObject(data);
        this.emit(event, socket, payload);
      });
      socket.on(clientEvents.END, (data) => {
        this.sockets.splice(socket.id, 1);
      });
      socket.on(clientEvents.CLOSE, (data) => {
        this.sockets.splice(socket.id, 1);
      });
    });
    this.sockets = [];
    this.startListening(ip, port);
    this.services = this.registerServices(services);
  }

  registerServices(services) {
    const result = {};
    services.forEach((ServiceClass) => {
      const service = new ServiceClass({ server: this });
      if (service.server) {
        result[service.name] = service;
      }
    });

    return result;
  }

  sendDataByClientId(clientId, data) {
    if (this.sockets[clientId]) {
      this.sockets[clientId].write(serializeObject(data));
    } else {
      Logger.error(LoggerMessage.ERROR.CLIENT_NOT_FOUND(clientId));
    }
  }

  sendToAllClients(data) {
    this.sockets.forEach(socket => socket.write(serializeObject(data)));
  }

  startListening(ip = '127.0.0.1', port = 3030) {
    this.bindEvents();
    this.listen(port, ip);
  }

  bindEvents() {
    Object.values(serverEvents).forEach((event) => {
      this.on(event, () => {
        Logger.info(LoggerMessage.INFO.SERVER_EVENT(event));
      });
    });
  }

}

export const serverEvents = {
  CONNECTION: 'connection',
  ERROR: 'error',
  ID_ASSIGN: 'idAssign',
};
