import { Navbar, Link, Page, Block, useStore, PieChart, BlockTitle } from 'framework7-react';
import { useCallback, useEffect } from 'react';
import type { DebtContact } from '../models/DebtContact';
import { formatVND } from '../utils/format';
import AppList from '../components/List';
import AppAccordion from '../components/Accordion';
import store from '../store';

const CHART_COLORS = ['#0000BB', '#C0048E', '#F05F10', '#14A44D', '#E4A11B', '#54B4D3', '#9C27B0', '#795548'];

const Debts = () => {
  const debtContacts: DebtContact[] = useStore('debtContacts');
  const total = debtContacts.reduce((sum, contact) => sum + contact.totalAmount, 0);
  const chartData = debtContacts.map((contact, index) => ({
    contact,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const loadDebts = useCallback(() => {
    store.dispatch('getDebtContacts', null);
  }, []);

  useEffect(() => {
    loadDebts();
  }, [loadDebts]);

  return (
    <Page id="debts-page">
      <Navbar title="Khoản cho vay">
        <Link slot="left" iconF7='bars' panelOpen="left"></Link>
        <Link slot="right" iconF7='plus' href="/debts/new/"></Link>
      </Navbar>

      <Block strong inset>
        <div style={{ width: '50%', margin: '0 auto', fontSize: '12px' }}>
          <PieChart
            size={10}
            datasets={chartData.map(({ contact, color }) => ({
              value: contact.totalAmount / (total || 1) * 100,
              color,
            }))}
          />
          <div style={{ marginTop: '8px' }}>
            {chartData.map(({ contact, color }) => (
              <div key={contact.id}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: color, verticalAlign: 'middle', marginRight: 4 }} /> {contact.name}: {formatVND(contact.totalAmount)}
              </div>
            ))}
          </div>
        </div>
      <BlockTitle textColor='black' className='text-align-center'>Tổng cho vay: {formatVND(total)}</BlockTitle>
      </Block>

      {debtContacts.filter((contact) => contact.debts.length > 0).map((contact) => (
        <AppAccordion
          key={contact.id}
          opposite={true}
          items={[{
            id: contact.id,
            title: `${contact.hasDueDebts ? '🔴' : ''} ${contact.name}`,
            after: formatVND(contact.totalAmount),
            icon: 'person_crop_circle',
            content: <AppList items={contact.debts.map(debt => ({
              id: debt.id,
              title: debt.dueDateStatus,
              after: formatVND(debt.amount),
              link: `/debts/${debt.id}/`,
            }))} />,
          }]} />
      ))}

    </Page>
  );
};

export default Debts;
