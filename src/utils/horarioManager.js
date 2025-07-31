// src/utils/horarioManager.js

const fs = require("fs");
const path = require("path");

const horarioPath = path.join(__dirname, "../uploads/horarioGrupo.json");

function garantirArquivo() {
  if (!fs.existsSync(horarioPath)) {
    const padrao = {
      horarioFechar: "0 22 * * *",  // 22:00
      horarioAbrir:  "0 06 * * *",  // 06:00
      ultimoEstado: null            // sem estado inicial
    };
    fs.mkdirSync(path.dirname(horarioPath), { recursive: true });
    fs.writeFileSync(horarioPath, JSON.stringify(padrao, null, 2));
  }
}

function lerArquivo() {
  garantirArquivo();
  return JSON.parse(fs.readFileSync(horarioPath));
}

function getHorarios() {
  const data = lerArquivo();
  return {
    horarioFechar: data.horarioFechar || "0 22 * * *",
    horarioAbrir:  data.horarioAbrir  || "0 06 * * *",
    ultimoEstado:  data.ultimoEstado  || null
  };
}

function setUltimoEstado(estado) {
  const data = lerArquivo();
  data.ultimoEstado = estado;
  fs.writeFileSync(horarioPath, JSON.stringify(data, null, 2));
}

function setHorarioFechar(cronExp) {
  const data = lerArquivo();
  data.horarioFechar = cronExp;
  fs.writeFileSync(horarioPath, JSON.stringify(data, null, 2));
}

function setHorarioAbrir(cronExp) {
  const data = lerArquivo();
  data.horarioAbrir = cronExp;
  fs.writeFileSync(horarioPath, JSON.stringify(data, null, 2));
}

module.exports = {
  getHorarios,
  setHorarioFechar,
  setHorarioAbrir,
  setUltimoEstado,
};