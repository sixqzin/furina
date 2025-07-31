/**
 * Logs personalizados do Snack Bot
 */
const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[SNACK BOT | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[SNACK BOT | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[SNACK BOT | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[SNACK BOT | SUCCESS]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[SNACK BOT | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[SNACK BOT | WARNING]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log("\x1b[34m"); // azul
  console.log("███████ ██    ██ ██████  ██ ███    ██  █████      ██████   ██████  ████████");
  console.log("██      ██    ██ ██   ██ ██ ████   ██ ██   ██     ██   ██ ██    ██    ██   ");
  console.log("█████   ██    ██ ██████  ██ ██ ██  ██ ███████     ██████  ██    ██    ██   ");
  console.log("██      ██    ██ ██   ██ ██ ██  ██ ██ ██   ██     ██   ██ ██    ██    ██   ");
  console.log("██       ██████  ██   ██ ██ ██   ████ ██   ██     ██████   ██████     ██   ");
  console.log(`\x1b[36mVersão:\x1b[0m ${version}\n`);
};
