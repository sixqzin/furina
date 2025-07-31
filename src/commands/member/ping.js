/**
 * Melhorado por: Mkg
 *
 * @author Dev sqxzn
 */
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "ping",
  description:
    "Verificar se o bot está online, o tempo de resposta e o tempo de atividade.",
  commands: ["ping", "pong"],
  usage: `${PREFIX}ping`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendReact, startProcess }) => {
    await sendReact("🌊");

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const ping = Date.now() - startProcess;

    await sendReply(`🌌🐚 *Furina ouve as correntes do mar digital...*

📡 *Latência das ondas:* ~ *${ping}ms*  
⏳ *Ritmo das marés (atividade):* *${h}h ${m}m ${s}s*  
💠 *Estado da corrente:* *Estável e harmônica*

As águas ecoam com serenidade...  
Furina sorri — o oceano está em paz. 🌊✨`);
  },
};