import { BaseSupabaseService } from './BaseSupabaseService';
import { Report } from '../models/Report';

/**
 * Service class for managing Report operations
 * Extends BaseSupabaseService to provide CRUD operations for reports
 */
export class ReportService extends BaseSupabaseService {
  protected tableName: string = 'reports';

  /**
   * Fetch the latest report where both cash and credit card are closed
   * @param includeTransactions - Whether to populate transactions relationship (default: true)
   */
  async getLatestReport(includeTransactions: boolean = true): Promise<Report | null> {
    const selectQuery = includeTransactions
      ? '*, transactions (*, category:catId (id, name, icon))'
      : '*';

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(selectQuery)
      .is('isCreditCardClosed', true)
      .is('isCashClosed', true)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    if (!data) return null;

    return new Report(data as any);
  }

  /**
   * Update an existing report
   * @param id - The ID of the report to update
   * @param updates - Partial report data to update
   */
  async updateReport(
    id: string,
    updates: Partial<Omit<Report, 'id' | 'createdAt' | 'transactions'>>
  ): Promise<Report> {
    const data = await super.update<Report>(id, updates);
    return new Report(data);
  }
}
