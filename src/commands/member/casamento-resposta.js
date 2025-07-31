const fs = require("fs");
const path = require("path");

const CASAMENTO_DIR = path.join(__dirname, "../../uploads/casamento");
const CASAMENTO_FILE = path.join(CASAMENTO_DIR, "casamentos.json");
const PEDIDOS_FILE = path.join(CASAMENTO_DIR, "pedidosPendentes.json");

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}

function saveJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  commands: ["aceitar", "recusar"],
  description: "Aceita ou recusa um pedido de casamento pendente",
  type: "member",

  handle: async ({ command, userJid, remoteJid, sendReply, socket }) => {
    const pedidosPendentes = loadJson(PEDIDOS_FILE);
    const casamentos = loadJson(CASAMENTO_FILE);

    const solicitanteId = pedidosPendentes[userJid];

    if (!solicitanteId) {
      await sendReply("💧 Sob as ondas tranquilas, não há nenhum pedido aguardando sua resposta.");
      return;
    }

    if (command === "aceitar") {
      // Registrar casamento para ambos
      casamentos[userJid] = solicitanteId;
      casamentos[solicitanteId] = userJid;
      saveJson(CASAMENTO_FILE, casamentos);

      // Remover pedido pendente
      delete pedidosPendentes[userJid];
      saveJson(PEDIDOS_FILE, pedidosPendentes);

      // Mensagem de sucesso com tema Furina e reação
      await socket.sendMessage(remoteJid, {
        text: `💞✨ Sob o aplauso das ondas e bênção da Arconte Hydro...\n\n@${userJid.split("@")[0]} e @${solicitanteId.split("@")[0]} selaram sua união nas águas eternas de Fontaine!\n\nQue seus caminhos fluam juntos como rios que jamais se separam. 🌊💍`,
        mentions: [userJid, solicitanteId],
      });

    } else if (command === "recusar") {
      // Remover pedido pendente
      delete pedidosPendentes[userJid];
      saveJson(PEDIDOS_FILE, pedidosPendentes);

      // Mensagem de recusa com tema Furina e reação
      await socket.sendMessage(remoteJid, {
        text: `💧 A maré virou...\n\n@${userJid.split("@")[0]} recusou o pedido de @${solicitanteId.split("@")[0]} com a serenidade de um julgamento da Corte Suprema de Fontaine.\n\nQue a dor se esvaia como espuma entre os dedos… e que o tempo cure o coração partido. ⚖️💔`,
        mentions: [userJid, solicitanteId],
      });
    }
  },
};