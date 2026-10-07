import { formatShortDateTime } from "../utils/format";
import { Transaction } from "./Transaction";

interface TransactionsByCategory {
  [categoryName: string]: Transaction[];
}

export class Report {
  id: string;
  amount: number;
  cashAmount: number;
  cardAmount: number;
  deduction: number;
  createdAt: Date;
  isCashClosed: boolean;
  isCreditCardClosed: boolean;
  transactions: Transaction[];
  viewed: boolean;

  constructor(report: Report) {
    const { id, amount, cashAmount, cardAmount, deduction, createdAt, isCashClosed, isCreditCardClosed, transactions, viewed } = report;
    this.id = id;
    this.amount = amount;
    this.cashAmount = cashAmount;
    this.cardAmount = cardAmount;
    this.deduction = deduction;
    this.createdAt = new Date(createdAt);
    this.isCashClosed = isCashClosed;
    this.isCreditCardClosed = isCreditCardClosed;
    this.transactions = transactions?.map(t => new Transaction(t)) || [];
    this.viewed = viewed;
  }

  get transactionsByCategory(): TransactionsByCategory {
    return this.transactions.reduce((groups, transaction) => {
      const name = transaction.category?.name || 'Khác';
      (groups[name] ??= []).push(transaction);
      return groups;
    }, {} as TransactionsByCategory);
  }

  get name(): string {
    return `Báo cáo ${formatShortDateTime(this.createdAt)}`;
  }
}