const db = require("../config/db");

let cachedColumns = null;

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function getPoemRequestColumns() {
  if (cachedColumns) return cachedColumns;
  const rows = await runQuery("SHOW COLUMNS FROM poem_requests");
  cachedColumns = new Set(rows.map((row) => row.Field));
  return cachedColumns;
}

function createPoemRequest({ userId, title, mood, theme }) {
  const safeMood = mood || "general";
  return getPoemRequestColumns().then((columns) => {
    if (columns.has("mood") && columns.has("theme")) {
      const sql = `
        INSERT INTO poem_requests (user_id, title, mood, theme, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', NOW())
      `;
      return runQuery(sql, [userId, title, safeMood, theme]);
    }

    // Legacy schema fallback
    const sql = `
      INSERT INTO poem_requests (user_id, title, description, poem_type, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;
    return runQuery(sql, [userId, title, theme, safeMood]);
  });
}

function getRequestsByUser(userId) {
  return getPoemRequestColumns().then((columns) => {
    const hasNewFields = columns.has("mood") && columns.has("theme");
    const hasReplyText = columns.has("reply_text");
    const hasRepliedAt = columns.has("replied_at");
    const hasCreatedAt = columns.has("created_at");

    const sql = `
      SELECT
        pr.id,
        pr.user_id,
        pr.title,
        ${hasNewFields ? "pr.mood" : "pr.poem_type"} AS mood,
        ${hasNewFields ? "pr.theme" : "pr.description"} AS theme,
        pr.status,
        ${hasReplyText ? "pr.reply_text" : "pr.admin_response"} AS reply_text,
        ${hasRepliedAt ? "pr.replied_at" : "NULL"} AS replied_at,
        ${hasCreatedAt ? "pr.created_at" : "NULL"} AS created_at
      FROM poem_requests pr
      WHERE pr.user_id = ?
      ORDER BY pr.id DESC
    `;

    return runQuery(sql, [userId]);
  });
}

function getAllRequests() {
  return getPoemRequestColumns().then((columns) => {
    const hasNewFields = columns.has("mood") && columns.has("theme");
    const hasReplyText = columns.has("reply_text");
    const hasRepliedAt = columns.has("replied_at");
    const hasCreatedAt = columns.has("created_at");

    const sql = `
      SELECT
        pr.id,
        pr.user_id,
        pr.title,
        ${hasNewFields ? "pr.mood" : "pr.poem_type"} AS mood,
        ${hasNewFields ? "pr.theme" : "pr.description"} AS theme,
        pr.status,
        ${hasReplyText ? "pr.reply_text" : "pr.admin_response"} AS reply_text,
        ${hasRepliedAt ? "pr.replied_at" : "NULL"} AS replied_at,
        ${hasCreatedAt ? "pr.created_at" : "NULL"} AS created_at,
        u.username,
        u.email
      FROM poem_requests pr
      JOIN users u ON pr.user_id = u.id
      ORDER BY pr.id DESC
    `;

    return runQuery(sql);
  });
}

function findById(id) {
  return getPoemRequestColumns().then((columns) => {
    const hasNewFields = columns.has("mood") && columns.has("theme");
    const hasReplyText = columns.has("reply_text");
    const hasRepliedAt = columns.has("replied_at");
    const hasCreatedAt = columns.has("created_at");

    const sql = `
      SELECT
        id,
        user_id,
        title,
        ${hasNewFields ? "mood" : "poem_type"} AS mood,
        ${hasNewFields ? "theme" : "description"} AS theme,
        status,
        ${hasReplyText ? "reply_text" : "admin_response"} AS reply_text,
        ${hasRepliedAt ? "replied_at" : "NULL"} AS replied_at,
        ${hasCreatedAt ? "created_at" : "NULL"} AS created_at
      FROM poem_requests
      WHERE id = ?
      LIMIT 1
    `;

    return runQuery(sql, [id]).then((rows) => rows[0] || null);
  });
}

function replyToRequest({ id, replyText }) {
  return getPoemRequestColumns().then((columns) => {
    const hasReplyText = columns.has("reply_text");
    const hasRepliedAt = columns.has("replied_at");

    const sql = hasReplyText
      ? `UPDATE poem_requests SET reply_text = ?, status = 'completed', ${hasRepliedAt ? "replied_at = NOW()," : ""} updated_at = NOW() WHERE id = ?`
      : `UPDATE poem_requests SET admin_response = ?, status = 'completed' WHERE id = ?`;

    // Some schemas may not have updated_at.
    const safeSql = sql.replace(", updated_at = NOW()", "");
    return runQuery(safeSql, [replyText, id]);
  });
}

function deleteRequestByUser({ id, userId }) {
  const sql = "DELETE FROM poem_requests WHERE id = ? AND user_id = ?";
  return runQuery(sql, [id, userId]);
}

function clearReply({ id }) {
  return getPoemRequestColumns().then((columns) => {
    const hasReplyText = columns.has("reply_text");
    const hasRepliedAt = columns.has("replied_at");

    if (hasReplyText) {
      const setClause = hasRepliedAt
        ? "reply_text = NULL, status = 'pending', replied_at = NULL"
        : "reply_text = NULL, status = 'pending'";
      const sql = `UPDATE poem_requests SET ${setClause} WHERE id = ?`;
      return runQuery(sql, [id]);
    }

    const legacySql = `
      UPDATE poem_requests
      SET admin_response = NULL, status = 'pending'
      WHERE id = ?
    `;
    return runQuery(legacySql, [id]);
  });
}

module.exports = {
  createPoemRequest,
  getRequestsByUser,
  getAllRequests,
  findById,
  replyToRequest,
  deleteRequestByUser,
  clearReply,
};
