const { connect } = require("./connection");
const { load } = require("./loader");
const { badMacHandler } = require("./utils/badMacHandler");
const { iniciarAgendamentoGrupo } = require("./utils/agendamentoGrupo");

const {
  successLog,
  errorLog,
  warningLog,
  bannerLog,
  infoLog,
} = require("./utils/logger");

let botStarted = false;

async function startBot() {
  try {
    if (!botStarted) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      process.setMaxListeners(1500);
      bannerLog();
      infoLog("Iniciando meus componentes internos...");
      botStarted = true;
    }

    const stats = badMacHandler.getStats();
    if (stats.errorCount > 0) {
      warningLog(
        `BadMacHandler stats: ${stats.errorCount}/${stats.maxRetries} erros`
      );
    }

    const socket = await connect();

    load(socket);

    setTimeout(() => iniciarAgendamentoGrupo(socket), 5000); // espera 5s antes de rodar o agendador

    successLog("✅ Bot iniciado com sucesso!");

    setInterval(() => {
      const currentStats = badMacHandler.getStats();
      if (currentStats.errorCount > 0) {
        warningLog(
          `BadMacHandler stats: ${currentStats.errorCount}/${currentStats.maxRetries} erros`
        );
      }
    }, 300_000);
  } catch (error) {
    if (badMacHandler.handleError(error, "bot-startup")) {
      warningLog("Erro Bad MAC durante inicialização, tentando novamente...");

      setTimeout(() => {
        startBot();
      }, 5000);
      return;
    }

    errorLog(`Erro ao iniciar o bot: ${error.message}`);
    errorLog(error.stack);
    process.exit(1);
  }
}

startBot();
