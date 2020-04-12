import Network from 'net';
import { Logger, LoggerMessage } from '../../logger';
import { deserializeObject } from '../../utils';
import { serverEvents } from '../server';

export class Client extends Network.Socket {
  constructor(options = {}) {
    const { ip, port, services } = options;
    super(options);
    this.services = this.registerServices(services);
    this.createClient(ip, port);
  }

  registerServices(services) {
    const result = {};
    services.forEach((ServiceClass) => {
      const service = new ServiceClass({ client: this });
      if (service.client) {
        result[service.name] = service;
      }
    });

    return result;
  }

  createClient(ip = '127.0.0.1', port = 3030) {
    this.bindEvents();
    this.connect(port, ip);
  }

  bindEvents() {
    Object.values(clientEvents).forEach((event) => {
      this.on(event, (data) => {
        if (event === clientEvents.DATA) {
          const { event, payload } = deserializeObject(data);
          switch (event) {
            case serverEvents.ID_ASSIGN:
              this.id = payload.id;
              break;
            default:
              this.emit(event, payload);
          }
        } else {
          Logger.info(LoggerMessage.INFO.CLIENT_EVENT(event, data || ''));
        }
      });
    });
  }

}

export const clientEvents = {
  DATA: 'data',
  END: 'end',
  CLOSE: 'close',
  CONNECT: 'connect',
  ERROR: 'error',
  DRAIN: 'drain',
  READY: 'ready',
  TIMEOUT: 'timeout',
};
