module.exports = {
  commands: ["menu"],
  description: "Mostra o menu com botões",
  type: "member",

  handle: async ({ socket, remoteJid, message }) => {
    try {
      const msg = {
        text: "📋 *Menu principal*\nEscolha uma opção abaixo:",
        buttons: [
          { buttonId: "/ping", buttonText: { displayText: "/ping" }, type: 1 },
          { buttonId: "/perfil", buttonText: { displayText: "/perfil" }, type: 1 },
        ],
        headerType: 1
      }

      await socket.sendMessage(remoteJid, msg, { quoted: message });
    } catch (err) {
      console.error("Erro ao enviar botão:", err);
    }
  }
}
