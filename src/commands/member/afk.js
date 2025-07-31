const fs = require("fs");
const path = require("path");

const afkDir = path.join(__dirname, "../../uploads/afk");
const afkPath = path.join(afkDir, "afk.json");

function loadAfk() {
  if (!fs.existsSync(afkDir)) fs.mkdirSync(afkDir, { recursive: true });
  if (!fs.existsSync(afkPath)) fs.writeFileSync(afkPath, "{}");
  try {
    return JSON.parse(fs.readFileSync(afkPath, "utf-8"));
  } catch {
    return {};
  }
}

function saveAfk(data) {
  if (!fs.existsSync(afkDir)) fs.mkdirSync(afkDir, { recursive: true });
  fs.writeFileSync(afkPath, JSON.stringify(data, null, 2));
}

function formatarHora(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

module.exports = {
  name: "afk",
  description: "Ativa o modo ausente (AFK)",
  commands: ["afk"],
  usage: "/afk [motivo opcional]",

  handle: async (params) => {
    const { socket, remoteJid, userJid, args = [] } = params;
    if (!userJid) return;

    const afkData = loadAfk();
    const motivo = args.length ? args.join(" ") : "Ausente";
    const hora = formatarHora(Date.now());

    afkData[userJid] = {
      time: Date.now(),
      reason: motivo,
    };

    saveAfk(afkData);

    await socket.sendMessage(remoteJid, {
      text:
        "╭───❖ 「 *Modo AFK Ativado* 」 ❖\n" +
        "│\n" +
        "├ 🧭 @" +
        userJid.split("@")[0] +
        " desapareceu nas ondas do destino...\n" +
        "├ 📝 *Motivo:* " +
        motivo +
        "\n" +
        "├ ⏱️ *Hora:* " +
        hora +
        "\n" +
        "│\n" +
        "╰──────────────╯",
      mentions: [userJid],
    });
  },

  checkAfkRemoval: async (socket, message) => {
    const userId = message.key.participant || message.key.remoteJid;
    const afkData = loadAfk();

    if (afkData[userId]) {
      delete afkData[userId];
      saveAfk(afkData);

      await socket.sendMessage(message.key.remoteJid, {
        text:
          "╭───❖ 「 *Retorno do Julgamento* 」 ❖\n" +
          "│\n" +
          "├ 👋 @" +
          userId.split("@")[0] +
          " emergiu das águas do silêncio...\n" +
          "├ ✨ Seu modo AFK foi desativado.\n" +
          "│\n" +
          "╰──────────────╯",
        mentions: [userId],
      });
    }
  },

  checkMentionAfk: async (socket, message) => {
    if (message.key.fromMe) return; // 🛡️ ignora mensagens do próprio bot

    const mentions =
      message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    const afkData = loadAfk();

    for (const userId of mentions) {
      const status = afkData[userId];
      if (status) {
        const hora = formatarHora(status.time);

        await socket.sendMessage(message.key.remoteJid, {
          text:
            "⚠️ @" +
            userId.split("@")[0] +
            " está navegando em águas profundas...\n\n" +
            "📝 *Motivo:* " +
            status.reason +
            "\n" +
            "⏱️ *Desde:* " +
            hora +
            "\n\n" +
            "Evite chamá-lo agora, pois Furina exige silêncio em meio ao julgamento. 👑🌊",
          mentions: [userId],
        });
      }
    }
  },

  isAfk: (userId) => {
    const afkData = loadAfk();
    return afkData[userId] || null;
  },
};