
import { Block, Chip, Icon, List, ListItem } from 'framework7-react';

interface AppListItem {
  id: string | number;
  title: string;
  subtitle?: string;
  text?: string;
  after?: string;
  link?: string;
  mediaUrl?: string;
  mediaSize?: number;
  mediaRadius?: boolean;
  badge?: string;
  afterColor?: string;
}

interface AppListProps {
  title?: string;
  subtitle?: string;
  items: AppListItem[];
  onItemClick?: (item: AppListItem) => void;
  mediaSize?: number;
  showMediaRadius?: boolean;
  isMediaList?: boolean;
  isInset?: boolean;
}

export default function AppList({
  subtitle,
  items,
  onItemClick,
  mediaSize = 40,
  showMediaRadius = true,
  isMediaList = false,
  isInset = false,
}: AppListProps) {
  if (!items || items.length === 0) {
    return (
      <Block className="text-align-center" strongIos insetIos outlineIos>
        <Icon f7="face_smiling" size="25px" /> Không có gì ở đây
      </Block>
    );
  }

  return (
    <>
      {subtitle && (
        <Block>
          <p>{subtitle}</p>
        </Block>
      )}
      <List dividersIos mediaList={isMediaList} outlineIos strongIos insetIos={isInset}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            link={item.link}
            title={item.title}
            subtitle={item.subtitle}
            text={item.text}
            noChevron
            onClick={() => onItemClick?.(item)}
          >
            {item.mediaUrl && (
              <img
                slot="media"
                style={{
                  borderRadius: showMediaRadius || item.mediaRadius ? '8px' : '0px',
                }}
                src={item.mediaUrl}
                width={item.mediaSize || mediaSize}
              />
            )}
            <span slot="after" style={{ color: item.afterColor || '#7E7E7E', fontWeight: 'bold' }}>{item.after}</span>
            {item.badge && (
              <Chip slot="after" text={item.badge} color="red" style={{ position: 'absolute', top: 20, right: 0 }} />
            )}
          </ListItem>
        ))}
      </List>
    </>
  );
}