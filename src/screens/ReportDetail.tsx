import { Navbar, Link, Page, Block, useStore, BlockTitle, PieChart, Chip } from 'framework7-react';
import { useCallback, useEffect } from 'react';
import type { Report } from '../models/Report';
import { formatVND } from '../utils/format';
import AppList from '../components/List';
import store from '../store';
import AppAccordion from '../components/Accordion';

const ReportDetail = () => {
  const report: Report | null = useStore('latestReport');

  const loadReport = useCallback(() => {
    store.dispatch('getLatestReport', true);
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    if (report && !report.viewed) {
      store.dispatch('updateReport', { id: report.id, viewed: true });
    }
  }, [report]);

  return (
    <Page id="report-detail-page">
      <Navbar title="Báo cáo">
        <Link slot="left" iconF7='bars' panelOpen="left"></Link>
      </Navbar>
        
      <BlockTitle large textColor="black" className="text-align-center">{report?.name}</BlockTitle>
      <Block strong inset>
        <div style={{ width: '50%', margin: '0 auto', fontSize: '12px' }}> 
          <PieChart
            size={10}
            datasets={[
              { value: (report?.cardAmount || 0) / (report?.amount || 1) * 100, color: '#0000BB' },
              { value: (report?.cashAmount || 0) / (report?.amount || 1) * 100, color: '#C0048E' },
            ]}
          />
          <div style={{ marginTop: '8px' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#0000BB', verticalAlign: 'middle', marginRight: 4 }} /> Thẻ: {formatVND(report?.cardAmount || 0)}<br />
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#C0048E', verticalAlign: 'middle', marginRight: 4 }} /> Tiền mặt: {formatVND(report?.cashAmount || 0)}
          </div>

          <div className="grid grid-cols-2 grid-gap" style={{ marginTop: '20px', fontSize: '15px', fontWeight: 'bold' }}>
            <div className="text-align-right">Tổng chi:</div>
            <div>{formatVND(report?.amount || 0)}</div>
          </div>

          <div className="grid grid-cols-2 grid-gap" style={{ fontSize: '15px', fontWeight: 'bold' }}>
            <div className="text-align-right">Khấu trừ:</div>
            <div>{formatVND(report?.deduction || 0)}</div>
          </div>

          <div className="grid grid-cols-2 grid-gap" style={{ fontSize: '15px', fontWeight: 'bold', borderTop: '1px solid black', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Còn lại:</div>
            <div>
              <Chip text={formatVND((report?.amount || 0) - (report?.deduction || 0))} color="pink" />
            </div>
          </div>
        </div>

      </Block>
        

      {Object.entries(report?.transactionsByCategory || {}).map(([name, transactions]) => (
        <AppAccordion
          opposite={true}
          items={[{
            id: name,
            title: name,
            mediaUrl: transactions[0]?.category?.iconUrl,
            after: formatVND(transactions.reduce((sum, t) => sum + t.amount, 0)),
            content: <AppList items={transactions.map(t => ({ id: t.id, title: `- ${t.description || t.originalContent}`, after: formatVND(t.amount), afterReplace: t.afterDeductedAmount !== null ? formatVND(t.afterDeductedAmount) : undefined }))} />,
          }]} />
      ))}

    </Page>
  );
};

export default ReportDetail;