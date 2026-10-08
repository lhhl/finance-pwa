import { Category } from "./Category";

export class Transaction {
  id: string;
  amount: number;
  deductedAmount: number;
  description: string;
  createdAt: Date;
  category: Category;
  reportId?: string;
  source: string;
  originalContent: string;

  constructor(transaction: Transaction) {
    const { id, amount, deductedAmount, description, createdAt, category, source, originalContent, reportId } = transaction;
    this.id = id;
    this.amount = amount;
    this.deductedAmount = deductedAmount;
    this.description = description;
    this.createdAt = new Date(createdAt);
    this.category = new Category(category);
    this.source = source;
    this.originalContent = originalContent;
    this.reportId = reportId;
  }

  get afterDeductedAmount(): number | null {
    if (this.deductedAmount <= 0) {
      return null;
    }
    return this.amount - this.deductedAmount;
  }
}