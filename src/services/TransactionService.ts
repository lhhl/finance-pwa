import { BaseSupabaseService } from './BaseSupabaseService';
import { Transaction } from '../models/Transaction';

/**
 * Service class for managing Transaction operations
 * Extends BaseSupabaseService to provide CRUD operations for transactions
 */
export class TransactionService extends BaseSupabaseService {
  protected tableName: string = 'transactions';

  /**
   * Fetch all transactions where reportId is null
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:catId (id, name, icon)
      `)
      .is('reportId', null)
      .is('isFlagged', false)
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data.map(item => new Transaction(item));
  }

  /**
   * Fetch a single transaction by ID
   */
  async getTransactionById(id: string | number): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:catId (id, name, icon)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data ? new Transaction(data) : null;
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(
    id: string | number,
    payload: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ): Promise<Transaction> {
    return this.update<Transaction>(id, payload);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string | number): Promise<void> {
    return this.delete(id);
  }
}
