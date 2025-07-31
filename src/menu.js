/**
 * Menu estilizado com tema Hidro (Furina) - Separado por níveis
 *
 * @author Dev Gui
 */
const { BOT_NAME, PREFIX } = require("./config");

exports.menuMessage = () => {
  const date = new Date();

  const frasesFinais = [
    "💧 Que a justiça seja feita sob a maré!",
    "🌊 Que a água leve o caos e traga a ordem!",
    "⚖️ A balança julga... e a água absolve!",
    "🎭 O palco está montado, e eu sou a estrela!",
    "💙 As ondas nunca mentem — diferente de vocês!",
    "👑 Eu sou a deusa deste tribunal aquático!",
    "🎭 Que comece o julgamento... com um pouco de drama!",
    "🌊 A maré pode mudar, mas eu sempre serei a protagonista!",
    "💧 A água purifica... ou condena!",
    "⚖️ Que todos os pecados sejam lavados com as ondas!",
    "🌀 Drama, ação e lágrimas... bem-vindo ao espetáculo!",
    "💙 Nem tudo que brilha é Hydro, mas tudo Hydro brilha!",
    "🌊 A justiça tem gosto salgado!",
    "🎭 Não é teatro... é realidade performática!",
    "💧 Chorando ou lutando, a água sempre vence!",
    "👁 A água vê até o que o silêncio tenta esconder.",
    "🌧 Onde há dúvida, que caia a chuva da verdade.",
    "🎙 E agora, senhores... o ato final!",
    "🎭 Uma diva nunca se cala diante da injustiça!",
    "💦 Quem não tem argumentos, que nade até encontrar!",
    "🌊 Hoje, o oceano está do meu lado!",
    "💧 Entre o caos e a ordem... eu escolho brilhar!",
    "⚖️ Se for para julgar, que seja com estilo!",
    "💙 À deriva na justiça, mas com elegância!",
    "🎭 Que a peça continue... até que a maré decida!"
  ];

  const fraseFinal = frasesFinais[Math.floor(Math.random() * frasesFinais.length)];

  return `
━━━━━━━━━━━━━━━━━━━━━━
🌊 *BEM-VINDO(A) AO ${BOT_NAME.toUpperCase()}* 🌊
━━━━━━━━━━━━━━━━━━━━━━
📅 *Data:* ${date.toLocaleDateString("pt-BR")}
⏰ *Hora:* ${date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
💧 *Prefixo mágico:* ${PREFIX}
━━━━━━━━━━━━━━━━━━━━━━

👑 *COMANDOS EXCLUSIVOS* 👑

🔱 *DONO*
• ${PREFIX}get-id
• ${PREFIX}on
• ${PREFIX}off
• ${PREFIX}set-menu-image
• ${PREFIX}get-lid

━━━━━━━━━━━━━━━━━━━━━━

⚖️ *ADMINS*
• ${PREFIX}abrir
• ${PREFIX}fechar
• ${PREFIX}set-horario-abrir HH:MM
• ${PREFIX}set-horario-fechar HH:MM
• ${PREFIX}antipalavrao 1|0
• ${PREFIX}add-palavrao <palavra>
• ${PREFIX}del-palavrao <palavra>
• ${PREFIX}anti-link 1|0
• ${PREFIX}auto-responder 1|0
• ${PREFIX}ban
• ${PREFIX}revelar
• ${PREFIX}hidetag
• ${PREFIX}limpar
• ${PREFIX}mute
• ${PREFIX}unmute
• ${PREFIX}promover
• ${PREFIX}rebaixar
• ${PREFIX}exit 1|0
• ${PREFIX}welcome 1|0
• ${PREFIX}agendar-mensagem

━━━━━━━━━━━━━━━━━━━━━━

💙 *COMANDOS PARA TODOS OS MEMBROS* 💙

🧭 *GERAL*
• ${PREFIX}ping
• ${PREFIX}perfil
• ${PREFIX}cep
• ${PREFIX}get-lid
• ${PREFIX}rename
• ${PREFIX}google-search
• ${PREFIX}raw-message
• ${PREFIX}fake-chat
• ${PREFIX}gerar-link

🎵 *MÍDIA*
• ${PREFIX}play-audio
• ${PREFIX}play-video
• ${PREFIX}yt-mp3
• ${PREFIX}yt-mp4
• ${PREFIX}tik-tok

🎭 *BRINCADEIRAS*
• ${PREFIX}abraçar
• ${PREFIX}beijar
• ${PREFIX}matar
• ${PREFIX}lutar
• ${PREFIX}dado
• ${PREFIX}socar
• ${PREFIX}jantar

━━━━━━━━━━━━━━━━━━━━━━
💧 ${fraseFinal}
━━━━━━━━━━━━━━━━━━━━━━
`;
};