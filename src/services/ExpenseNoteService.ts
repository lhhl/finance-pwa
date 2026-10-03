import { BaseSupabaseService } from './BaseSupabaseService';
import { ExpenseNote } from '../models/ExpenseNote';

/**
 * Service class for managing ExpenseNote operations
 * Extends BaseSupabaseService to provide CRUD operations for expense notes
 */
export class ExpenseNoteService extends BaseSupabaseService {
  protected tableName: string = 'expense_notes';

  /**
   * Fetch all expense notes
   */
  async getAllExpenseNotes(): Promise<ExpenseNote[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data.map(item => new ExpenseNote(item));
  }

  /**
   * Add a new expense note record
   */
  async addExpenseNote(
    payload: Partial<ExpenseNote>
  ): Promise<ExpenseNote> {
    const newNote = await this.create<ExpenseNote>(payload);
    return new ExpenseNote(newNote);
  }

  /**
   * Get the sum of expense amounts for today
   */
  async getTodaySum(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayEnd = tomorrow.toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('amount')
      .gte('createdAt', todayStart)
      .lt('createdAt', todayEnd);

    if (error) {
      throw new Error(`Failed to fetch today's sum: ${error.message}`);
    }

    return data.reduce((sum, note) => sum + (note.amount || 0), 0);
  }

  /**
   * Get the sum of expense amounts for the current month
   */
  async getMonthSum(): Promise<number> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const monthStartISO = monthStart.toISOString();
    const monthEndISO = monthEnd.toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('amount')
      .gte('createdAt', monthStartISO)
      .lt('createdAt', monthEndISO);

    if (error) {
      throw new Error(`Failed to fetch month's sum: ${error.message}`);
    }

    return data.reduce((sum, note) => sum + (note.amount || 0), 0);
  }

  /**
   * Fetch a single expense note by ID
   */
  async getExpenseNoteById(id: string | number): Promise<ExpenseNote | null> {
    const data = await this.getById<ExpenseNote>(id);
    return data ? new ExpenseNote(data) : null;
  }

  /**
   * Update an existing expense note
   */
  async updateExpenseNote(
    id: string | number,
    payload: Partial<Omit<ExpenseNote, 'id' | 'createdAt'>>
  ): Promise<ExpenseNote> {
    const updated = await this.update<ExpenseNote>(id, payload);
    return new ExpenseNote(updated);
  }

  /**
   * Delete an expense note
   */
  async deleteExpenseNote(id: string | number): Promise<void> {
    return this.delete(id);
  }
}
