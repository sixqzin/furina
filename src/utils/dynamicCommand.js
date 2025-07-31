/**
 * Direcionador
 * de comandos.
 *
 * @author Dev Gui
 */
const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");
const {
  verifyPrefix,
  hasTypeOrCommand,
  isLink,
  isAdmin,
} = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
} = require("./database");
const { errorLog } = require("../utils/logger");
const { ONLY_GROUP_ID } = require("../config");
const { badMacHandler } = require("./badMacHandler");

exports.dynamicCommand = async (paramsHandler, startProcess) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    remoteJid,
    sendReply,
    socket,
    userJid,
    fullMessage,
    webMessage,
  } = paramsHandler;

  // Normaliza o userJid somente se definido e string
  let normalizedUserJid;
  if (typeof userJid === "string") {
    normalizedUserJid = userJid.includes("@")
      ? userJid
      : userJid + "@s.whatsapp.net";
  } else {
    normalizedUserJid = undefined;
  }

  // Inicializa isGroupAdmin como falso
  let isGroupAdmin = false;

  // Só tenta buscar participantes se dados existirem
  if (remoteJid && normalizedUserJid && socket) {
    try {
      const metadata = await socket.groupMetadata(remoteJid);
      const participants = metadata.participants;
      isGroupAdmin = participants.some(
        (p) =>
          p.id === normalizedUserJid &&
          (p.admin === "admin" || p.admin === "superadmin")
      );
    } catch (e) {
      console.error("[Erro ao verificar admin]", e);
    }
  }

  // Verifica anti-link protegendo contra undefined e erros
  if (
    typeof isActiveAntiLinkGroup === "function" &&
    remoteJid &&
    fullMessage &&
    webMessage &&
    normalizedUserJid
  ) {
    if (isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
      if (!isGroupAdmin) {
        await socket.groupParticipantsUpdate(remoteJid, [normalizedUserJid], "remove");

        await sendReply(
          "Anti-link ativado! Você foi removido por enviar um link!"
        );

        await socket.sendMessage(remoteJid, {
          delete: {
            remoteJid,
            fromMe: false,
            id: webMessage.key.id,
            participant: webMessage.key.participant,
          },
        });

        return;
      }
    }
  }

  const { type, command } = findCommandImport(commandName);

  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
    if (isActiveAutoResponderGroup(remoteJid)) {
      const response = getAutoResponderResponse(fullMessage);

      if (response) {
        await sendReply(response);
      }
    }

    return;
  }

  if (!(await checkPermission({ type, ...paramsHandler }))) {
    await sendErrorReply("Você não tem permissão para executar este comando!");
    return;
  }

  if (!isActiveGroup(remoteJid) && command.name !== "on") {
    await sendWarningReply(
      "Este grupo está desativado! Peça para o dono do grupo ativar o bot!"
    );

    return;
  }

  // Extrai sender e mencionados do webMessage
  const sender =
    webMessage?.key?.participant || webMessage?.key?.remoteJid || userJid;
  const mentionedJid =
    webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  try {
    await command.handle({
      ...paramsHandler,
      type,
      isGroupAdmin,
      startProcess,

      message: webMessage,
      userJid: sender,
      mentionedJid,
    });
  } catch (error) {
    if (badMacHandler.handleError(error, `command:${command.name}`)) {
      await sendWarningReply(
        "Erro temporário de sincronização. Tente novamente em alguns segundos."
      );
      return;
    }

    if (badMacHandler.isSessionError(error)) {
      errorLog(
        `Erro de sessão durante execução de comando ${command.name}: ${error.message}`
      );
      await sendWarningReply(
        "Erro de comunicação. Tente executar o comando novamente."
      );
      return;
    }

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`Parâmetros inválidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else {
      errorLog("Erro ao executar comando", error);
      await sendErrorReply(
        `Ocorreu um erro ao executar o comando ${command.name}! O desenvolvedor foi notificado!
      
📄 *Detalhes*: ${error.message}`
      );
    }
  }
};