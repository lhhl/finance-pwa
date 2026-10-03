import { calculateDueDate, calculateDaysUntilDueDate } from "../utils/calculation";
import { DebtContact } from "./DebtContact";
import { DEBT_DUE_SOON_DAYS } from "../constants";

export class Debt {
  id: string;
  amount: number;
  created_at: Date;
  contact_id: string;
  contact?: DebtContact;
  due_day: number;
  interest_rate: number;

  constructor(debt: Debt) {
    const { id, amount, created_at, contact_id, contact, due_day, interest_rate } = debt;
    this.id = id;
    this.amount = amount;
    this.created_at = created_at;
    this.contact_id = contact_id;
    this.contact = contact ? new DebtContact(contact) : undefined;
    this.due_day = due_day;
    this.interest_rate = interest_rate;
  }

  get dueDate(): Date {
    return calculateDueDate(this.due_day);
  }

  get untilDueDate(): number {
    return calculateDaysUntilDueDate(this.dueDate);
  }

  get dueDateStatus(): string {
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