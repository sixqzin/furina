const { getHorarios } = require("./horarioManager");
const { fecharGrupo, abrirGrupo } = require("./groupScheduler");

const groupId = "120363402755632235@g.us";

function fraseFechar(hora) {
  return `🌌🐚 *Furina silencia as águas:*\n\nO grupo fechou às *${hora}*.\n\nA noite cai, e os sussurros do oceano pedem descanso.\n\nDurmam bem. Amanhã, navegamos novamente. 🌊💤`;
}

function fraseAbrir(hora) {
  return `☀️🌊 *Furina chama o vento das marés:*\n\nO grupo abriu às *${hora}.*\n\nA brisa fresca traz novas ideias e inspiração.\n\nAbra o coração para a felicidade que o dia oferece.\n\nHoje é o seu dia de brilhar! 🐬💖`;
}

async function iniciarAgendamentoGrupo(socket, enviarMensagemInicial = true) {
  console.log("⏳ Iniciando verificador manual de agendamento...");

  const estado = {
    ultimoFechamento: null,
    ultimoAbertura: null,
  };

  const { horarioFechar, horarioAbrir } = getHorarios();
  const agora = new Date();

  const [minFechar, horaFechar] = horarioFechar.split(" ");
  const [minAbrir, horaAbrir] = horarioAbrir.split(" ");

  const alvoFechar = new Date(agora);
  alvoFechar.setHours(horaFechar, minFechar, 0, 0);

  const alvoAbrir = new Date(agora);
  alvoAbrir.setHours(horaAbrir, minAbrir, 0, 0);

  const horaAtual = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (
    agora >= alvoFechar &&
    (!estado.ultimoFechamento ||
      new Date(estado.ultimoFechamento).toDateString() !== agora.toDateString())
  ) {
    await fecharGrupo(socket, groupId);
    if (enviarMensagemInicial) {
      await socket.sendMessage(groupId, { text: fraseFechar(horaAtual) });
    }
    estado.ultimoFechamento = agora.toISOString();
    console.log(`[✅ START] Grupo fechado às ${horaAtual}`);
  }

  if (
    agora >= alvoAbrir &&
    (!estado.ultimoAbertura ||
      new Date(estado.ultimoAbertura).toDateString() !== agora.toDateString())
  ) {
    await abrirGrupo(socket, groupId);
    if (enviarMensagemInicial) {
      await socket.sendMessage(groupId, { text: fraseAbrir(horaAtual) });
    }
    estado.ultimoAbertura = agora.toISOString();
    console.log(`[✅ START] Grupo aberto às ${horaAtual}`);
  }

  setInterval(async () => {
    const agoraInterno = new Date();

    const horaAtualInterno = agoraInterno.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (
      agoraInterno >= alvoFechar &&
      (!estado.ultimoFechamento ||
        new Date(estado.ultimoFechamento).toDateString() !== agoraInterno.toDateString())
    ) {
      await fecharGrupo(socket, groupId);
      await socket.sendMessage(groupId, { text: fraseFechar(horaAtualInterno) });
      estado.ultimoFechamento = agoraInterno.toISOString();
      console.log(`[✅ AGENDAMENTO] Grupo fechado às ${horaAtualInterno}`);
    }

    if (
      agoraInterno >= alvoAbrir &&
      (!estado.ultimoAbertura ||
        new Date(estado.ultimoAbertura).toDateString() !== agoraInterno.toDateString())
    ) {
      await abrirGrupo(socket, groupId);
      await socket.sendMessage(groupId, { text: fraseAbrir(horaAtualInterno) });
      estado.ultimoAbertura = agoraInterno.toISOString();
      console.log(`[✅ AGENDAMENTO] Grupo aberto às ${horaAtualInterno}`);
    }
  }, 60 * 1000);

  console.log(`🔁 Aguardando horários configurados em horarioGrupo.json...`);
}

module.exports = { iniciarAgendamentoGrupo };