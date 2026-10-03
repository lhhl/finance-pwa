import React, { useState, useEffect } from 'react';
import { Page, Navbar, Block, List, Button, ListInput, Icon, useStore } from 'framework7-react';
import { formatShortDateTime, formatVND } from '../utils/format';
import { Transaction } from '../models/Transaction';
import store from '../store';

interface TransactionDetailProps {
  id: string | number;
  onSave?: (data: { description: string; }) => void;
  onCancel?: () => void;
  f7router: any;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  id,
  onSave,
  onCancel,
  f7router
}) => {
  const transaction: Transaction | null = useStore('currentTransaction');
  const [editedDescription, setEditedDescription] = useState<string | null>(null);
  const description = editedDescription ?? transaction?.description ?? '';

  useEffect(() => {
    store.dispatch('getTransaction', id).catch((error: unknown) => {
      console.error('Failed to load transaction:', error);
    });
  }, [id]);

  const amount = transaction ? formatVND(transaction.amount) : '';
  const category = typeof transaction?.category?.name === 'string' ? transaction.category.name : '';
  const date = transaction ? formatShortDateTime(transaction.createdAt) : '';

  const handleSave = async () => {
    onSave?.({ description });
    await store.dispatch('updateTransaction', { id: id, description });
    f7router.back();
  };

  const handleCancel = () => {
    setEditedDescription(null);
    onCancel?.();
    f7router.back();
  };

  return (
    <Page>
      <Navbar title="Chi Tiết Giao Dịch" backLink="Quay Lại" />

      <List strongIos dividersIos insetIos>
        <ListInput
          label="Danh Mục"
          type="text"
          value={category}
          readonly={true}
        >
          <Icon f7="tag_circle" slot="media" />
        </ListInput>

        <ListInput
          label="Số tiền"
          type="text"
          value={amount}
          readonly={true}
          color='#767676'
        >
          <Icon f7="money_dollar" slot="media" />
        </ListInput>

        <ListInput
          label="Ngày"
          type="text"
          value={date}
          readonly={true}
        >
          <Icon f7="calendar" slot="media" />
        </ListInput>

        <ListInput
          label="Mô Tả"
          type="textarea"
          placeholder="Thêm mô tả giao dịch..."
          value={description}
          onChange={(e) => setEditedDescription(e.target.value)}
          clearButton
        >
          <Icon f7="doc_text" slot="media" />
        </ListInput>
      </List>

      <Block>
        <p className="grid grid-row-2 grid-gap">
          <Button onClick={handleSave} fill large roundIos>
            Lưu Giao Dịch
          </Button>
          <Button onClick={handleCancel} large tonal roundIos >
            Hủy
          </Button>
        </p>
      </Block>
    </Page>
  );
};

export default TransactionDetail;
