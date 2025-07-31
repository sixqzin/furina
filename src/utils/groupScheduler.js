async function fecharGrupo(sock, groupId) {
  try {
    await sock.groupSettingUpdate(groupId, "announcement"); // fecha o grupo (só admin pode falar)
    console.log("[groupScheduler] Grupo fechado com sucesso.");
  } catch (error) {
    console.error("[groupScheduler] Erro ao fechar grupo:", error);
  }
}

async function abrirGrupo(sock, groupId) {
  try {
    await sock.groupSettingUpdate(groupId, "not_announcement"); // abre o grupo (todos podem falar)
    console.log("[groupScheduler] Grupo aberto com sucesso.");
  } catch (error) {
    console.error("[groupScheduler] Erro ao abrir grupo:", error);
  }
}

module.exports = {
  fecharGrupo,
  abrirGrupo,
};