import RPC from "../src/rpc/index.js";
import { MessageService } from "./services/message";

const server = new RPC.Server({ services: [MessageService] });
const client = new RPC.Client({ services: [MessageService] });
const client2 = new RPC.Client({ services: [MessageService] });
const client3 = new RPC.Client({ services: [MessageService] });

setTimeout(() => {
  client3.services.message.sendMessage('Test message', 0);
}, 500)
setTimeout(() => {
  client3.services.message.sendMessage('Send to all', -1);
}, 1500)
