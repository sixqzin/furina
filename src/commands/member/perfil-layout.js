const { loadPerfil, savePerfil } = require("../../utils/perfilUtils");
const renderLayout = require("../../uploads/layouts/index");

module.exports = {
  commands: ["perfil-layout"],
  description: "Escolhe um dos layouts para exibir o seu perfil",
  type: "member",

  handle: async ({ args, userJid, sendReply, socket, remoteJid, message }) => {
    try {
      const numero = userJid.replace(/\D/g, "");
      let perfil = loadPerfil(userJid);

      if (!perfil) {
        perfil = {
          nome: "",
          bio: "",
          elo: "",
          rota: "",
          layout: "layout1",
          casadoCom: "",
        };
      }

      const layoutEscolhido = args[0];

      if (!layoutEscolhido || !/^([1-5])$/.test(layoutEscolhido)) {
        // Lista os layouts disponíveis com preview
        let previewMsg = "🌈 *Escolha seu layout com: /perfil-layout <número>*\n\n";
        for (let i = 1; i <= 5; i++) {
          const txt = renderLayout(`layout${i}`, {
            nome: "Zeno",
            bio: "Gosto de duelar no mid 😎",
            elo: "Grão-Mestre ⭐",
            rotaFavorita: "Meio",
            userTag: `@${numero}`,
            casadoComNome: "Furina 🌊", // Apenas exemplo visual
          });
          previewMsg += `*Layout ${i}:*\n${txt}\n\n`;
        }

        return await sendReply(previewMsg.trim());
      }

      // Atualiza o layout do perfil
      perfil.layout = `layout${layoutEscolhido}`;
      savePerfil(userJid, perfil);

      await sendReply(`✅ Layout atualizado para *layout ${layoutEscolhido}*!`);

      // Reage à mensagem original, se possível
      if (message?.key) {
        try {
          await socket.sendMessage(remoteJid, {
            react: {
              text: "🎨",
              key: message.key,
            },
          });
        } catch (e) {
          console.log("⚠️ Falha ao reagir:", e.message);
        }
      }
    } catch (err) {
      console.error("Erro no /perfil-layout:", err);
      await sendReply("❌ Ocorreu um erro ao definir o layout.");
    }
  },
};