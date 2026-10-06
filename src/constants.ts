export const SUPABASE_STORAGE_PATH = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public`;
export const CAT_ICON_PATH = `${SUPABASE_STORAGE_PATH}/cat_icon`;
export const TRANSACTION_SOURCE = {
  MONEY: 'MONEY',
  CREDIT_CARD: 'CREDIT_CARD'
}
export const DEBT_DUE_SOON_DAYS = 5;
export const PICKLEBALL_FEES = [
  {
    value: 40000,
    text: '40k'
  },
  {
    value: 60000,
    text: '60k'
  },
  {
    value: 80000,
    text: '80k'
  },
  {
    value: 92000,
    text: '92k'
  },
  {
    value: 100000,
    text: '100k'
  },
  {
    value: 104000,
    text: '104k'
  },
  {
    value: 112000,
    text: '112k'
  },
  {
    value: 120000,
    text: '120k'
  },
  {
    value: 132000,
    text: '132k'
  },
  {
    value: 140000,
    text: '140k'
  },
  {
    value: 144000,
    text: '144k'
  },
];