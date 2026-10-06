import { App, View } from 'framework7-react';
import ReportDetail from './screens/ReportDetail.tsx';
import Debts from './screens/Debts.tsx';
import DebtDetail from './screens/DebtDetail.tsx';
import Transactions from './screens/Transactions.tsx';
import TransactionDetail from './screens/TransactionDetail.tsx';
import store from './store.ts';
import MasterTemplate from './MasterTemplate.tsx';
import Home from './screens/Home.tsx';
import Login from './screens/Login.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import { useAuth } from './auth/AuthContext.ts';

const f7params: Parameters<typeof App>[0] = {
  name: 'Quản Lý Chi Tiêu',
  theme: 'ios',
  // Android reports finger jitter as touchmove; F7's default 5px cancels slower taps.
  touch: {
    touchClicksDistanceThreshold: 15,
  },
  store,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/transactions/',
      component: Transactions,
      routes: [
        {
          path: '/:id/',
          component: TransactionDetail,
        },
      ]
    },
    {
      path: '/reports/',
      component: ReportDetail,
    },
    {
      path: '/debts/',
      component: Debts,
      routes: [
        {
          path: '/new/',
          component: DebtDetail,
        },
        {
          path: '/:id/',
          component: DebtDetail,
        },
      ]
    }
  ],
};

// The routed View only mounts once signed in, so no screen can render or fetch without a session
const AppContent = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;
  if (!isLoggedIn) return <Login />;

  return (
    <MasterTemplate>
      <View main browserHistory browserHistorySeparator="" browserHistoryInitialMatch browserHistoryStoreHistory={false} />
    </MasterTemplate>
  );
};

const MyApp = () => (
  <AuthProvider>
    <App { ...f7params }>
      <AppContent />
    </App>
  </AuthProvider>
)

export default MyApp;