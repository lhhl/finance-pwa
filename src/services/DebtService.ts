import { BaseSupabaseService } from './BaseSupabaseService';
import { Debt } from '../models/Debt';

export interface DebtUpdate {
  amount: number;
  contact_id: string;
  due_day: number;
  interest_rate: number;
}

/**
 * Service class for managing Debt operations
 * Extends BaseSupabaseService to provide CRUD operations for debts
 */
export class DebtService extends BaseSupabaseService {
  protected tableName: string = 'debts';

  /**
   * Fetch the latest debt where both cash and credit card are closed
   */
  async getAllDebt(): Promise<Debt[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        contact:contact_id (
          name
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    if (!data) return [];

    return data.map((debt) => new Debt(debt));
  }

  async getDebtById(id: string | number): Promise<Debt | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        contact:contact_id (
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data ? new Debt(data) : null;
  }

  async createDebt(payload: DebtUpdate): Promise<DebtUpdate> {
    return this.create<DebtUpdate>(payload);
  }

  async updateDebt(id: string | number, payload: DebtUpdate): Promise<DebtUpdate> {
    return this.update<DebtUpdate>(id, payload);
  }

  async deleteDebt(id: string | number): Promise<void> {
    return this.delete(id);
  }
}
