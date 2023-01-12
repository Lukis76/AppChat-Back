import { sendMsg } from "./mutation";
import { msgs } from "./query";
import { send } from "./subscription";
export { sendMsg, msgs, send };

export const subscriptionEvent = {
  msgSend: "MESSAGE_SEND",
  conversationUpdated: "CONVERSATION_UPDATED",
};
