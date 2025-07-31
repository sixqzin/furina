const fs = require("fs");
const path = require("path");

// Diretórios e arquivos
const UPLOADS_PERFIS_DIR = path.join(__dirname, "../../uploads/perfis");
const CASAMENTO_FILE = path.join(__dirname, "../../uploads/casamento/casamentos.json");

async function getNomeExibicao(socket, jid) {
  try {
    const contatoInfo = await socket.onWhatsApp(jid);
    if (contatoInfo && contatoInfo.length > 0) {
      const contatoFull = await socket.fetchContact(jid);
      if (contatoFull?.notify) return contatoFull.notify;
    }
    return await socket.fetchDisplayName(jid);
  } catch {
    return jid.split("@")[0];
  }
}

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
    console.error(`[Perfil] Erro ao ler perfil do usuário ${userId}:`, err);
    return null;
  }
}

function loadCasamentos() {
  if (!fs.existsSync(CASAMENTO_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CASAMENTO_FILE, "utf-8"));
  } catch (err) {
    console.error("[Perfil] Erro ao ler casamentos:", err);
    return {};
  }
}

function formatarUptime(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  return `${h}h ${m}m ${s}s`;
}

function normalizeJid(jid) {
  return jid.replace(/\D/g, "");
}

module.exports = {
  commands: ["perfil"],
  description: "Exibe o perfil de um membro com status de casamento",
  type: "member",

  handle: async ({ args, socket, remoteJid, userJid, sendReply, message = {} }) => {
    try {
      let targetId = userJid;

      if (args[0] && args[0].startsWith("@")) {
        const number = args[0].replace(/\D/g, "");
        if (number) targetId = `${number}@s.whatsapp.net`;
      }

      const rawBotJid = socket.user?.id || "";
      const botJid = rawBotJid.split(":")[0] + "@s.whatsapp.net";
      const botNumero = rawBotJid.split(":")[0].split("@")[0];

      const dono = "555591888116@s.whatsapp.net";
      const targetNumber = normalizeJid(targetId);
      const botNumber = normalizeJid(botJid);

      // Perfil exclusivo Furina Bot
      if (targetNumber === botNumber) {
        const uptime = formatarUptime(process.uptime());

        const perfilBot = `
🌊 *Liturgia da Sentinela Azul* 🌊

_"À margem do silêncio, um eco surge..."_

⚖️ *Nome:* Furina Bot  
👤 *Criador:* @${dono.split("@")[0]}  
⏱ *Tempo desperto:* ${uptime}  
📌 *Missão:* Vigiar os grupos sob julgamento eterno

💬 Vozes sussurram comandos...  
💧 E ela responde, com graça e sentença.

╰『 Arconte do Código 』╯
        `.trim();

        await socket.sendMessage(remoteJid, {
          video: fs.readFileSync(path.resolve(__dirname, "../../uploads/furina-perfil.mp4")),
          gifPlayback: true,
          caption: perfilBot,
          mentions: [dono, botJid],
        });

        if (message?.key) {
          await socket.sendMessage(remoteJid, {
            react: {
              text: "💧",
              key: message.key,
            },
          });
        }

        return;
      }

      // Perfil padrão de usuário comum
      let perfil = loadPerfil(targetId);
      if (!perfil) {
        perfil = {
          nome: "",
          bio: "",
          elo: "",
          rota: "",
          layout: "layout1",
        };
        fs.mkdirSync(path.dirname(getPerfilPath(targetId)), { recursive: true });
        fs.writeFileSync(getPerfilPath(targetId), JSON.stringify(perfil, null, 2), "utf-8");

        return await sendReply(
          `🌊 Perfil criado para @${targetId.split("@")[0]}.\nUse /perfil novamente para visualizar.`,
          { mentions: [targetId] }
        );
      }

      const casamentos = loadCasamentos();

      let casadoComJid = null;
      let casadoComNome = null;

      if (casamentos[targetId]) {
        casadoComJid = casamentos[targetId];
        casadoComNome = await getNomeExibicao(socket, casadoComJid);
      }

      const userTag = targetId.split("@")[0];
      const perfilText = `
🪷 Lótus de Perfil - @${userTag}
╭───────────────╮
│ 👤 Nome: ${perfil.nome || "Sem nome"}
│ 📖 Bio: ${perfil.bio || "Sem bio"}
│ 🏅 Elo: ${perfil.elo || "Sem elo"}
│ 🛡️ Rota: ${perfil.rota || "Desconhecida"}
${casadoComJid ? `│ 💍 Casado(a) com: ${casadoComNome} ❤️💍` : ""}
╰───────────────╯
      `.trim();

      const mentions = [targetId];
      if (casadoComJid) mentions.push(casadoComJid);

      const numero = targetId.replace(/\D/g, "");
      const caminhoFoto = path.resolve(__dirname, "../../uploads/fotos", `${numero}.png`);

      if (fs.existsSync(caminhoFoto)) {
        const imagemBuffer = fs.readFileSync(caminhoFoto);
        await socket.sendMessage(remoteJid, {
          image: imagemBuffer,
          caption: perfilText,
          mentions,
        });
      } else {
        await socket.sendMessage(remoteJid, {
          text: perfilText,
          mentions,
        });
      }

      if (message?.key) {
        try {
          await socket.sendMessage(remoteJid, {
            react: {
              text: "✅",
              key: message.key,
            },
          });
        } catch (e) {
          console.log("[Perfil] Não foi possível reagir à mensagem:", e.message);
        }
      }
    } catch (err) {
      console.error("[Perfil] Erro no comando /perfil:", err);
      await sendReply("☕ Ocorreu um erro ao exibir o perfil.");
    }
  },
};