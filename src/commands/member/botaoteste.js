const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "botaoteste",
  description: "Testa botões de resposta rápida",
  commands: ["botaoteste"],
  usage: `${PREFIX}botaoteste`,

  handle: async ({ sock, remoteJid }) => {
    await sock.sendMessage(remoteJid, {
      text: 'Escolha uma opção:',
      buttons: [
        { buttonId: '/ping', buttonText: { displayText: '📡 Ping' }, type: 1 },
        { buttonId: '/perfil', buttonText: { displayText: '🙍 Perfil' }, type: 1 }
      ],
      headerType: 1
    });
  }
};
