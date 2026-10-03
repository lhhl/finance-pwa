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
   */
  async getLatestReport(): Promise<Report | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        transactions (
          *,
          category:catId (id, name, icon)
        )
      `)
      .is('isCreditCardClosed', true)
      .is('isCashClosed', true)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    if (!data) return null;

    return new Report(data);
  }
}
