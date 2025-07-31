/**
 * Comando /info - Exibe informações do dono e status do bot
 * Acessível por qualquer membro.
 * Sem dependências externas (funciona no /sdcard).
 * 
 * @author Dev Gui
 */

const botName = 'Furina Bot';
const ownerName = "ᶦ'ᵐ ᵈᵉᵃᵈ";
const ownerNumber = '55991888116'; // novo número
const botVersion = '1.0.5';

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
}

module.exports = {
  name: "info",
  description: "Exibe informações do dono e status do bot",
  commands: ["info"],
  usage: "!info",
  /**
   * @param {import('../../@types/index').CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sock, msg }) => {
    try {
      const uptimeMs = process.uptime() * 1000;
      const startDate = new Date(Date.now() - uptimeMs);
      const formattedStartDate = formatDate(startDate);

      const chats = sock.chats ? [...sock.chats.values()] : [];
      const groupChats = chats.filter(c => c.id && c.id.endsWith('@g.us'));
      const totalGroups = groupChats.length;

      const usersSet = new Set();
      groupChats.forEach(group => {
        if (group.participants) {
          group.participants.forEach(p => usersSet.add(p.id));
        }
      });
      const totalUsers = usersSet.size;

      const message = `
━━━━━━━━━━━━━━━
💧 ${botName}
━━━━━━━━━━━━━━━
👤 Dono: ${ownerName}
📞 Número: [${ownerNumber}](https://wa.me/${ownerNumber})
⏳ Uptime: ${formatUptime(uptimeMs)}
📅 Iniciado em: ${formattedStartDate}
🛠 Versão: ${botVersion}
━━━━━━━━━━━━━━━
🌐 Grupos ativos: ${totalGroups}
👥 Usuários únicos: ${totalUsers}
━━━━━━━━━━━━━━━
📬 Contato: [Fale comigo](https://wa.me/${ownerNumber})
━━━━━━━━━━━━━━━
_"Que a justiça de Fontaine guie nossas águas."_
`;

      await sock.sendMessage(msg.key.remoteJid, {
        text: message,
        mentions: [`${ownerNumber}@s.whatsapp.net`],
      });
    } catch (error) {
      console.error('Erro no comando /info:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Ocorreu um erro ao executar o comando.',
      });
    }
  },
};