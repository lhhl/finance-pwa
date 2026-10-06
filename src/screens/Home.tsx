import { Navbar, Link, Page, Block, useStore, BlockTitle, f7, Card, CardContent, CardHeader, Button } from 'framework7-react';
import { useCallback, useEffect, useMemo } from 'react';
import store from '../store';
import { formatVND } from '../utils/format';
import { Gauge } from 'framework7-react';
import type { Debt } from '../models/Debt';
import AppList from '../components/List';
import picUrl from '../assets/pic.webp';
import { PICKLEBALL_FEES } from '../constants';
import { useAuth } from '../auth/AuthContext';

const Home = () => {
  const shopeeTotal: number = useStore('shopeeTotal');
  const transactionTotal: number = useStore('transactionTotal');
  const ownerDebts: Debt[] = useStore('ownerDueDebts');
  const debtorDebts: Debt[] = useStore('debtorDueDebts');
  const shopeeLimit: number = 4000000;
  const gaugeValue: number = useMemo(() => {
    return Math.min(shopeeTotal, shopeeLimit) / shopeeLimit;
  }, [shopeeTotal]);
  const auth = useAuth();
  const userId = auth.user?.id;

  const loadTransaction = useCallback((done?: () => void) => {
    store.dispatch('getTodaySum', null);
    store.dispatch('getMonthSum', null);
    store.dispatch('getTransactions', null);
    if (done) done();
  }, []);

  const openPrompt = () => {
    const dialog = f7.dialog.prompt('Nhập chi phí', 'Pickleball', (fee) => {
      const amount = Number(fee);
      if (!Number.isFinite(amount) || amount <= 0) return;
      handleAddExpenseNote(amount);
    });
    dialog.$el.find('.dialog-input').attr({ type: 'number', inputmode: 'numeric', min: '0' });
  };

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  useEffect(() => {
    if (!userId) return;
    store.dispatch('getOwnerDebts', userId).catch((error: unknown) => {
      console.error('Failed to load owner debts:', error);
    });
    store.dispatch('getDebtorDebts', userId).catch((error: unknown) => {
      console.error('Failed to load debtor debts:', error);
    });
  }, [userId]);

  const handleAddExpenseNote = useCallback((amount: number) => {
    f7.dialog.confirm(
      `Thêm ${formatVND(amount)} cho hôm nay?`,
      'Xác nhận',
      () => {
        store.dispatch('addExpenseNote', {
          amount
        });
      }
    );
  }, []);

  return (
    <Page id="home-page">
      <Navbar title="Tổng quan" className="text-align-center">
        <Link slot="left" iconF7='bars' panelOpen="left"></Link>
      </Navbar>

      {ownerDebts.length > 0 && (
        <>
          <BlockTitle>{ownerDebts.length} khoản cho vay sắp đến hạn</BlockTitle>

          <AppList isInset isMediaList items={ownerDebts.map((debt) => ({
            id: debt.id,
            title: `${(debt.debtor?.name || '')}`,
            subtitle: debt.dueDateStatus,
            after: formatVND(debt.amount),
            text: `Phí: ${debt.interest_rate}%`,
            link: `/debts/?source=owner`,
            badge: formatVND(debt.amount * debt.interest_rate / 100),
            badgeColor: debt.feePaidDateStatus ? 'green' : 'red',
            swipeButtons: debt.feePaidDateStatus ? [] : [
              {
                text: 'T.T Phí',
                action: async () => {
                  await store.dispatch('updateDebt', { id: debt.id, fee_paid_date: new Date() });
                  store.dispatch('getOwnerDebts', userId);
                },
              },
            ],
          }))} />
        </>
      )}

      {debtorDebts.length > 0 && (
        <>
          <BlockTitle>{debtorDebts.length} khoản nợ sắp đến hạn</BlockTitle>

          <AppList isInset isMediaList items={debtorDebts.map((debt) => ({
            id: debt.id,
            title: `${(debt.owner?.name || '')}`,
            subtitle: debt.dueDateStatus,
            after: formatVND(debt.amount),
            text: `Phí: ${debt.interest_rate}%`,
            link: `/debts/?source=debtor`,
            badge: formatVND(debt.amount * debt.interest_rate / 100),
            badgeColor: debt.feePaidDateStatus ? 'green' : 'red',
            swipeButtons: debt.feePaidDateStatus ? [] : [
              {
                text: 'T.T Phí',
                action: async () => {
                  await store.dispatch('updateDebt', { id: debt.id, fee_paid_date: new Date() });
                  store.dispatch('getDebtorDebts', userId);
                },
              },
            ],
          }))} />
        </>
      )}

      <div onClick={() => f7.views.main.router.navigate('/transactions/')}>
        <BlockTitle>Chi tiêu</BlockTitle>
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

      <BlockTitle>Pickleball</BlockTitle>
      <Card outlineMd>
        <CardHeader
          style={{
            backgroundImage: `linear-gradient(rgba(8, 8, 8, 0.67), rgba(212, 212, 212, 0.5)), url(${picUrl})`,
            backgroundSize: 'cover',
            height: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <div className="display-flex justify-content-space-around flex" style={{ width: '100%', flexWrap: 'wrap' }}>
            {PICKLEBALL_FEES.map((fee) => (
              <Button className="margin-top" outline tonal color="white" round key={fee.value} onClick={() => handleAddExpenseNote(fee.value)}>
                {fee.text}
              </Button>
            ))}
          </div>
          <div className="display-flex justify-content-space-around" style={{ width: '100%', flexWrap: 'wrap' }}>
            <Button fill color="white" round key="custom" onClick={() => openPrompt()}>
              Khác
            </Button>
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