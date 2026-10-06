import { Panel, ListItem, List, Icon, BlockTitle, f7 } from 'framework7-react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth/AuthContext';

const MENU_ITEMS = [
  {
    id: '1',
    title: 'Tổng quan',
    icon: 'house',
    link: '/'
  },
  {
    id: '2',
    title: 'Giao dịch',
    icon: 'creditcard',
    link: '/transactions/'
  },
  {
    id: '3',
    title: 'Báo cáo',
    icon: 'doctext',
    link: '/reports/'
  },
  {
    id: '4',
    title: 'Khoản cho vay - nợ',
    icon: 'person_2',
    link: '/debts/'
  }
];

const refreshApp = async () => {
  if (!navigator.onLine) {
    f7.dialog.alert('Cần kết nối mạng để cập nhật ứng dụng');
    return;
  }
  f7.preloader.show();
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    window.location.reload();
  } catch (error) {
    f7.preloader.hide();
    f7.dialog.alert(`Không thể cập nhật: ${error instanceof Error ? error.message : error}`);
  }
};

const AppPanel = () => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? '';

  return (
  <Panel floating left containerEl="#main-page" id="panel-nested">
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BlockTitle textColor="black" style={{ marginBottom: 'auto' }}>Xin chào, <br/>{displayName}</BlockTitle>
      <List dividersIos>
      {MENU_ITEMS.map(item => (
        <ListItem key={item.id} panelClose link={item.link} title={item.title}>
          <Icon f7={item.icon} slot="media" />
        </ListItem>
      ))}
      </List>
      <List dividersIos style={{ marginTop: 'auto' }}>
        <ListItem noChevron panelClose link="#" title="Cập nhật ứng dụng" onClick={refreshApp}>
          <Icon f7="arrow_clockwise" slot="media" />
        </ListItem>
        <ListItem noChevron panelClose link="#" title="Đăng xuất" onClick={() => supabase.auth.signOut()}>
          <Icon f7="square_arrow_right" slot="media" />
        </ListItem>
      </List>
      <div className="text-align-center" style={{ fontSize: '12px', color: '#8e8e93', marginBottom: '16px' }}>
        Phiên bản: {__APP_VERSION__}
      </div>
    </div>
  </Panel>
  );
};

export default AppPanel;