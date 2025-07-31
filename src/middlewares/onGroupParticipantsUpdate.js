const { isActiveWelcomeGroup, sendWelcomeFurinaHydro } = require("../utils/welcomeMessage");

exports.onGroupParticipantsUpdate = async ({ socket, remoteJid, userJid, action }) => {
  try {
    if (!remoteJid || !userJid || !remoteJid.endsWith("@g.us") || action !== "add") {
      console.log("[DEBUG] Ignorando evento incompleto:", { action, userJid, remoteJid });
      return;
    }

    console.log("[DEBUG] Boas-vindas ativas para", remoteJid + "?", isActiveWelcomeGroup(remoteJid));
    if (!isActiveWelcomeGroup(remoteJid)) return;

    await sendWelcomeFurinaHydro(socket, remoteJid, userJid);
  } catch (error) {
    console.error("💥 Erro no evento de boas-vindas Furina:", error);
  }
};
