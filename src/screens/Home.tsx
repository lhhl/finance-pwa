import { Navbar, Link, Page, Block, useStore, BlockTitle, f7, Card, CardContent, CardHeader, Button } from 'framework7-react';
import { useCallback, useEffect, useMemo } from 'react';
import store from '../store';
import { formatVND } from '../utils/format';
import { Gauge } from 'framework7-react';
import type { Debt } from '../models/Debt';
import AppList from '../components/List';
import picUrl from '../assets/pic.webp';
import { PICKLEBALL_FEES } from '../constants';
import { ExpenseNote } from '../models/ExpenseNote';

const Home = () => {
  const shopeeTotal: number = useStore('shopeeTotal');
  const transactionTotal: number = useStore('transactionTotal');
  const dueDebts: Debt[] = useStore('dueDebts');
  const shopeeLimit: number = 4000000;
  const gaugeValue: number = useMemo(() => {
    return Math.min(shopeeTotal, shopeeLimit) / shopeeLimit;
  }, [shopeeTotal]);

  const loadTransaction = useCallback((done?: () => void) => {
    store.dispatch('getTodaySum', null);
    store.dispatch('getMonthSum', null);
    store.dispatch('getTransactions', null);
    if (done) done();
  }, []);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  useEffect(() => {
    store.dispatch('getDebts', null).catch((error: unknown) => {
      console.error('Failed to load debts:', error);
    });
  }, []);

  const handleAddExpenseNote = useCallback((amount: number) => {
    f7.dialog.confirm(
      `Thêm ${formatVND(amount)} cho hôm nay?`,
      'Xác nhận',
      () => {
        const expenseNote: Omit<ExpenseNote, 'id' | 'createdAt'> = {
          amount
        };
        store.dispatch('addExpenseNote', expenseNote);
      }
    );
  }, []);

  return (
    <Page id="home-page">
      <Navbar title="Tổng quan" className="text-align-center">
        <Link slot="left" iconF7='bars' panelOpen="left"></Link>
      </Navbar>


      <BlockTitle>Giao dịch</BlockTitle>

      <div onClick={() => f7.views.main.router.navigate('/transactions/')}>
      <Block inset strong outline className="text-align-center">
        <BlockTitle large textColor="black">Đã chi tiêu: {formatVND(transactionTotal)}</BlockTitle>
        <Gauge
          type="circle"
          value={gaugeValue}
          size={250}
          borderColor="#F05F10"
          borderWidth={25}
          valueText={`${formatVND(shopeeTotal)}`}
          valueFontSize={20}
          valueTextColor="#F05F10"
          labelText="được hoàn tiền Shopee"
        />
      </Block>
      </div>

      {dueDebts.length > 0 && (
        <>
          <BlockTitle>{dueDebts.length} khoản cho vay sắp đến hạn</BlockTitle>

          <AppList isInset isMediaList items={dueDebts.map((debt) => ({
            id: debt.id,
            title: `${(debt.contact?.name || '')}`,
            subtitle: debt.dueDateStatus,
            after: formatVND(debt.amount),
            text: `Phí: ${debt.interest_rate}%`,
            link: `/debts/`,
            badge: formatVND(debt.amount * debt.interest_rate / 100),
          }))} />
        </>
      )}

      <BlockTitle>Pickleball</BlockTitle>
      <Card outlineMd>
        <CardHeader
          style={{
            backgroundImage: `linear-gradient(rgba(8, 8, 8, 0.67), rgba(212, 212, 212, 0.5)), url(${picUrl})`,
            backgroundSize: 'cover',
            height: '250px',
          }}
        >
          <div className="display-flex justify-content-space-around" style={{ width: '100%', flexWrap: 'wrap' }}>
            {PICKLEBALL_FEES.map((fee) => (
              <Button className="margin-top" outline tonal color="white" round key={fee.value} onClick={() => handleAddExpenseNote(fee.value)}>
                {fee.text}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-align-center">Hôm nay: {formatVND(useStore('todaySumExpense'))}</div>
          <div className="text-align-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>Tổng tháng này: {formatVND(useStore('monthSumExpense'))}</div>
        </CardContent>
        
      </Card>

    </Page>
  );
};

export default Home;