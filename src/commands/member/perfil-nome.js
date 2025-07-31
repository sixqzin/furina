const fs = require("fs");
const path = require("path");

const perfisDir = path.join(__dirname, "../../uploads/perfis");

function getPerfilPath(id) {
  const number = id.replace(/\D/g, "");
  return path.join(perfisDir, `${number}.json`);
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
  commands: ["perfil-nome"],
  description: "Edita o nome do seu perfil.",
  type: "member",

  handle: async ({ userJid, args, sendReply }) => {
    try {
      const nome = args.join(" ").trim();

      if (!nome) {
        await sendReply("✍️ Envie o nome desejado após o comando.\nExemplo: `/perfil-nome Zeno`");
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

      perfil.nome = nome;
      savePerfil(numId, perfil);

      await sendReply(` ✅ Seu nome foi atualizado para: *${nome}*`);
    } catch (err) {
      console.error("Erro no /perfil-nome:", err);
      await sendReply("❌ Ocorreu um erro ao atualizar seu nome.");
    }
  },
};