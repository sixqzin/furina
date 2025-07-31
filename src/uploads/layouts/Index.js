module.exports = function renderLayout(layout, dados) {
  const { nome, bio, elo, rotaFavorita, userTag, casadoComNome } = dados;

  // Define a linha do estado civil dependendo se casadoComNome existe
  const estadoCivilLinha = casadoComNome
    ? `💍 Casado(a) com: ${casadoComNome}`
    : `💔 Estado civil: Solteiro(a)`;

  const layouts = {
    layout1: `
╭───❖ 「 Perfil de ${userTag} 」 ❖
│
├ 🎯 *Nome:* ${nome}
├ 📖 *Bio:* ${bio}
│
├ 🏆 *Elo:* ${elo}
├ 🛡️ *Rota Favorita:* ${rotaFavorita}
├ ${estadoCivilLinha}
│
╰──────────────╯`,

    layout2: `
┌─「 🏹 Perfil: ${userTag} 」
│
├ ✨ *Nome:* ${nome}
├ 💬 *Bio:* ${bio}
│
├ 🧿 *Elo:* ${elo}
├ 🧭 *Rota:* ${rotaFavorita}
├ ${estadoCivilLinha}
│
└────────────┘`,

    layout3: `
🌌 Ficha de Herói: ${userTag}

🔸 *Nome:* ${nome}
🔹 *Bio:* ${bio}

🏅 *Elo:* ${elo}
🛣️ *Rota Favorita:* ${rotaFavorita}
${estadoCivilLinha}
`,

    layout4: `
🧝 Registro de Aventura
👤 ${userTag}

📌 *Nome:* ${nome}
📝 *Bio:* ${bio}
🎖️ *Elo:* ${elo}
🗺️ *Rota:* ${rotaFavorita}
${estadoCivilLinha}
`,

    layout5: `
🪷 Lótus de Perfil - ${userTag}
╭───────────────╮
│ 👤 Nome: ${nome}
│ 📖 Bio: ${bio}
│ 🏅 Elo: ${elo}
│ 🛡️ Rota: ${rotaFavorita}
│ ${estadoCivilLinha}
╰───────────────╯
`,
  };

  return layouts[layout] || layouts["layout1"];
};