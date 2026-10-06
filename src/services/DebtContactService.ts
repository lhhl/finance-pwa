import { BaseSupabaseService } from './BaseSupabaseService';
import { DebtContact } from '../models/DebtContact';

/**
 * Service class for managing Debt operations
 * Extends BaseSupabaseService to provide CRUD operations for debts
 */
export class DebtContactService extends BaseSupabaseService {
  protected tableName: string = 'debt_contacts';

  /**
   * Fetch the latest debt where both cash and credit card are closed
   */
  async getDebtByContact(): Promise<DebtContact[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        debts (
          *
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    if (!data) return [];

    return data.map((debt) => new DebtContact(debt));
  }

  async getAllContacts(): Promise<DebtContact[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    if (!data) return [];

    return data.map((contact) => new DebtContact(contact));
  }

  /**
   * Get a single contact by user_id
   */
  async getContactByUserId(userId: string): Promise<DebtContact | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`*`)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data ? new DebtContact(data) : null;
  }
}
