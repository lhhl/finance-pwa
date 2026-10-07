import { calculateDueDate, calculateDaysUntilDueDate } from "../utils/calculation";
import { DebtContact } from "./DebtContact";
import { DEBT_DUE_SOON_DAYS } from "../constants";

export class Debt {
  id: string;
  amount: number;
  createdAt: Date;
  feePaidDate: Date | null;
  ownerId: string;
  debtorId: string;
  owner?: DebtContact;
  debtor?: DebtContact;
  dueDay: number | null;
  interestRate: number;

  constructor(debt: Debt) {
    const { id, amount, createdAt, feePaidDate, ownerId, debtorId, owner, debtor, dueDay, interestRate } = debt;
    this.id = id;
    this.amount = amount;
    this.createdAt = new Date(createdAt);
    this.feePaidDate = feePaidDate ? new Date(feePaidDate) : null;
    this.ownerId = ownerId;
    this.debtorId = debtorId;
    this.owner = owner ? new DebtContact(owner) : undefined;
    this.debtor = debtor ? new DebtContact(debtor) : undefined;
    this.dueDay = dueDay;
    this.interestRate = interestRate;
  }

  get dueDate(): Date | null {
    return this.dueDay == null ? null : calculateDueDate(this.dueDay);
  }

  get untilDueDate(): number | null {
    return this.dueDate ? calculateDaysUntilDueDate(this.dueDate) : null;
  }

  get feePaidDateStatus(): boolean {
    if (!this.feePaidDate || !this.dueDate) return false;
    const windowStart = new Date(this.dueDate);
    windowStart.setDate(windowStart.getDate() - DEBT_DUE_SOON_DAYS);
    return this.feePaidDate.getTime() >= windowStart.getTime();
  }

  get dueDateStatus(): string {
    if (this.untilDueDate == null) {
      return "⚪ Vô thời hạn";
    }
    if (this.untilDueDate > 0) {
      if (this.untilDueDate <= DEBT_DUE_SOON_DAYS) {
        return `🟠 Còn ${this.untilDueDate} ngày đến hạn`;
      }
      return `🔵 Còn ${this.untilDueDate} ngày đến hạn`;
    } else {
      return "🔴 Đến hạn";
    }
  }
}