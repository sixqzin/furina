// src/commands/member/perfil-foto.js
const fs = require("fs");
const path = require("path");

// ✅ IMPORTA diretamente do Baileys
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const fotosDir = path.join(__dirname, "../../uploads/fotos");

function getFotoPath(userId) {
  const number = userId.replace(/\D/g, "");
  return path.join(fotosDir, `${number}.png`);
}

module.exports = {
  commands: ["perfil-foto"],
  description: "Define a sua foto de perfil.",
  type: "member",

  handle: async ({ userJid, sendReply, message }) => {
    try {
      const context = message?.message?.extendedTextMessage?.contextInfo;
      const quotedMsg = context?.quotedMessage;

      if (!quotedMsg?.imageMessage) {
        return await sendReply("🖼️ Responda a uma imagem para definir como sua foto de perfil.");
      }

      // ✅ Usa o método importado diretamente
      const stream = await downloadContentFromMessage(
        quotedMsg.imageMessage,
        "image"
      );

      const buffer = [];
      for await (const chunk of stream) buffer.push(chunk);
      const imageBuffer = Buffer.concat(buffer);

      const fotoPath = getFotoPath(userJid);
      fs.mkdirSync(path.dirname(fotoPath), { recursive: true });
      fs.writeFileSync(fotoPath, imageBuffer);

      await sendReply("✅ Sua foto de perfil foi atualizada com sucesso!");
    } catch (err) {
      console.error("Erro no /perfil-foto:", err);
      await sendReply("🌊 ❌ Ocorreu um erro ao salvar sua foto de perfil.");
    }
  },
};