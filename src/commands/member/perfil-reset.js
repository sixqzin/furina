const fs = require("fs");
const path = require("path");

function getPerfilPath(userId) {
  const onlyNumbers = userId.replace(/\D/g, "");
  return path.join(__dirname, `../../uploads/perfis/${onlyNumbers}.json`);
}

function savePerfil(userId, data) {
  const filePath = getPerfilPath(userId);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  commands: ["perfil-reset", "reset-perfil", "resetar-perfil"],
  description: "Reseta seu perfil removendo bio, nome, elo, rota e layout.",
  type: "member",

  handle: async ({ userJid, sendReply }) => {
    try {
      const cleanId = userJid.replace(/\D/g, "");

      const perfilVazio = {
        nome: "",
        bio: "",
        elo: "",
        rota: "",
        layout: "layout1",
      };

      savePerfil(cleanId, perfilVazio);

      await sendReply("🌊 ✅ Seu perfil foi resetado com sucesso! Os dados anteriores foram apagados (foto mantida).");
    } catch (err) {
      console.error("Erro no /perfil-reset:", err);
      await sendReply("❌ Ocorreu um erro ao resetar seu perfil.");
    }
  },
};