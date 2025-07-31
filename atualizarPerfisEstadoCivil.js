// atualizarPerfisEstadoCivil.js

const fs = require("fs");
const path = require("path");

// Caminho absoluto no Termux (ajuste se necessário)
const perfisDir = path.join(__dirname, "src/uploads/perfis");

function atualizarPerfis() {
  if (!fs.existsSync(perfisDir)) {
    console.error("❌ Pasta de perfis não encontrada:", perfisDir);
    process.exit(1);
  }

  const arquivos = fs.readdirSync(perfisDir).filter((f) => f.endsWith(".json"));

  let totalAtualizados = 0;

  for (const arquivo of arquivos) {
    const caminhoArquivo = path.join(perfisDir, arquivo);
    const dados = JSON.parse(fs.readFileSync(caminhoArquivo, "utf8"));

    if (!dados.hasOwnProperty("casadoCom")) {
      dados.casadoCom = null;
      fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
      console.log(`✅ Atualizado: ${arquivo}`);
      totalAtualizados++;
    } else {
      console.log(`⏩ Já possui estado civil: ${arquivo}`);
    }
  }

  console.log(`\n🎉 Atualização concluída! Perfis modificados: ${totalAtualizados}`);
}

atualizarPerfis();