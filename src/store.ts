
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
  debtContacts: DebtContact[];
  contacts: DebtContact[];
  debts: Debt[];
  currentDebt: Debt | null;
  expenseNotes: ExpenseNote[];
  todaySumExpense: number;
  monthSumExpense: number;
  source: string;
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
    debtContacts: [] as DebtContact[],
    contacts: [] as DebtContact[],
    debts: [] as Debt[],
    currentDebt: null as Debt | null,
    expenseNotes: [] as ExpenseNote[],
    todaySumExpense: 0,
    monthSumExpense: 0,
    source: TRANSACTION_SOURCE.CREDIT_CARD,
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
    async getLatestReport({ state }: { state: StoreState }) {
      state.loading = true;
      return reportService.getLatestReport().then((report) => {
        state.latestReport = report;
      }).finally(() => {
        state.loading = false;
      });
    },
    getDebtContacts({ state }: { state: StoreState }) {
      state.loading = true;
      return debtContactService.getDebtByContact().then((debtContacts) => {
        state.debtContacts = debtContacts;
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
    getDebts({ state }: { state: StoreState }) {
      return debtService.getAllDebt().then((debts) => {
        state.debts = debts;
      }).finally(() => {
        state.loading = false;
      });
    },
    getDebt({ state }: { state: StoreState }, id: string | number) {
      state.currentDebt = null;
      state.loading = true;
      return debtService.getDebtById(id).then((debt) => {
        state.currentDebt = debt;
      }).finally(() => {
        state.loading = false;
      });
    },
    async createDebt(
      { dispatch, state }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> },
      payload: DebtUpdate
    ) {
      state.loading = true;
      await debtService.createDebt(payload).finally(() => {
        state.loading = false;
      });
      await dispatch('getDebtContacts');
    },
    async updateDebt(
      { dispatch, state }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> },
      { id, ...payload }: DebtUpdate & { id: string | number }
    ) {
      state.loading = true;
      await debtService.updateDebt(id, payload).finally(() => {
        state.loading = false;
      });
      await dispatch('getDebtContacts');
    },
    async deleteDebt(
      { dispatch, state }: { state: StoreState; dispatch: (action: string, data?: unknown) => Promise<unknown> },
      id: string | number
    ) {
      state.loading = true;
      await debtService.deleteDebt(id).finally(() => {
        state.loading = false;
      });
      state.currentDebt = null;
      await dispatch('getDebtContacts');
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
    debtContacts({ state }: { state: StoreState }) {
      return state.debtContacts;
    },
    contacts({ state }: { state: StoreState }) {
      return state.contacts;
    },
    currentDebt({ state }: { state: StoreState }) {
      return state.currentDebt;
    },
    dueDebts({ state }: { state: StoreState }) {
      return state.debts
        .filter((debt: Debt) => debt.untilDueDate <= DEBT_DUE_SOON_DAYS)
        .sort((a: Debt, b: Debt) => a.untilDueDate - b.untilDueDate);
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