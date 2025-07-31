const fs = require("fs");
const path = require("path");
const { loadPerfil, savePerfil } = require("../../utils/perfilUtils");

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
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  commands: ["aceitar"],
  description: "Aceita um pedido de casamento pendente",
  type: "member",

  handle: async ({ userJid, sendReply, socket, remoteJid }) => {
    try {
      const pedidosPendentes = loadJson(PEDIDOS_FILE);
      const casamentos = loadJson(CASAMENTO_FILE);

      // Verifica se há pedido pendente para o usuário que quer aceitar
      if (!pedidosPendentes[userJid]) {
        await sendReply("🌊 ❌ Você não tem pedido pendente.");
        return;
      }

      const solicitanteId = pedidosPendentes[userJid];

      // Verifica se algum dos dois já está casado (por segurança)
      if (casamentos[userJid] || casamentos[solicitanteId]) {
        await sendReply("💍 Um dos dois já está casado(a). Divorcie-se primeiro.");
        return;
      }

      // Registrar casamento para ambos
      casamentos[userJid] = solicitanteId;
      casamentos[solicitanteId] = userJid;

      saveJson(CASAMENTO_FILE, casamentos);

      // Remover pedido pendente
      delete pedidosPendentes[userJid];
      saveJson(PEDIDOS_FILE, pedidosPendentes);

      // Atualizar estado civil dos perfis (não modifica bio)
      const perfil1 = loadPerfil(userJid) || {};
      perfil1.estadoCivil = `💧 Casado(a) com @${solicitanteId.split("@")[0]}`;
      savePerfil(userJid, perfil1);

      const perfil2 = loadPerfil(solicitanteId) || {};
      perfil2.estadoCivil = `💧 Casado(a) com @${userJid.split("@")[0]}`;
      savePerfil(solicitanteId, perfil2);

      // Mensagem poética e com menções
      await socket.sendMessage(remoteJid, {
        text: `🌌✨ Sob as bênçãos das águas serenas, @${userJid.split("@")[0]} e @${solicitanteId.split("@")[0]} entrelaçam seus destinos em uma dança eterna. Parabéns pelo enlace! 🥂💙`,
        mentions: [userJid, solicitanteId],
      });
    } catch (err) {
      console.error("Erro no comando /aceitar:", err);
      await sendReply("🌊⚠️ Um murmúrio perturbou as águas e o pedido não pôde ser aceito. Tente novamente.");
    }
  },
};