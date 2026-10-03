import { Page, useStore, f7 } from 'framework7-react';
import { useEffect } from 'react';
import AppPanel from './Panel';

const MasterTemplate = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useStore('loading');
  useEffect(() => {
    if (isLoading) {
      f7.preloader.show();
    } else {
      f7.preloader.hide();
    }
  }, [isLoading]);
  return (
    <Page id="main-page">
      <AppPanel />
      {children}
    </Page>
  );
};

export default MasterTemplate;