import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

/**
 * Abstract base service class for Supabase operations
 * Provides common functionality for database interactions
 */
export abstract class BaseSupabaseService {
  protected supabase: SupabaseClient = supabase;
  protected tableName: string = '';

  /**
   * Fetch all records from the table
   */
  async getAll<T>(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data as T[];
  }

  /**
   * Fetch a single record by ID
   */
  async getById<T>(id: string | number): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows found" which is acceptable
      throw new Error(`Failed to fetch from ${this.tableName}: ${error.message}`);
    }

    return data as T | null;
  }

  /**
   * Insert a new record
   */
  async create<T>(payload: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([payload as any])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert into ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Update an existing record
   */
  async update<T>(
    id: string | number,
    payload: Partial<Omit<T, 'id' | 'created_at'>>
  ): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Delete a record
   */
  async delete(id: string | number): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete from ${this.tableName}: ${error.message}`);
    }
  }

  /**
   * Query records with a filter
   */
  async query<T>(
    column: string,
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in',
    value: any
  ): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select('*');

    switch (operator) {
      case 'eq':
        query = query.eq(column, value);
        break;
      case 'neq':
        query = query.neq(column, value);
        break;
      case 'gt':
        query = query.gt(column, value);
        break;
      case 'gte':
        query = query.gte(column, value);
        break;
      case 'lt':
        query = query.lt(column, value);
        break;
      case 'lte':
        query = query.lte(column, value);
        break;
      case 'like':
        query = query.like(column, value);
        break;
      case 'ilike':
        query = query.ilike(column, value);
        break;
      case 'in':
        query = query.in(column, value);
        break;
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to query ${this.tableName}: ${error.message}`);
    }

    return data as T[];
  }

  /**
   * Count records in the table
   */
  async count(column: string = '*'): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select(column, { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Setup real-time subscription
   */
  onChanges(
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ): () => void {
    const channel = this.supabase
      .channel(`${this.tableName}-changes`)
      .on(
        'postgres_changes' as any,
        { event, schema: 'public', table: this.tableName },
        (payload: any) => {
          callback(payload);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}
