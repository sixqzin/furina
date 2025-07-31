// src/commands/member/perfil-elo.js
const fs = require("fs");
const path = require("path");

const perfisDir = path.join(__dirname, "../../uploads/perfis");

function getPerfilPath(id) {
  return path.join(perfisDir, `${id.replace(/\D/g, "")}.json`);
}

function loadPerfil(id) {
  const filePath = getPerfilPath(id);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath));
}

function savePerfil(id, data) {
  fs.mkdirSync(perfisDir, { recursive: true });
  fs.writeFileSync(getPerfilPath(id), JSON.stringify(data, null, 2));
}

module.exports = {
  commands: ["perfil-elo"],
  description: "Define seu elo (rank) no perfil.",
  type: "member",

  handle: async ({ userJid, sendReply, args }) => {
    try {
      const elo = args.join(" ").trim();
      if (!elo) {
        await sendReply("🏆 Escreva o nome do seu elo após o comando.\nExemplo: `/perfil-elo Grão-Mestre ⭐`");
        return;
      }

      const numId = userJid.replace(/\D/g, "");
      let perfil = loadPerfil(numId);

      if (!perfil) {
        perfil = {
          nome: "",
          bio: "",
          elo: "",
          rota: "",
          layout: "layout1",
        };
      }

      perfil.elo = elo;
      savePerfil(numId, perfil);

      await sendReply(`🏆 Seu elo foi atualizado para: *${elo}*`);
    } catch (err) {
      console.error("Erro no /perfil-elo:", err);
      await sendReply("❌ Ocorreu um erro ao salvar seu elo.");
    }
  },
};