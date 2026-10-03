import React, { useState, useEffect } from 'react';
import { Page, Navbar, Block, List, Button, ListInput, Icon, useStore, f7 } from 'framework7-react';
import { Debt } from '../models/Debt';
import { DebtContact } from '../models/DebtContact';
import store from '../store';

interface DebtDetailProps {
  id?: string | number;
  onSave?: (data: { amount: number; contactId: string; dueDay: number; interestRate: number }) => void;
  onCancel?: () => void;
  f7router: { back: () => void };
}

interface DebtForm {
  amount: string;
  contactId: string;
  dueDay: number;
  interestRate: string;
}

const DebtDetail: React.FC<DebtDetailProps> = ({
  id,
  onSave,
  onCancel,
  f7router
}) => {
  const isNew = !id;
  const storedDebt: Debt | null = useStore('currentDebt');
  // currentDebt may still hold the last debt viewed
  const debt = isNew ? null : storedDebt;
  const contacts: DebtContact[] = useStore('contacts');
  const [edits, setEdits] = useState<Partial<DebtForm>>({});

  useEffect(() => {
    store.dispatch('getContacts', null).catch((error: unknown) => {
      console.error('Failed to load contacts:', error);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    store.dispatch('getDebt', id).catch((error: unknown) => {
      console.error('Failed to load debt:', error);
    });
  }, [id]);

  const amount = edits.amount ?? (debt ? String(debt.amount) : '');
  const contactId = edits.contactId ?? debt?.contact_id ?? '';
  const dueDay = edits.dueDay ?? (debt?.due_day ?? 0);
  const interestRate = edits.interestRate ?? (debt?.interest_rate != null ? String(debt.interest_rate) : '');
  const isValid = contactId !== ''
    && amount !== '' && Number(amount) > 0
    && Number.isInteger(dueDay) && dueDay >= 1 && dueDay <= 31
    && (interestRate === '' || Number(interestRate) >= 0);

  const handleSave = async () => {
    const data = {
      amount: Number(amount),
      contactId,
      dueDay,
      interestRate: Number(interestRate || 0),
    };
    onSave?.(data);
    const payload = {
      amount: data.amount,
      contact_id: data.contactId,
      due_day: data.dueDay,
      interest_rate: data.interestRate,
    };
    if (isNew) {
      await store.dispatch('createDebt', payload);
    } else {
      await store.dispatch('updateDebt', { id, ...payload });
    }
    f7router.back();
  };

  const handleCancel = () => {
    setEdits({});
    onCancel?.();
    f7router.back();
  };

  const handleDelete = () => {
    f7.dialog.confirm('Bạn có chắc muốn xóa khoản cho vay này?', 'Xóa khoản cho vay', async () => {
      await store.dispatch('deleteDebt', id);
      f7router.back();
    });
  };

  return (
    <Page>
      <Navbar title={isNew ? 'Thêm khoản cho vay' : 'Chi tiết khoản cho vay'} backLink="Quay Lại" />

      <List strongIos dividersIos insetIos>
        <ListInput
          label="Người vay"
          type="select"
          value={contactId}
          onChange={(e) => setEdits((prev) => ({ ...prev, contactId: e.target.value }))}
        >
          <Icon f7="person_crop_circle" slot="media" />
          <option value="" disabled>Chọn người vay...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
          ))}
        </ListInput>

        <ListInput
          label="Ngày thanh toán"
          type="number"
          inputmode="numeric"
          placeholder="1 - 31"
          min={1}
          max={31}
          value={dueDay || ''}
          onChange={(e) => setEdits((prev) => ({ ...prev, dueDay: Number(e.target.value) }))}
        >
          <Icon f7="calendar" slot="media" />
        </ListInput>

        <ListInput
          label="Số tiền"
          type="text"
          inputmode="numeric"
          placeholder="Nhập số tiền..."
          value={amount ? Number(amount).toLocaleString('vi-VN') : ''}
          onChange={(e) => setEdits((prev) => ({ ...prev, amount: e.target.value.replace(/\D/g, '') }))}
          clearButton
        >
          <Icon f7="money_dollar" slot="media" />
        </ListInput>

        <ListInput
          label="Lãi suất (%)"
          type="number"
          inputmode="decimal"
          placeholder="0"
          min={0}
          value={interestRate}
          onChange={(e) => setEdits((prev) => ({ ...prev, interestRate: e.target.value }))}
          clearButton
        >
          <Icon f7="percent" slot="media" />
        </ListInput>
      </List>

      <Block>
        <p className="grid grid-row-3 grid-gap">
          <Button onClick={handleSave} fill large roundIos disabled={(!isNew && !debt) || !isValid}>
            Lưu Khoản Cho Vay
          </Button>
          <Button onClick={handleCancel} large tonal roundIos>
            Hủy
          </Button>
          {!isNew && (
            <Button onClick={handleDelete} large tonal roundIos color="red" disabled={!debt}>
              Xóa Khoản Cho Vay
            </Button>
          )}
        </p>
      </Block>
    </Page>
  );
};

export default DebtDetail;
