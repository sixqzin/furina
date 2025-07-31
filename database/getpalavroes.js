
const fs = require("fs");
const path = require("path");

/**
 * Lê a lista de palavrões do arquivo JSON localizado em src/database/palavroes.json
 * @returns {Array<string>} Lista de palavrões
 */
function getPalavroes() {
  try {
    const filePath = path.join(__dirname, "palavroes.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw);
    return json.global || [];
  } catch (err) {
    console.error("Erro ao ler palavrões:", err);
    return [];
  }
}

module.exports = { getPalavroes };
