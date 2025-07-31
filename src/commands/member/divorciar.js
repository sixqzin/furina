const fs = require("fs");
const path = require("path");

const CASAMENTO_DIR = path.join(__dirname, "../../uploads/casamento");
const CASAMENTO_FILE = path.join(CASAMENTO_DIR, "casamentos.json");
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
  commands: ["divorciar"],
  description: "Encerra seu casamento sob a misericórdia da Arconte Hydro",
  type: "member",

  handle: async ({ userJid, sendReply, socket, remoteJid }) => {
    try {
      const casamentos = loadJson(CASAMENTO_FILE);
      const cooldowns = loadJson(COOLDOWN_FILE);

      if (!casamentos[userJid]) {
        await sendReply("🔎 Nenhum juramento encontrado. O tribunal de Fontaine não reconhece esta união.");
        return;
      }

      const parceiroId = casamentos[userJid];
      const agora = Date.now();
      const cooldownMs = 60 * 60 * 1000; // 1 hora

      // Setar cooldown pra ambos
      cooldowns[userJid] = agora + cooldownMs;
      cooldowns[parceiroId] = agora + cooldownMs;

      // Remover casamento de ambos
      delete casamentos[userJid];
      delete casamentos[parceiroId];

      saveJson(CASAMENTO_FILE, casamentos);
      saveJson(COOLDOWN_FILE, cooldowns);

      await socket.sendMessage(remoteJid, {
        text: `💔⚖️ A balança tombou, e os votos foram desfeitos.\n\n@${userJid.split("@")[0]} e @${parceiroId.split("@")[0]} seguirão caminhos distintos, como rios separados por geleiras eternas...\n\n🌧️ Que Furina os perdoe, e que o silêncio das profundezas os abrace com misericórdia.`,
        mentions: [userJid, parceiroId],
      });
    } catch (err) {
      console.error("Erro no /divorciar:", err);
      await sendReply("❌ Ocorreu um erro ao processar o divórcio.");
    }
  },
};