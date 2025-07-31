const fs = require("fs");
const path = require("path");

// Caminho para a pasta dos perfis
const UPLOADS_PERFIS_DIR = path.join(__dirname, "../../uploads/perfis");

function getPerfilPath(userId) {
  const onlyNumbers = userId.replace(/\D/g, "");
  return path.join(UPLOADS_PERFIS_DIR, `${onlyNumbers}.json`);
}

function loadPerfil(userId) {
  const filePath = getPerfilPath(userId);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`[Perfil-Bio] Erro ao ler perfil do usuário ${userId}:`, err);
    return null;
  }
}

function savePerfil(userId, data) {
  const filePath = getPerfilPath(userId);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Perfil-Bio] Erro ao salvar perfil do usuário ${userId}:`, err);
  }
}

module.exports = {
  commands: ["perfil-bio"],
  description: "Edita a biografia do seu perfil.",
  type: "member",

  handle: async ({ userJid, sendReply, args }) => {
    try {
      const bio = args.join(" ").trim();
      if (!bio) {
        await sendReply(
          "✍️ Escreva a nova biografia após o comando.\nExemplo: `/perfil-bio Gosto de duelar no mid`"
        );
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

      perfil.bio = bio;
      savePerfil(numId, perfil);

      await sendReply("✅ Biografia atualizada com sucesso!");
    } catch (err) {
      console.error("Erro no /perfil-bio:", err);
      await sendReply("❌ Ocorreu um erro ao salvar sua biografia.");
    }
  },

  atualizarBio: (id, novaBio) => {
    const perfil = loadPerfil(id) || {
      nome: "",
      bio: "",
      elo: "",
      rota: "",
      layout: "layout1",
    };

    perfil.bio = novaBio;
    savePerfil(id, perfil);
  },
};