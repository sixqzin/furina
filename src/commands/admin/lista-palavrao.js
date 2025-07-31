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
  commands: ["lista-palavrao"],
  description: "Revela as palavras seladas na corrente da pureza",
  usage: `${PREFIX}lista-palavrao`,

  handle: async ({
    remoteJid,
    socket,
    sendSuccessReply,
    sendWarningReply,
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
        return sendWarningReply("🚫 Apenas os nobres administradores ou o guardião podem desvendar este segredo.");
      }

      if (!fs.existsSync(filePathPalavroes)) {
        return sendWarningReply("🌊 A corrente da pureza está vazia, nenhuma palavra foi selada ainda.");
      }

      const raw = fs.readFileSync(filePathPalavroes, "utf8");
      const json = JSON.parse(raw);
      const palavras = json.global || [];

      if (!palavras.length) {
        return sendWarningReply("🌊 A corrente da pureza está vazia, nenhuma palavra foi selada ainda.");
      }

      const lista = palavras.map((p, i) => `• ${i + 1}. ${p}`).join("\n");

      return sendSuccessReply(
        `📜 *Segredos da corrente da pureza:*\n\n${lista}`
      );
    } catch (err) {
      console.error("Erro ao revelar a lista das palavras:", err);
      return sendWarningReply("❌ O fluxo se rompeu, falha ao revelar a lista.");
    }
  },
};