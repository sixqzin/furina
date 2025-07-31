const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../../uploads");

function getPerfilPath(userId) {
  const onlyNumbers = userId.replace(/\D/g, "");
  return path.join(baseDir, "perfis", `${onlyNumbers}.json`);
}

function loadPerfil(userId) {
  const filePath = getPerfilPath(userId);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath));
}

function savePerfil(userId, perfil) {
  const dir = path.dirname(getPerfilPath(userId));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getPerfilPath(userId), JSON.stringify(perfil, null, 2));
}

module.exports = {
  loadPerfil,
  savePerfil,
};