import { Navbar, Link, Page, Block, useStore, BlockTitle, Segmented, Button, Icon } from 'framework7-react';
import { useCallback, useEffect, useMemo } from 'react';
import type { Transaction } from '../models/Transaction';
import { formatVND, formatShortDateTime } from '../utils/format';
import { Gauge } from 'framework7-react';
import AppList from '../components/List';
import store from '../store';
import { TRANSACTION_SOURCE } from '../constants';

const Transactions = () => {
  const transactions: Transaction[] = useStore('filteredTransactions');
  const source: string = useStore('source');
  const shopeeTotal: number = useStore('shopeeTotal');
  const transactionTotal: number = useStore('transactionTotal');
  const shopeeLimit: number = 4000000;
  const gaugeValue: number = useMemo(() => {
    return Math.min(shopeeTotal, shopeeLimit) / shopeeLimit;
  }, [shopeeTotal]);

  const loadTransaction = useCallback((done?: () => void) => {
    store.dispatch('getTransactions', null);
    if (done) done();
  }, []);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  return (
    <Page ptr ptrMousewheel={true} onPtrRefresh={loadTransaction} id="transaction-page">
      <Navbar title="Giao dịch" className="text-align-center">
        <Link slot="left" iconF7='bars' panelOpen="left"></Link>
      </Navbar>
      <BlockTitle>Tổng quan</BlockTitle>
      <Block inset strong outline className="text-align-center">
        <BlockTitle large textColor="black">Chi tiêu: {formatVND(transactionTotal)}</BlockTitle>
        <Gauge
          type="semicircle"
          value={gaugeValue}
          size={250}
          borderColor="#F05F10"
          borderWidth={15}
          valueText={`${formatVND(shopeeTotal)}`}
          valueFontSize={20}
          valueTextColor="#F05F10"
          labelText="được hoàn tiền Shopee"
        />
      </Block>

      <Block>
        <Segmented strong round>
          <Button smallMd active={source === TRANSACTION_SOURCE.CREDIT_CARD} onClick={() => store.dispatch('setSource', TRANSACTION_SOURCE.CREDIT_CARD)}>
            <Icon f7="creditcard_filled" slot="text" />
          </Button>
          <Button smallMd active={source === TRANSACTION_SOURCE.MONEY} onClick={() => store.dispatch('setSource', TRANSACTION_SOURCE.MONEY)}>
            <Icon f7="money_dollar_circle_filled" slot="text" />
          </Button>
        </Segmented>
      </Block>

      <BlockTitle>Danh sách giao dịch</BlockTitle>
      <AppList isMediaList isInset items={transactions?.map(transaction => ({
        id: transaction.id,
        title: transaction.category?.name || 'Danh mục mới',
        subtitle: formatShortDateTime(transaction.createdAt),
        text: transaction.description || transaction.originalContent,
        after: formatVND(transaction.amount || 0),
        afterColor: transaction.amount > 0 ? '#D90016' : '#00BB16',
        link: `/transactions/${transaction.id}/`,
        mediaUrl: transaction.category?.iconUrl
      }))} />

    </Page>
  );
};

export default Transactions;