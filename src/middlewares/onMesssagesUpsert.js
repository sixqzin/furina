const {
  isAtLeastMinutesInPast,
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAddOrLeave,
} = require("../utils");

const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { onGroupParticipantsUpdate } = require("./onGroupParticipantsUpdate");
const { errorLog } = require("../utils/logger");
const { badMacHandler } = require("../utils/badMacHandler");
const { checkIfMemberIsMuted } = require("../utils/database");
const { handleMessage } = require("../handlers/messageHandler");
const antipalavrao = require("../commands/admin/antipalavrao");
const afk = require("../commands/member/afk"); // ✅ Importado o comando AFK

exports.onMessagesUpsert = async ({ socket, messages, startProcess }) => {
  if (!messages.length) return;

  for (const webMessage of messages) {
    try {
      const timestamp = webMessage.messageTimestamp;
      if (isAtLeastMinutesInPast(timestamp)) continue;

      // Entradas e saídas de grupo
      if (isAddOrLeave.includes(webMessage.messageStubType)) {
        let action = "";
        if (webMessage.messageStubType === GROUP_PARTICIPANT_ADD) {
          action = "add";
        } else if (webMessage.messageStubType === GROUP_PARTICIPANT_LEAVE) {
          action = "remove";
        }

        await onGroupParticipantsUpdate({
          userJid: webMessage.messageStubParameters[0],
          remoteJid: webMessage.key?.remoteJid,
          socket,
          action,
        });

        continue;
      }

      // Ignora se não for mensagem válida
      if (!webMessage.message || !webMessage.key?.remoteJid) continue;

      const commonFunctions = loadCommonFunctions({ socket, webMessage });

      // Processamento de mensagens diretas no grupo
      await handleMessage(webMessage, socket);

      // Sistema antipalavrão
      try {
        await antipalavrao.processMessage({
          message: webMessage.message,
          remoteJid: webMessage.key.remoteJid,
          socket,
          senderJid: webMessage.key.participant || webMessage.key.remoteJid,
        });
      } catch (e) {
        console.log("Erro interno no antipalavrao:", e.message);
      }

      // ✅ SISTEMA AFK
      await afk.checkAfkRemoval(socket, webMessage);
      await afk.checkMentionAfk(socket, webMessage);

      if (!commonFunctions) continue;

      const isMuted = checkIfMemberIsMuted(
        commonFunctions.remoteJid,
        commonFunctions.userJid
      );

      if (isMuted) {
        try {
          await commonFunctions.deleteMessage(webMessage.key);
        } catch (error) {
          errorLog(
            `Erro ao deletar mensagem de membro silenciado: ${error.message}`
          );
        }

        return;
      }

      // Comando dinâmico do bot
      await dynamicCommand(
        {
          ...commonFunctions,
          message: webMessage, // necessário para reações etc.
        },
        startProcess
      );
    } catch (error) {
      if (badMacHandler.handleError(error, "message-processing")) continue;

      if (badMacHandler.isSessionError(error)) {
        errorLog(`Erro de sessão ao processar mensagem: ${error.message}`);
        continue;
      }

      errorLog(`Erro ao processar mensagem: ${error.message}`);
    }
  }
};