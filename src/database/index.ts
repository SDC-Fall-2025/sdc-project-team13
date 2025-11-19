// Create logger
import { createNewLogger } from "../tools/log";
export const dbLogger = createNewLogger("db");

/** A SDC project. */
export interface Project {
  /** The project identifier. */
  readonly id: number;
  /** The project's readable name. */
  name: string;
  /** A description of this project. */
  description: string;
  /** The team the projects belongs to. */
  team: number;
}

/** A team member. */
export interface TeamMember {
  /** Their discord ID. */
  readonly id: number;
  /** The team they belong to. */
  team: number;
  /** Their permission level. */
  role: string;
}

/**
 * Interface for a connected database, defines all of the methods we might need to access.
 */
export interface DatabaseManager {
  /**
   * Gets the raw instance of the backend database, use wisely!
   * @returns An unknown instance of whatever underlying tool powers the database. (Could be sqlite, etc.)
   */
  getRawInstance(): unknown;

  /**
   * Checks if the database is ready for operations.
   * @returns A boolean that signifies if the database is ready or not.
   */
  isReady(): boolean;

  /**
   * Setup the tables on the database that we want to use.
   */
  setup(): void;

  /**
   * Initiates the database with whatever it needs to be ready.
   */
  initiate(): void;

  /**
   * Closes the database connection, back to state before initiate was called.
   */
  close(): void;
}

// Export the database tool we want to use.
export * from "./sqlite";
