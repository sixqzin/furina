const { setHorarioAbrir } = require("../../utils/horarioManager");
const { iniciarAgendamentoGrupo } = require("../../utils/agendamentoGrupo");

module.exports = {
  commands: ["set-horario-abrir"],
  description: "Define o horário para abrir o grupo (formato HH:MM).",
  type: "admin",

  handle: async ({ args, sendReply, socket }) => {
    const horario = args[0];
    if (!horario || !/^\d{2}:\d{2}$/.test(horario)) {
      return await sendReply("❌ Formato inválido. Use: /set-horario-abrir 06:00");
    }

    const [hora, minuto] = horario.split(":");
    const cronExp = `${parseInt(minuto)} ${parseInt(hora)} * * *`;

    setHorarioAbrir(cronExp);
    await iniciarAgendamentoGrupo(socket, false); // NÃO enviar mensagem inicial

    await sendReply(`✅ Horário de *abertura* do grupo definido para *${horario}* com sucesso!`);
  },
};