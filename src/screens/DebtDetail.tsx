import React, { useState, useEffect } from 'react';
import { Page, Navbar, Block, List, Button, ListInput, Icon, useStore, f7 } from 'framework7-react';
import { Debt } from '../models/Debt';
import { DebtContact } from '../models/DebtContact';
import store from '../store';
import { DebtService } from '../services/DebtService';
import { useAuth } from '../auth/AuthContext';

const debtService = new DebtService();

interface DebtDetailProps {
  id?: string | number;
  onSave?: (data: { amount: number; contactId: string; dueDay: number | null; interestRate: number }) => void;
  onCancel?: () => void;
  f7router: { back: () => void };
}

interface DebtForm {
  amount: string;
  contactId: string;
  dueDay: number | null;
  interestRate: string;
}

const DebtDetail: React.FC<DebtDetailProps> = ({
  id,
  onSave,
  onCancel,
  f7router
}) => {
  const isNew = !id;
  const [debt, setDebt] = useState<Debt | null>(null);
  const contacts: DebtContact[] = useStore('contacts');
  const debtSource: string = useStore('debtSource');
  const title = debtSource === 'owner' ? 'cho vay' : 'nợ';
  const [edits, setEdits] = useState<Partial<DebtForm>>({});

  useEffect(() => {
    store.dispatch('getContacts', null).catch((error: unknown) => {
      console.error('Failed to load contacts:', error);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    debtService.getDebtById(id).then((result) => {
      setDebt(result);
    });
  }, [id]);

  const amount = edits.amount ?? (debt ? String(debt.amount) : '');
  const contactId = edits.contactId ?? (debtSource === 'owner' ? debt?.debtorId : debt?.ownerId) ?? '';
  // null in edits means the user cleared the field, so don't fall back to the saved value
  const dueDay = edits.dueDay !== undefined ? edits.dueDay : (debt?.dueDay ?? null);
  const interestRate = edits.interestRate ?? (debt?.interestRate != null ? String(debt.interestRate) : '');
  const isValid = contactId !== ''
    && amount !== '' && Number(amount) > 0
    && (dueDay === null || (Number.isInteger(dueDay) && dueDay >= 1 && dueDay <= 31))
    && (interestRate === '' || Number(interestRate) >= 0);
  const auth = useAuth();
  const userId = auth.user?.id;

  const refreshDebts = async () => {
    if (debtSource === 'owner') {
      await store.dispatch('getOwnerDebts', userId);
    } else {
      await store.dispatch('getDebtorDebts', userId);
    }
  };

  const handleSave = async () => {
    const userContactId = contacts.find(contact => contact.userId === userId)?.id;
    const data = {
      amount: Number(amount),
      contactId,
      dueDay,
      interestRate: Number(interestRate || 0),
    };
    onSave?.(data);
    const payload = {
      amount: data.amount,
      owner_id: debtSource === 'owner' ? userContactId : data.contactId,
      debtor_id: debtSource === 'debtor' ? userContactId : data.contactId,
      due_day: data.dueDay,
      interest_rate: data.interestRate,
    };
    if (isNew) {
      await store.dispatch('createDebt', payload);
    } else {
      await store.dispatch('updateDebt', { id, ownerUserId: debt?.owner?.userId, ...payload });
    }

    await refreshDebts();
    f7router.back();
  };

  const handleCancel = () => {
    setEdits({});
    onCancel?.();
    f7router.back();
  };

  const handleDelete = () => {
    f7.dialog.confirm(`Bạn có chắc muốn xóa khoản ${title} này?`, `Xóa khoản ${title}`, async () => {
      await store.dispatch('deleteDebt', id);
      await refreshDebts();
      f7router.back();
    });
  };

  return (
    <Page>
      <Navbar title={isNew ? `Thêm khoản ${title}` : `Chi tiết khoản ${title}`} backLink="Quay Lại" />

      <List strongIos dividersIos insetIos>
        <ListInput
          label={debtSource === 'owner' ? 'Người vay' : 'Chủ nợ'}
          type="select"
          value={contactId}
          onChange={(e) => setEdits((prev) => ({ ...prev, contactId: e.target.value }))}
        >
          <Icon f7="person_crop_circle" slot="media" />
          <option value="" disabled>{debtSource === 'owner' ? 'Chọn người vay...' : 'Chọn chủ nợ...'}</option>
          {contacts.filter(contact => contact.userId !== userId).map((contact) => (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
          ))}
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
          label="Ngày thanh toán"
          type="number"
          inputmode="numeric"
          placeholder="1 - 31"
          min={1}
          max={31}
          value={dueDay ?? ''}
          onChange={(e) => setEdits((prev) => ({ ...prev, dueDay: e.target.value === '' ? null : Number(e.target.value) }))}
        >
          <Icon f7="calendar" slot="media" />
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
            Lưu khoản {title}
          </Button>
          <Button onClick={handleCancel} large tonal roundIos>
            Hủy
          </Button>
          {!isNew && (
            <Button onClick={handleDelete} large tonal roundIos color="red" disabled={!debt}>
              Xóa khoản {title}
            </Button>
          )}
        </p>
      </Block>
    </Page>
  );
};

export default DebtDetail;
