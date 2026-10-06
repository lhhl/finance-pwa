import { calculateDueDate, calculateDaysUntilDueDate } from "../utils/calculation";
import { DebtContact } from "./DebtContact";
import { DEBT_DUE_SOON_DAYS } from "../constants";

export class Debt {
  id: string;
  amount: number;
  created_at: Date;
  fee_paid_date: Date | null;
  owner_id: string;
  debtor_id: string;
  owner?: DebtContact;
  debtor?: DebtContact;
  due_day: number | null;
  interest_rate: number;

  constructor(debt: Debt) {
    const { id, amount, created_at, fee_paid_date, owner_id, debtor_id, owner, debtor, due_day, interest_rate } = debt;
    this.id = id;
    this.amount = amount;
    this.created_at = new Date(created_at);
    this.fee_paid_date = fee_paid_date ? new Date(fee_paid_date) : null;
    this.owner_id = owner_id;
    this.debtor_id = debtor_id;
    this.owner = owner ? new DebtContact(owner) : undefined;
    this.debtor = debtor ? new DebtContact(debtor) : undefined;
    this.due_day = due_day;
    this.interest_rate = interest_rate;
  }

  get dueDate(): Date | null {
    return this.due_day == null ? null : calculateDueDate(this.due_day);
  }

  get untilDueDate(): number | null {
    return this.dueDate ? calculateDaysUntilDueDate(this.dueDate) : null;
  }

  get feePaidDateStatus(): boolean {
    if (!this.fee_paid_date || !this.dueDate) return false;
    const windowStart = new Date(this.dueDate);
    windowStart.setDate(windowStart.getDate() - DEBT_DUE_SOON_DAYS);
    return this.fee_paid_date.getTime() >= windowStart.getTime();
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