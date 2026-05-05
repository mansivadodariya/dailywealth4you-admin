'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSetting, updateSetting } from '@/store/slice/adminSlice';
import { resetPassword } from '@/store/slice/loginSlice';
import { toast } from 'react-toastify';
import styles from './settings.module.scss';
import Input from '@/components/input';
import CloseIcon from '@/icons/closeIcon';
import ActionButtons from '@/components/common/actionButtons';

const MENU = [
  { key: 'profitShare', label: 'Profit Share Setup', icon: '/assets/icons/ProfitShareSetup.svg' },
  { key: 'minWithdraw', label: 'Minimum Withdraw Amount', icon: '/assets/icons/MinimumWithdrawAmount.svg' },
  { key: 'changePassword', label: 'Change Password', icon: '/assets/icons/ChangePassword.svg' },
];

export default function Settings() {
  const [active, setActive] = useState('profitShare');

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        <div className={styles.menu}>
          {MENU.map((item) => (
            <button
              key={item.key}
              className={`${styles.menuItem} ${active === item.key ? styles.menuItemActive : ''}`}
              onClick={() => setActive(item.key)}
            >
              <img src={item.icon} alt="" className={styles.menuIcon} />
              <span>{item.label}</span>
              <span className={styles.menuChevron}>›</span>
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          {active === 'profitShare'    && <ProfitSharePanel />}
          {active === 'minWithdraw'    && <MinWithdrawPanel />}
          {active === 'changePassword' && <ChangePasswordPanel />}
        </div>
      </div>
    </div>
  );
}

function ProfitSharePanel() {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.admin.setting);
  const [form, setForm] = useState({ investor: '', ib: '', company: '', broker: '' });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setForm({
        investor: setting.investorPercentage || '',
        ib: setting.ibPercentage || '',
        company: setting.companyPercentage || '',
        broker: setting.brokerCommission || '',
      });
    }
  }, [setting]);

  const handleSave = () => {
    const inv = Number(form.investor) || 0;
    const ib = Number(form.ib) || 0;
    const co = Number(form.company) || 0;

    if (inv + ib + co !== 100) {
      toast.error('Total percentage (Investor + IB + Company) must be exactly 100%.');
      return;
    }

    if (!setting?.id && !setting?._id) return;
    dispatch(updateSetting({
      id: setting.id || setting._id,
      investorPercentage: form.investor,
      ibPercentage: form.ib,
      companyPercentage: form.company,
      brokerCommission: form.broker,
    }));
  };

  const handleCancel = () => {
    if (setting) {
      setForm({
        investor: setting.investorPercentage || '',
        ib: setting.ibPercentage || '',
        company: setting.companyPercentage || '',
        broker: setting.brokerCommission || '',
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.fieldGroup}>
        <label>Investor</label>
        <Input plain type="number" suffix="%" value={form.investor} onChange={(e) => set('investor', e.target.value)} placeholder="e.g. 50" />
      </div>
      <div className={styles.fieldGroup}>
        <label>IB</label>
        <Input plain type="number" suffix="%" value={form.ib} onChange={(e) => set('ib', e.target.value)} placeholder="e.g. 10" />
      </div>
      <div className={styles.fieldGroup}>
        <label>Company</label>
        <Input plain type="number" suffix="%" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="e.g. 40" />
      </div>
      <div className={styles.fieldGroup}>
        <label>Broker Commissions</label>
        <Input plain type="number" prefix="$" value={form.broker} onChange={(e) => set('broker', e.target.value)} placeholder="e.g. 5" />
      </div>
      <ActionButtons onSave={handleSave} onCancel={handleCancel} layout="row" />
    </div>
  );
}

function MinWithdrawPanel() {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.admin.setting);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setAmount(setting.minWithdrawAmount || '');
    }
  }, [setting]);

  const handleSave = () => {
    if (!setting?.id && !setting?._id) return;
    dispatch(updateSetting({
      id: setting.id || setting._id,
      minWithdrawAmount: amount,
    }));
  };

  const handleCancel = () => {
    if (setting) {
      setAmount(setting.minWithdrawAmount || '');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.fieldGroup}>
        <label>Set Minimum Withdraw Amount</label>
        <Input plain type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 50" />
      </div>
      <ActionButtons onSave={handleSave} onCancel={handleCancel} layout="row" />
    </div>
  );
}

function ChangePasswordPanel() {
  const dispatch = useDispatch();
  const { resetPasswordLoading } = useSelector((state) => state.login);
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const handleSave = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!passwordRegex.test(form.newPass)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (form.newPass !== form.confirm) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    dispatch(resetPassword({ oldPassword: form.current, newPassword: form.newPass })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Password changed successfully.');
        setForm({ current: '', newPass: '', confirm: '' });
      } else {
        toast.error(res.payload || 'Failed to change password.');
      }
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.fieldGroup}>
        <label>Current Password</label>
        <Input
          plain type="password"
          value={form.current}
          onChange={(e) => set('current', e.target.value)}
          placeholder="••••••••••"
          leftIcon="/assets/icons/lock.svg"
          rightIcon="/assets/icons/eye-off.svg"
          rightIconActive="/assets/icons/eye.svg"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label>New Password</label>
        <Input
          plain type="password"
          value={form.newPass}
          onChange={(e) => set('newPass', e.target.value)}
          placeholder="••••••••••"
          leftIcon="/assets/icons/lock.svg"
          rightIcon="/assets/icons/eye-off.svg"
          rightIconActive="/assets/icons/eye.svg"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label>Confirm Password</label>
        <Input
          plain type="password"
          value={form.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          placeholder="••••••••••"
          leftIcon="/assets/icons/lock.svg"
          rightIcon="/assets/icons/eye-off.svg"
          rightIconActive="/assets/icons/eye.svg"
        />
      </div>
      <ActionButtons onSave={handleSave} onCancel={() => setForm({ current: '', newPass: '', confirm: '' })} loading={resetPasswordLoading} layout="row" />
    </div>
  );
}
