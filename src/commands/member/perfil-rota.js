// src/commands/member/perfil-rota.js
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
  commands: ["perfil-rota"],
  description: "Define sua rota favorita no perfil.",
  type: "member",

  handle: async ({ userJid, sendReply, args }) => {
    try {
      const rota = args.join(" ").trim();
      if (!rota) {
        await sendReply("🛡️ Escreva sua rota favorita após o comando.\nExemplo: `/perfil-rota Suporte`");
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

      perfil.rota = rota;
      savePerfil(numId, perfil);

      await sendReply(`🛡️ Sua rota favorita foi atualizada para: *${rota}*`);
    } catch (err) {
      console.error("Erro no /perfil-rota:", err);
      await sendReply("❌ Ocorreu um erro ao salvar sua rota favorita.");
    }
  },
};