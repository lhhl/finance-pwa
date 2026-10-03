import { Panel, ListItem, List, Icon, BlockTitle } from 'framework7-react';
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
    title: 'Khoản nợ',
    icon: 'person_2',
    link: '/debts/'
  }
];

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
        <ListItem noChevron panelClose link="#" title="Đăng xuất" onClick={() => supabase.auth.signOut()}>
          <Icon f7="square_arrow_right" slot="media" />
        </ListItem>
      </List>
    </div>
  </Panel>
  );
};

export default AppPanel;