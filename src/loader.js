const { TIMEOUT_IN_MILLISECONDS_BY_EVENT } = require("./config");
const { onMessagesUpsert } = require("./middlewares/onMesssagesUpsert");
const { onGroupParticipantsUpdate } = require("./middlewares/onGroupParticipantsUpdate");
const path = require("node:path");
const { errorLog } = require("./utils/logger");
const { badMacHandler } = require("./utils/badMacHandler");

exports.load = (socket) => {
  global.BASE_DIR = path.resolve(__dirname);

  const safeEventHandler = async (callback, data, eventName) => {
    try {
      await callback(data);
    } catch (error) {
      if (badMacHandler.handleError(error, eventName)) return;

      errorLog(`Erro ao processar evento ${eventName}: ${error.message}`);

      if (error.stack) errorLog(`Stack trace: ${error.stack}`);
    }
  };

  socket.ev.on("messages.upsert", async (data) => {
    const startProcess = Date.now();
    setTimeout(() => {
      safeEventHandler(
        () =>
          onMessagesUpsert({
            socket,
            messages: data.messages,
            startProcess,
          }),
        data,
        "messages.upsert"
      );
    }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
  });

  // <-- AQUI, ADICIONE ESSA LINHA PARA O EVENTO DE ENTRADA NO GRUPO:
  socket.ev.on("group-participants.update", (data) =>
    safeEventHandler(
      () => onGroupParticipantsUpdate({ ...data, socket }),
      data,
      "group-participants.update"
    )
  );

  process.on("uncaughtException", (error) => {
    if (badMacHandler.handleError(error, "uncaughtException")) return;
    errorLog(`Erro não capturado: ${error.message}`);
  });

  process.on("unhandledRejection", (reason) => {
    if (badMacHandler.handleError(reason, "unhandledRejection")) return;
    errorLog(`Promessa rejeitada não tratada: ${reason}`);
  });
};