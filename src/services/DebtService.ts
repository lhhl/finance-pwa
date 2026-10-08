import { BaseSupabaseService } from './BaseSupabaseService';
import { Debt } from '../models/Debt';
import { DebtContact } from '../models/DebtContact';

export interface DebtPayload {
  amount: number;
  debtorId: string;
  ownerId: string;
  dueDay: number | null;
  interestRate: number;
}

/**
 * Service class for managing Debt operations
 * Extends BaseSupabaseService to provide CRUD operations for debts
 */
export class DebtService extends BaseSupabaseService {
  protected tableName: string = 'debts';

  /**
   * Fetch debts where the owner or debtor contact belongs to the given auth user
   */
  async getDebtsByUser(role: 'owner' | 'debtor', userId: string): Promise<Debt[]> {
    // !inner turns the embed into an inner join so the filter on it drops non-matching debts
    const ownerJoin = role === 'owner' ? 'ownerId!inner' : 'ownerId';
    const debtorJoin = role === 'debtor' ? 'debtorId!inner' : 'debtorId';

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        owner:${ownerJoin} (
          id,
          name,
          userId
        ),
        debtor:${debtorJoin} (
          id,
          name,
          userId
        )
      `)
      .eq(`${role}.userId`, userId);

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
        owner:ownerId (
          name,
          userId
        ),
        debtor:debtorId (
          name,
          userId
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data ? new Debt(data) : null;
  }

  async createDebt(payload: DebtPayload): Promise<DebtPayload> {
    return this.create<DebtPayload>(payload);
  }

  async updateDebt(id: string | number, payload: DebtPayload): Promise<DebtPayload> {
    return this.update<DebtPayload>(id, payload);
  }

  async deleteDebt(id: string | number): Promise<void> {
    return this.delete(id);
  }

  /**
   * Get unique owners from all debts
   * Returns an array of DebtContact objects representing each owner
   */
  async getContactDebts(role: 'owner' | 'debtor', userId: string): Promise<DebtContact[]> {
    const allDebts = await this.getDebtsByUser(role, userId);
    const debtMap = new Map<string, DebtContact>();
    const mapKey = role === 'owner' ? 'debtor' : 'owner';

    allDebts.forEach((debt) => {
      const contact = debt[mapKey];
      if (!contact) return;
      if (debtMap.has(contact.id)) {
        return debtMap.get(contact.id)!.debts.push(new Debt(debt));
      }
      debtMap.set(contact.id, new DebtContact({
        ...contact,
        debts: [new Debt(debt)]
      }));
    });

    return Array.from(debtMap.values());
  }
}
