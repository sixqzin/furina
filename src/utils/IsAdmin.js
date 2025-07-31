const { OWNER_NUMBER } = require("../config");

/**
 * Verifica se o usuário é admin do grupo ou dono do bot.
 * @param {string} userJid - JID do usuário (ex: 5599999999999@s.whatsapp.net)
 * @param {string} groupJid - JID do grupo (ex: 5599999999999-123456@g.us)
 * @param {object} socket - Instância do Baileys
 * @returns {Promise<boolean>}
 */
async function isAdmin(userJid, groupJid, socket) {
  try {
    const cleanJid = userJid.endsWith("@s.whatsapp.net")
      ? userJid
      : `${userJid}@s.whatsapp.net`;

    // Dono do bot tem permissão sempre
    if (cleanJid === OWNER_NUMBER) return true;

    const metadata = await socket.groupMetadata(groupJid);
    const participant = metadata.participants.find(p => p.id === cleanJid);

    return participant?.admin === "admin" || participant?.admin === "superadmin";
  } catch (err) {
    console.error("Erro ao verificar admin:", err);
    return false;
  }
}

module.exports = isAdmin;
