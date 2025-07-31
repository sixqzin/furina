// sendMessageLogger.js

module.exports = (sock) => {
  const originalSendMessage = sock.sendMessage.bind(sock);

  sock.sendMessage = async (jid, message, ...rest) => {
    let preview = "";

    if (message.text) {
      preview = message.text.substring(0, 50);
    } else if (message?.buttonsMessage?.contentText) {
      preview = message.buttonsMessage.contentText.substring(0, 50);
    } else {
      preview = JSON.stringify(message).substring(0, 50);
    }

    console.log(`[SEND MESSAGE] Para: ${jid} | Preview: "${preview}"`);

    return originalSendMessage(jid, message, ...rest);
  };

  console.log("[Logger] Logger de envio de mensagens ativado.");
};