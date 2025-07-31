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
  commands: ["add-palavrao"],
  description: "Invoca as palavras impuras para serem banidas do santuário (ADM)",
  usage: `${PREFIX}add-palavrao palavra1, palavra2, ...`,

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
      const novasPalavras = palavrasInput
        .split(",")
        .map(p => p.trim().toLowerCase())
        .filter(p => p.length > 0);

      if (!novasPalavras.length) {
        return sendWarningReply(`⚠️ O ritual precisa de palavras! Use: ${PREFIX}add-palavrao palavra1, palavra2, ...`);
      }

      let palavroes = { global: [] };
      const dir = path.dirname(filePathPalavroes);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      if (fs.existsSync(filePathPalavroes)) {
        const raw = fs.readFileSync(filePathPalavroes, "utf8");
        palavroes = JSON.parse(raw);
      }

      const adicionadas = [];

      for (const palavra of novasPalavras) {
        if (!palavroes.global.includes(palavra)) {
          palavroes.global.push(palavra);
          adicionadas.push(palavra);
        }
      }

      if (adicionadas.length === 0) {
        return sendWarningReply("🌊 As palavras já repousam na corrente da pureza.");
      }

      fs.writeFileSync(filePathPalavroes, JSON.stringify(palavroes, null, 2));

      return sendSuccessReply(`💦 As palavras foram seladas na corrente da pureza:\n${adicionadas.join(", ")}`);
    } catch (err) {
      console.error("Erro ao invocar palavras impuras:", err);
      return sendErrorReply("❌ O fluxo se rompeu, falha ao invocar palavras.");
    }
  },
};