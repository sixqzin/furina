const fs = require("fs");
const path = require("path");

function getPerfilPath(id) {
  const num = id.replace(/\D/g, "");
  return path.join(__dirname, "../uploads/perfis", `${num}.json`);
}

function loadPerfil(id) {
  const file = getPerfilPath(id);
  if (!fs.existsSync(file)) return null;
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error(`[PerfilUtils] Erro ao carregar perfil ${id}:`, e);
    return null;
  }
}

function savePerfil(id, perfil) {
  const file = getPerfilPath(id);
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(perfil, null, 2), "utf-8");
  } catch (e) {
    console.error(`[PerfilUtils] Erro ao salvar perfil ${id}:`, e);
  }
}

module.exports = { loadPerfil, savePerfil };