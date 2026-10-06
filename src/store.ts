
import { createStore } from 'framework7/lite';
import { TransactionService } from './services/TransactionService';
import { ReportService } from './services/ReportService';
import { DebtContactService } from './services/DebtContactService';
import { DebtService, type DebtUpdate } from './services/DebtService';
import { ExpenseNoteService } from './services/ExpenseNoteService';
import { Transaction } from './models/Transaction';
import { Report } from './models/Report';
import { DebtContact } from './models/DebtContact';
import { Debt } from './models/Debt';
import { ExpenseNote } from './models/ExpenseNote';
import { DEBT_DUE_SOON_DAYS, TRANSACTION_SOURCE } from './constants';

interface StoreState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  filteredTransactions: Transaction[];
  latestReport: Report | null;
  ownerDebts: DebtContact[];
  debtorDebts: DebtContact[];
  debts: Debt[];
  contacts: DebtContact[];
  currentContact: DebtContact | null;
  expenseNotes: ExpenseNote[];
  todaySumExpense: number;
  monthSumExpense: number;
  source: string;
  debtSource: string;
  loading: boolean;
}

const transactionService = new TransactionService();
const reportService = new ReportService();
const debtContactService = new DebtContactService();
const debtService = new DebtService();
const expenseNoteService = new ExpenseNoteService();

// create store
const store = createStore({
  // start with the state (store data)
  state: {
    transactions: [] as Transaction[],
    filteredTransactions: [] as Transaction[],
    currentTransaction: null as Transaction | null,
    latestReport: null as Report | null,
    ownerDebts: [] as DebtContact[],
    debtorDebts: [] as DebtContact[],
    debts: [] as Debt[],
    contacts: [] as DebtContact[],
    currentContact: null as DebtContact | null,
    expenseNotes: [] as ExpenseNote[],
    todaySumExpense: 0,
    monthSumExpense: 0,
    source: TRANSACTION_SOURCE.CREDIT_CARD,
    debtSource: 'owner',
    loading: false,
  },

  // actions to operate with state and for async manipulations
  actions: {
    // context object containing store state will be passed as an argument
    getTransactions({ state, dispatch }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> }) {
      state.loading = true;
      return transactionService.getAllTransactions().then((transactions) => {
        state.transactions = transactions || [];
        dispatch('setSource', state.source);
      }).finally(() => {
        state.loading = false;
      });
    },
    getTransaction({ state }: { state: StoreState }, id: string | number) {
      state.currentTransaction = null;
      state.loading = true;
      return transactionService.getTransactionById(id).then((transaction) => {
        state.currentTransaction = transaction;
      }).finally(() => {
        state.loading = false;
      });
    },
    async updateTransaction(
      { dispatch, state }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> },
      { id, description }: { id: string | number; description: string }
    ) {
      state.loading = true;
      await transactionService.updateTransaction(id, { description }).finally(() => {
        state.loading = false;
      });
      await dispatch('getTransactions');
    },
    setSource({ state }: { state: StoreState }, source: string) {
      state.source = source;
      state.filteredTransactions = state.transactions.filter((transaction: Transaction) => transaction.source === state.source);
    },
    setDebtSource({ state }: { state: StoreState }, debtSource: string) {
      state.debtSource = debtSource;
    },
    async getLatestReport({ state }: { state: StoreState }) {
      state.loading = true;
      return reportService.getLatestReport().then((report) => {
        state.latestReport = report;
      }).finally(() => {
        state.loading = false;
      });
    },
    getOwnerDebts({ state }: { state: StoreState }, userId: string) {
      state.loading = true;
      return debtService.getContactDebts('owner', userId).then((debts) => {
        state.ownerDebts = debts;
      }).finally(() => {
        state.loading = false;
      });
    },
    getDebtorDebts({ state }: { state: StoreState }, userId: string) {
      state.loading = true;
      return debtService.getContactDebts('debtor', userId).then((debts) => {
        state.debtorDebts = debts;
      }).finally(() => {
        state.loading = false;
      });
    },
    getContacts({ state }: { state: StoreState }) {
      return debtContactService.getAllContacts().then((contacts) => {
        state.contacts = contacts;
      }).finally(() => {
        state.loading = false;
      });
    },
    getContactByUserId({ state }: { state: StoreState }, userId: string) {
      state.loading = true;
      return debtContactService.getContactByUserId(userId).then((contact) => {
        state.currentContact = contact;
        return contact;
      }).finally(() => {
        state.loading = false;
      });
    },
    async createDebt(
      { state }: { state: StoreState },
      payload: DebtUpdate
    ) {
      state.loading = true;
      await debtService.createDebt(payload).finally(() => {
        state.loading = false;
      });
    },
    async updateDebt(
      { state }: { state: StoreState },
      { id, ownerUserId, ...payload }: DebtUpdate & { id: string | number; ownerUserId?: string }
    ) {
      state.loading = true;
      await debtService.updateDebt(id, payload).finally(() => {
        state.loading = false;
      });
    },
    async deleteDebt(
      { state }: { state: StoreState },
      id: string | number
    ) {
      state.loading = true;
      await debtService.deleteDebt(id).finally(() => {
        state.loading = false;
      });
    },
    getExpenseNotes({ state }: { state: StoreState }) {
      state.loading = true;
      return expenseNoteService.getAllExpenseNotes().then((expenseNotes) => {
        state.expenseNotes = expenseNotes || [];
      }).finally(() => {
        state.loading = false;
      });
    },
    async addExpenseNote(
      { dispatch, state }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> },
      payload: Omit<ExpenseNote, 'id' | 'createdAt'>
    ) {
      state.loading = true;
      await expenseNoteService.addExpenseNote(payload).finally(() => {
        state.loading = false;
      });
      await dispatch('getExpenseNotes');
      await dispatch('getTodaySum');
      await dispatch('getMonthSum');
    },
    async getTodaySum({ state }: { state: StoreState }) {
      state.loading = true;
      return expenseNoteService.getTodaySum().then((sum) => {
        state.todaySumExpense = sum;
      }).finally(() => {
        state.loading = false;
      });
    },
    async getMonthSum({ state }: { state: StoreState }) {
      state.loading = true;
      return expenseNoteService.getMonthSum().then((sum) => {
        state.monthSumExpense = sum;
      }).finally(() => {
        state.loading = false;
      });
    },
  },

  // getters to retrieve the state
  getters: {
    loading({ state }: { state: StoreState }) {
      return state.loading;
    },
    source({ state }: { state: StoreState }) {
      return state.source;
    },
    debtSource({ state }: { state: StoreState }) {
      return state.debtSource;
    },
    filteredTransactions({ state }: { state: StoreState }) {
      return state.filteredTransactions;
    },
    currentTransaction({ state }: { state: StoreState }) {
      return state.currentTransaction;
    },
    transactionTotal({ state }: { state: StoreState }) {
      return state.filteredTransactions.reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
    },
    shopeeTotal({ state }: { state: StoreState }) {
      return state.transactions.filter((transaction: Transaction) => transaction.category?.name === 'Shopee')
        .reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
    },
    latestReport({ state }: { state: StoreState }) {
      return state.latestReport;
    },
    ownerDebts({ state }: { state: StoreState }) {
      return state.ownerDebts;
    },
    debtorDebts({ state }: { state: StoreState }) {
      return state.debtorDebts;
    },
    contacts({ state }: { state: StoreState }) {
      return state.contacts;
    },
    currentContact({ state }: { state: StoreState }) {
      return state.currentContact;
    },
    ownerDueDebts({ state }: { state: StoreState }) {
      const debts = state.ownerDebts.map(contact => contact.debts).flat();
      return debts
        .filter((debt: Debt) => debt.untilDueDate != null && debt.untilDueDate <= DEBT_DUE_SOON_DAYS)
        .sort((a: Debt, b: Debt) => a.untilDueDate! - b.untilDueDate!);
    },
    debtorDueDebts({ state }: { state: StoreState }) {
      const debts = state.debtorDebts.map(contact => contact.debts).flat();
      return debts
        .filter((debt: Debt) => debt.untilDueDate != null && debt.untilDueDate <= DEBT_DUE_SOON_DAYS)
        .sort((a: Debt, b: Debt) => a.untilDueDate! - b.untilDueDate!);
    },
    expenseNotes({ state }: { state: StoreState }) {
      return state.expenseNotes;
    },
    todaySumExpense({ state }: { state: StoreState }) {
      return state.todaySumExpense;
    },
    monthSumExpense({ state }: { state: StoreState }) {
      return state.monthSumExpense;
    },
  }

})

// export store
export default store;