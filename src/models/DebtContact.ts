import { Debt } from "./Debt";
import { DEBT_DUE_SOON_DAYS } from "../constants";

export class DebtContact {
  id: string;
  name: string;
  debts: Debt[]

  constructor(debtContact: DebtContact) {
    const { id, name, debts } = debtContact;
    this.id = id;
    this.name = name;
    this.debts = (debts || []).map((debt) => new Debt(debt));
  }

  get totalAmount(): number {
    return this.debts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  get hasDueDebts(): boolean {
    return this.debts.some((debt) => debt.untilDueDate <= DEBT_DUE_SOON_DAYS);
  }
}