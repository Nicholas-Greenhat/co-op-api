const initSqlJs = require('sql.js');
const logger = require('../utils/logger');

/** Singleton sql.js database instance */
let db = null;

/**
 * Returns the initialised database instance.
 * Creates and seeds the database on first call.
 * @returns {Promise<import('sql.js').Database>}
 */
const getDb = async () => {
  if (!db) {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    initSchema();
  }
  return db;
};

/**
 * Creates the accounts and transactions tables if they don't exist,
 * then seeds two default accounts on a fresh database.
 */
const initSchema = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      account_number TEXT UNIQUE NOT NULL,
      owner_name     TEXT NOT NULL,
      balance        REAL NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id                      INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_account_number   TEXT NOT NULL,
      receiver_account_number TEXT NOT NULL,
      amount                  REAL NOT NULL,
      description             TEXT,
      status                  TEXT NOT NULL,
      created_at              TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const [{ values }] = db.exec('SELECT COUNT(*) as count FROM accounts');
  if (values[0][0] === 0) {
    db.run("INSERT INTO accounts (account_number, owner_name, balance) VALUES ('ACC001', 'Alice Johnson', 5000.00)");
    db.run("INSERT INTO accounts (account_number, owner_name, balance) VALUES ('ACC002', 'Bob Smith', 3000.00)");
    logger.info('Database seeded with default accounts');
  }
};

/**
 * Executes a SELECT query and returns the first matching row as a plain object.
 * @param {string} sql - Parameterised SQL query
 * @param {Array} params - Bound parameter values
 * @returns {object|null} First row or null if no match
 */
const queryOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
};

/**
 * Executes an INSERT, UPDATE, or DELETE statement.
 * @param {string} sql - Parameterised SQL statement
 * @param {Array} params - Bound parameter values
 * @returns {number|undefined} Last inserted row ID (for INSERT statements)
 */
const run = (sql, params = []) => {
  db.run(sql, params);
  return db.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0];
};

module.exports = { getDb, queryOne, run };
