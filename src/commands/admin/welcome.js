const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const fs = require("fs");
const path = require("path");

const statusPath = path.join(__dirname, "../../uploads/welcome/status.json");

function saveWelcomeStatus(groupId, isActive) {
  const status = fs.existsSync(statusPath)
    ? JSON.parse(fs.readFileSync(statusPath, "utf-8"))
    : {};
  status[groupId] = isActive;
  fs.mkdirSync(path.dirname(statusPath), { recursive: true });
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
}

module.exports = {
  name: "welcome",
  description: "Ativa ou desativa a mensagem de boas-vindas estilo Furina.",
  commands: [
    "welcome", "bemvindo", "boasvinda", "boasvindas"
  ],
  usage: `${PREFIX}welcome (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length || !["1", "0"].includes(args[0]))
      throw new InvalidParameterError("Use 1 para ativar ou 0 para desativar o sistema de boas-vindas.");

    const ativar = args[0] === "1";

    saveWelcomeStatus(remoteJid, ativar);

    await sendSuccessReact();
    const msg = ativar
      ? "💧 Sistema de boas-vindas da *Furina* foi *ativado* com sucesso!"
      : "💧 Sistema de boas-vindas da *Furina* foi *desativado* com sucesso!";
    await sendReply(msg);
  },
};
