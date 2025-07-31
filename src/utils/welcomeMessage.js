const fs = require("fs");
const path = require("path");

const statusPath = path.join(__dirname, "../uploads/welcome/status.json");

function isActiveWelcomeGroup(remoteJid) {
  if (!fs.existsSync(statusPath)) return false;
  const status = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
  return !!status[remoteJid];
}

async function sendWelcomeFurinaHydro(client, remoteJid, participant) {
  const groupMeta = await client.groupMetadata(remoteJid);
  const groupName = groupMeta.subject || "Grupo";
  const userName = (await client.onWhatsApp(participant))[0]?.notify || participant.split("@")[0];

  const imagePath = path.join(__dirname, "../uploads/welcome/bem-vindo.png");

  if (!fs.existsSync(imagePath)) {
    console.log("[Boas-vindas Furina] Imagem não encontrada:", imagePath);
    return;
  }

  const hydroWelcome = `
💧 ────── ❖ ────── 💧
                *Bem-vindo(a)*
💧 ────── ❖ ────── 💧

Olá, *${userName}*.
Que a paz das águas de Fontaine
te envolva aqui no *${groupName}*.

🌊 Deixe a correnteza da amizade
te guiar por memórias inesquecíveis.

📜 Leia as regras do grupo
e apresente-se aos demais viajantes!

╰─⚓─ fluxo sereno ─⚓─╯
`;

  await client.sendMessage(remoteJid, {
    image: { url: imagePath },
    caption: hydroWelcome,
    mentions: [participant],
  });
}

module.exports = { isActiveWelcomeGroup, sendWelcomeFurinaHydro };
