const fs = require("fs");
const path = require("path");

const PREFIX = "!";
const filePathPalavroes = path.resolve(__dirname, "../../../database/palavroes.json");

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

module.exports = {
  commands: ["del-palavrao"],
  description: "Libera palavras da corrente da pureza (ADM)",
  usage: `${PREFIX}del-palavrao palavra1, palavra2, ...`,

  handle: async ({
    args,
    remoteJid,
    socket,
    sendSuccessReply,
    sendWarningReply,
    sendErrorReply,
    userJid,
  }) => {
    try {
      if (!isGroup(remoteJid)) {
        return sendWarningReply("💧 Este ritual só pode ser realizado dentro dos salões dos grupos.");
      }

      const donoJid = "55991888116@s.whatsapp.net"; // Guardião Supremo
      const admin = await isAdmin(userJid, remoteJid, socket);
      const isOwner = userJid === donoJid;

      if (!admin && !isOwner) {
        return sendWarningReply("🚫 Apenas os nobres administradores ou o guardião podem alterar o fluxo da pureza.");
      }

      const palavrasInput = args.join(" ");
      const palavrasRemover = palavrasInput
        .split(",")
        .map(p => p.trim().toLowerCase())
        .filter(p => p.length > 0);

      if (!palavrasRemover.length) {
        return sendWarningReply(`⚠️ Indique as palavras a serem libertadas. Uso: ${PREFIX}del-palavrao palavra1, palavra2, ...`);
      }

      if (!fs.existsSync(filePathPalavroes)) {
        return sendWarningReply("💧 A corrente da pureza ainda está vazia.");
      }

      const raw = fs.readFileSync(filePathPalavroes, "utf8");
      const json = JSON.parse(raw);
      const palavras = json.global || [];

      const removidas = [];

      for (const palavra of palavrasRemover) {
        const index = palavras.indexOf(palavra);
        if (index !== -1) {
          palavras.splice(index, 1);
          removidas.push(palavra);
        }
      }

      if (removidas.length === 0) {
        return sendWarningReply("🌊 Nenhuma das palavras indicadas repousava na corrente da pureza.");
      }

      json.global = palavras;
      fs.writeFileSync(filePathPalavroes, JSON.stringify(json, null, 2));

      return sendSuccessReply(`💦 As palavras foram libertadas da corrente:\n${removidas.join(", ")}`);
    } catch (err) {
      console.error("Erro ao libertar palavras:", err);
      return sendErrorReply("❌ O fluxo se rompeu, falha ao libertar palavras.");
    }
  },
};