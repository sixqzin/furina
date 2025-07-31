const fs = require("fs");
const path = require("path");

module.exports = {
  commands: ["perfil-help"],
  description: "Exibe os comandos disponíveis para personalização de perfil.",
  type: "member",

  handle: async ({ socket, remoteJid, sendReply, message }) => {
    try {
      const imagemPath = path.join(__dirname, "../../uploads/furina-card.png");

      const textoAjuda = `
╭───❖ 「 🌊 *Ajuda de Perfil* 」 ❖
│
├ 🪪 /perfil - Exibe seu perfil ou o de outro membro.
├ 🎨 /perfil-foto - Envie uma imagem marcada para definir como foto.
├ 🖋️ /perfil-bio Sua bio aqui
├ 📛 /perfil-nome SeuNome
├ 🏆 /perfil-elo Ouro
├ 🛡️ /perfil-rota Topo
├ 🎭 /perfil-layout layout1
├ ♻️ /perfil reset - Apaga seu perfil
│
╰─────────────────────╯
      `.trim();

      if (fs.existsSync(imagemPath)) {
        const imageBuffer = fs.readFileSync(imagemPath);
        await socket.sendMessage(remoteJid, {
          image: imageBuffer,
          caption: textoAjuda,
          quoted: message,
        });
      } else {
        await sendReply("❌ Imagem `furina-card.png` não encontrada em /uploads/");
      }
    } catch (err) {
      console.error("Erro no /perfil-help:", err);
      await sendReply("❌ Ocorreu um erro ao exibir a ajuda de perfil.");
    }
  },
};