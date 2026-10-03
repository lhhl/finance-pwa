
import React from 'react';
import { Page, Block, Tabs, Tab, Link, Toolbar, ToolbarPane } from 'framework7-react';

interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  onTabChange?: (tabId: string) => void;
  showToolbar?: boolean;
}

export default function AppTabs({
  tabs,
  onTabChange,
  showToolbar = true,
}: TabsComponentProps) {

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
  };

  if (!tabs || tabs.length === 0) {
    return (
      <Page pageContent={false}>
        <Block>
          <p>No tabs provided</p>
        </Block>
      </Page>
    );
  }

  return (
    <Page pageContent={false}>
      {showToolbar && (
        <Toolbar bottom tabbar>
          <ToolbarPane>
            {tabs.map((tab, index) => (
              <Link
                key={tab.id}
                tabLink={`#${tab.id}`}
                tabLinkActive={index === 0}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.title}
              </Link>
            ))}
          </ToolbarPane>
        </Toolbar>
      )}
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            id={tab.id}
            className="page-content"
            tabActive={index === 0}
          >
            {tab.content}
          </Tab>
        ))}
      </Tabs>
    </Page>
  );
}