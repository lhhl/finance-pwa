import { Category } from "./Category";

export class Transaction {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  category: Category;
  reportId?: string;
  source: string;
  originalContent: string;

  constructor(transaction: Transaction) {
    const { id, amount, description, createdAt, category, source, originalContent, reportId } = transaction;
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.createdAt = new Date(createdAt);
    this.category = new Category(category);
    this.source = source;
    this.originalContent = originalContent;
    this.reportId = reportId;
  }
}