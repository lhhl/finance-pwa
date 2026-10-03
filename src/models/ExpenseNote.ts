export class ExpenseNote {
  id: string;
  amount: number;
  createdAt: string;
  description?: string;

  constructor(note: ExpenseNote) {
    const { id, amount, createdAt, description } = note;
    this.id = id;
    this.amount = amount;
    this.createdAt = createdAt;
    this.description = description;
  }
}