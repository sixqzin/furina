// isAdmin.js

/**
 * Verifica se o usuário é admin do grupo
 * @param {Array} participants - Lista de participantes do grupo
 * @param {string} userId - ID do usuário (ex: 55999999999@s.whatsapp.net)
 * @returns {boolean} true se for admin
 */
function isAdmin(participants, userId) {
  if (!participants || !userId) return false;

  return participants.some(p => 
    p.id === userId && (p.admin === 'admin' || p.admin === 'superadmin')
  );
}

module.exports = { isAdmin };
