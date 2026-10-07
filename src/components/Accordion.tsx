import React from 'react';
import { AccordionContent, BlockTitle, Icon, List, ListItem } from 'framework7-react';

export interface AccordionItem {
  id: string | number;
  title: string;
  after?: string;
  content: React.ReactNode;
  opened?: boolean;
  mediaUrl?: string;
  icon?: string;
}

interface AccordionProps {
  title?: string;
  items: AccordionItem[];
  opposite?: boolean;
  onItemOpen?: (item: AccordionItem) => void;
  onItemClose?: (item: AccordionItem) => void;
}

export default function AppAccordion({
  title,
  items,
  opposite = false,
  onItemOpen,
  onItemClose,
}: AccordionProps) {
  return (
    <>
      {title && <BlockTitle>{title}</BlockTitle>}
      <List strong inset dividersIos accordionList accordionOpposite={opposite}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            accordionItem
            accordionItemOpened={item.opened}
            title={item.title}
            after={item.after}
            onAccordionOpen={() => onItemOpen?.(item)}
            onAccordionClose={() => onItemClose?.(item)}
          >
            {item.mediaUrl ? (
              <img
                slot="media"
                src={item.mediaUrl}
                style={{
                  borderRadius: '4px',
                }}
                width={'30'}
                height={'30'}
              />
            ) : item.icon ? (
              <Icon size="30" slot="media" f7={item.icon} />
            ) : (
              <Icon size="30" slot="media" f7="question_circle" />
            )}
            <AccordionContent>{item.content}</AccordionContent>
          </ListItem>
        ))}
      </List>
    </>
  );
}
