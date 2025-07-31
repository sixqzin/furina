const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");

const PREFIX = "!"; // ajuste seu prefixo
const LOG_GROUP_ID = "120363420832736605@g.us"; // grupo para logs

const filePathStatus = path.resolve(__dirname, "../../../database/statusFiltro.json");
const filePathPalavroes = path.resolve(__dirname, "../../../database/palavroes.json");

const normalizationMap = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '7': 't',
  '5': 's',
  '8': 'b',
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .split('')
    .map(c => normalizationMap[c] || c)
    .join('');
}

function isGroup(jid = "") {
  return jid.endsWith("@g.us");
}

async function isAdmin(userJid, groupJid, sock) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const participant = metadata.participants.find(p => p.id === userJid);
    return participant?.admin === "admin" || participant?.admin === "superadmin";
  } catch {
    return false;
  }
}

function lerStatus() {
  try {
    const data = fs.readFileSync(filePathStatus, "utf8");
    const json = JSON.parse(data);
    return json.ativado;
  } catch {
    return false;
  }
}

function salvarStatus(status) {
  const json = { ativado: status };
  fs.writeFileSync(filePathStatus, JSON.stringify(json, null, 2));
}

function getPalavroes() {
  try {
    const data = fs.readFileSync(filePathPalavroes, "utf8");
    const json = JSON.parse(data);
    return json.global || [];
  } catch {
    return [];
  }
}

function temPalavraoComSimilaridade(mensagem, listaPalavroes, threshold = 0.8) {
  if (!mensagem) return false;
  const textoNormalizado = normalizeText(mensagem);
  const palavrasTexto = textoNormalizado.split(/\W+/).filter(Boolean);

  return listaPalavroes.some(palavrao => {
    const palavraNormalizada = normalizeText(palavrao);
    return palavrasTexto.some(palavra => {
      const similar = stringSimilarity.compareTwoStrings(palavra, palavraNormalizada);
      return similar >= threshold || palavra === palavraNormalizada;
    });
  });
}

function extractText(message) {
  if (!message) return "";

  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  if (message.documentMessage?.fileName) return message.documentMessage.fileName;
  if (message.audioMessage?.caption) return message.audioMessage.caption;

  return "";
}

module.exports = {
  name: "antipalavrao",
  description: "A vigilância fluida contra a impureza da língua",
  commands: ["antipalavrao"],
  usage: `${PREFIX}antipalavrao 1 ou ${PREFIX}antipalavrao 0`,

  handle: async ({ args, remoteJid, socket, sendSuccessReply, sendWarningReply, sendErrorReply, userJid }) => {
    try {
      const donoJid = "55991888116@s.whatsapp.net"; // seu número
      const isUserAdmin = await isAdmin(userJid, remoteJid, socket);
      const isOwner = userJid === donoJid;

      if (!isGroup(remoteJid)) return sendWarningReply("💧 Este ritual só pode ser realizado dentro dos salões dos grupos.");
      if (!isUserAdmin && !isOwner) return sendWarningReply("🚫 Somente administradores ou o guardião podem comandar esta força.");

      if (!args[0]) {
        return sendWarningReply(
          ` *🛡️ Guardião do Verbo* ❖─╮\n` +
          `│ Comande a corrente da pureza:\n` +
          `│\n` +
          `│ • ${PREFIX}antipalavrao 1  ➜ Invocar o escudo sagrado\n` +
          `│ • ${PREFIX}antipalavrao 0  ➜ Recuar e silenciar a vigilância\n` +
          `╰─────────────────────────────╯`
        );
      }

      const valor = args[0].trim();
      if (valor === "1") {
        salvarStatus(true);
        return sendSuccessReply("💦 A corrente da pureza foi ativada. Que a fonte nos proteja!");
      } else if (valor === "0") {
        salvarStatus(false);
        return sendSuccessReply("🌊 A vigilância se recolheu às profundezas, paz momentânea concedida.");
      } else {
        return sendWarningReply(`❗ O fluxo não compreende este comando. Use ${PREFIX}antipalavrao 1 ou ${PREFIX}antipalavrao 0.`);
      }
    } catch (err) {
      console.error("Erro no comando antipalavrao:", err);
      return sendErrorReply("❌ A corrente se rompeu, falha na invocação.");
    }
  },

  filtroAtivado: () => lerStatus(),

  processMessage: async (message, sock) => {
    try {
      if (!lerStatus()) return;
      if (!message || !message.key || !message.key.remoteJid) return;

      const from = message.key.remoteJid;
      if (!isGroup(from)) return;

      const textoOriginal = extractText(message.message);
      if (!textoOriginal) return;

      const palavroes = getPalavroes();

      if (temPalavraoComSimilaridade(textoOriginal, palavroes, 0.8)) {
        try {
          // Apaga mensagem
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: message.key.id,
              participant: message.key.participant || from,
            },
          });

          const userId = message.key.participant || from;

          // Aviso estilizado no grupo
          await sock.sendMessage(from, {
            text:
              `💧 Ó @${userId.split("@")[0]}, a corrente da pureza foi invocada.\n` +
              `Sua mensagem foi levada pelas águas, pois continha impurezas proibidas.`,
            mentions: [userId],
          });

          // Log para grupo de logs
          await sock.sendMessage(LOG_GROUP_ID, {
            text:
              `🚨 **Guardião da Fonte alerta!**\n` +
              `👤 Usuário: @${userId.split("@")[0]}\n` +
              `🗑️ Mensagem: "${textoOriginal}"\n` +
              `📍 Grupo: ${from}`,
            mentions: [userId],
          });

          console.log("💦 Mensagem impura detectada e purificada.");
        } catch (error) {
          console.error("Erro ao purificar mensagem:", error);
        }
      }
    } catch (err) {
      console.error("Erro interno na vigília do verbo:", err);
    }
  },
};