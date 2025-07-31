// src/handlers/messageHandler.js

const antiPalavrao = require("../commands/admin/antipalavrao"); //juste o caminho conforme sua estrutura

async function handleMessage(message, sock) {
  try {
    if (!message || typeof message !== "object") return;
    if (!message.key || !message.key.remoteJid) return;

    // Extrai o texto original da mensagem (pode ser conversa, extendedText, botão, etc)
    const textoOriginal =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      message.message?.buttonsResponseMessage?.selectedButtonId ||
      "";

    const comando = textoOriginal.trim().toLowerCase().split(" ")[0];

    // Ignora para evitar flood de menu
    if (comando === "/menu") {
      return;
    }

    // Processa o filtro anti-palavrão — se ativado, pode deletar mensagens ofensivas
    await antiPalavrao.processMessage(message, sock);

    // Aqui você pode colocar o restante do seu processamento de comandos
    // Exemplo:
    // if (comando === "/outrocomando") { ... }

  } catch (error) {
    console.error("[TAKESHI BOT | ERROR] handleMessage:", error);
  }
}

module.exports = { handleMessage };