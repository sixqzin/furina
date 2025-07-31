const { agendar } = require("./src/utils/agendamentoGrupo");

// Mock do socket com sendMessage simulando envio no WhatsApp
const socketMock = {
  sendMessage: async (jid, mensagem) => {
    console.log(`📤 Mensagem enviada para ${jid}:`);
    console.log(mensagem.text);
  }
};

// Inicia o agendador com o socket simulado
agendar(socketMock);

console.log("🔁 Aguardando horário configurado em horarioGrupo.json...");