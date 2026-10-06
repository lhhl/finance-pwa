import { Debt } from "./Debt";
import { DEBT_DUE_SOON_DAYS } from "../constants";

export class DebtContact {
  id: string;
  name: string;
  user_id: string;
  debts: Debt[]

  constructor(debtContact: Omit<DebtContact, 'totalAmount' | 'hasDueDebts'>) {
    const { id, name, user_id, debts } = debtContact;
    this.id = id;
    this.name = name;
    this.user_id = user_id;
    this.debts = (debts || []).map((debt) => new Debt(debt));
  }

  get totalAmount(): number {
    return this.debts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  get hasDueDebts(): boolean {
    return this.debts.some((debt) => debt.untilDueDate != null && debt.untilDueDate <= DEBT_DUE_SOON_DAYS);
  }
}