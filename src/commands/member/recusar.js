const COOLDOWN_RECUSA = 5 * 60 * 1000; // 5 minutos

module.exports = {
  commands: ["recusar"],
  description: "Recusar pedido de casamento com cooldown",
  type: "member",

  handle: async ({ userJid, sendReply }) => {
    if (!global.pedidosCasamento || !global.pedidosCasamento[userJid]) {
      return await sendReply("❌ Você não tem pedido pendente.");
    }

    // Salvar cooldown para o usuário que recusou
    if (!global.cooldownsCasamento) {
      global.cooldownsCasamento = { pedido: {}, recusa: {}, divorcio: {} };
    }

    global.cooldownsCasamento.recusa[userJid] = Date.now();

    delete global.pedidosCasamento[userJid];

    await sendReply("💔 Pedido recusado. Aguarde antes de tentar novamente.");
  },
};