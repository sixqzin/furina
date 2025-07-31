// src/middlewares/checkPermission.js
const { OWNER_NUMBER, OWNER_LID } = require("../config");
const { toUserJid } = require("../utils");

exports.checkPermission = async ({ type, socket, userJid, remoteJid }) => {
  if (type === "member") return true;

  try {
    const { participants, owner } = await socket.groupMetadata(remoteJid);
    const participant = participants.find(p => p.id === userJid);

    // Logs para entender o problema
    console.log("===== [DEBUG PERMISSÃO] =====");
    console.log("UserJid:", userJid);
    console.log("GroupJid:", remoteJid);
    console.log("Owner:", owner);
    console.log("É dono do grupo?", participant?.id === owner);
    console.log("Admin level:", participant?.admin);
    console.log("É bot owner?", userJid === toUserJid(OWNER_NUMBER) || userJid === OWNER_LID);
    console.log("Tipo exigido:", type);
    console.log("=============================");

    if (!participant) return false;

    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";
    const isBotOwner = userJid === toUserJid(OWNER_NUMBER) || userJid === OWNER_LID;

    if (type === "admin") return isOwner || isAdmin || isBotOwner;
    if (type === "owner") return isOwner || isBotOwner;

    return false;
  } catch (error) {
    console.error("[Erro checkPermission]:", error);
    return false;
  }
};