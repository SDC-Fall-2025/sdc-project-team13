// Import sqlite3 module, database struct, and path join.
import { Database as SQLiteDatabase, verbose } from "sqlite3";
import { DatabaseManager } from ".";
import { join } from "path";

// Enable verbose logging.
verbose();

// Create database connection.
const sql = new SQLiteDatabase(join(process.cwd(), "./test.sqlite"));

// Set this to true (as the sqlite database always starts open),
// this will be toggled off when the db is closed.
let ready = true;
sql.once("close", () => {
  ready = false;
});

// Export the proper tools
export const db: DatabaseManager = {
  // Return the sqlite3 instance.
  getRawInstance() {
    return sql;
  },

  // Return whatever ready is at this time.
  isReady() {
    return ready;
  }
};
