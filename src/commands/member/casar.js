const fs = require("fs");
const path = require("path");

const CASAMENTO_DIR = path.join(__dirname, "../../uploads/casamento");
const CASAMENTO_FILE = path.join(CASAMENTO_DIR, "casamentos.json");
const PEDIDOS_FILE = path.join(CASAMENTO_DIR, "pedidosPendentes.json");
const COOLDOWN_FILE = path.join(CASAMENTO_DIR, "cooldownDivorcio.json");

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
  commands: ["casar"],
  description: "Pede outro membro em casamento com a bênção da Arconte Hydro",
  type: "member",

  handle: async ({ args, userJid, remoteJid, sendReply, socket }) => {
    const casamentos = loadJson(CASAMENTO_FILE);
    const pedidosPendentes = loadJson(PEDIDOS_FILE);
    const cooldowns = loadJson(COOLDOWN_FILE);

    // Verificar se já está casado
    if (casamentos[userJid]) {
      await sendReply("💍 Sob a bênção da Arconte Hydro, seu coração já pertence a alguém. Não é permitido um novo juramento.");
      return;
    }

    // Verificar cooldown de divórcio
    if (cooldowns[userJid] && cooldowns[userJid] > Date.now()) {
      const tempoRestante = Math.ceil((cooldowns[userJid] - Date.now()) / 1000);
      await sendReply(`⏳ As águas da Corte ainda julgam seu último romance. Aguarde mais ${tempoRestante} segundos antes de tentar novamente.`);
      return;
    }

    // Verificar se mencionou alguém
    const mentioned = args[0]?.match(/@(\d+)/);
    if (!mentioned) {
      await sendReply("💡 Use: /casar @numero");
      return;
    }

    const parceiroJid = `${mentioned[1]}@s.whatsapp.net`;

    // Impedir que a pessoa se case consigo mesma
    if (parceiroJid === userJid) {
      await sendReply("🪞 Nem mesmo Furina ousaria amar apenas a si mesma... Escolha outro.");
      return;
    }

    // Verifica se o parceiro já está casado
    if (casamentos[parceiroJid]) {
      await sendReply(`💔 @${mentioned[1]} já selou um compromisso sob a lua de Fontaine.`, { mentions: [parceiroJid] });
      return;
    }

    // Verifica se já existe pedido pendente para o parceiro
    if (pedidosPendentes[parceiroJid]) {
      await sendReply(`🔔 Um pedido já ecoa nos salões da Corte. Aguarde a resposta de @${mentioned[1]}.`, { mentions: [parceiroJid] });
      return;
    }

    // Salvar pedido pendente
    pedidosPendentes[parceiroJid] = userJid;
    saveJson(PEDIDOS_FILE, pedidosPendentes);

    // Enviar mensagem de pedido com tema Furina
    await socket.sendMessage(remoteJid, {
      text: `🌊✨ Sob o julgamento das marés e o olhar severo da Justiça de Fontaine...\n\n@${mentioned[1]}, o coração de @${userJid.split("@")[0]} transborda como as águas sagradas de Elynas.\n\n💞 Desejas unir teu destino ao meu e formar um laço que nem mesmo as correntes do destino possam romper?\n\nResponda com *aceitar* ou *recusar*, pois a balança aguarda tua decisão... ⚖️`,
      mentions: [userJid, parceiroJid],
    });
  },
};