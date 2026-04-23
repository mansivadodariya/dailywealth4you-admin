'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubAdmin } from '@/store/reducers';
import styles from './AddSubAdminModal.module.scss';
import Input from '@/components/input';
import CloseIcon from '@/icons/closeIcon';

import DeleteIcon from '@/icons/deleteIcon';

const ACCESS_OPTIONS = [
  'Access Dashboard Overview',
  'Manage Users',
  'Manage Withdraw Requests',
  'Manage IB Requests',
  'Send Notifications',
  'Manage KYC Requests',
];

// mode="add"  → Add New Sub-Admin form
// mode="view" → View/Edit existing sub-admin (pass admin={...})
export default function SubAdminModal({
  mode = 'add',
  onClose,
  // add mode
  onCreated,
  // view mode
  admin,
  onSave,
  onDelete,
  saving,
  deleting,
}) {
  const dispatch = useDispatch();
  const isAdd = mode === 'add';

  const [email, setEmail] = useState(admin?.email ?? '');
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(admin?.permissions ?? []);
  const [loading, setLoading] = useState(false);

  const toggle = (item) =>
    setAccess((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const handleAdd = () => {
    if (!email || !password || access.length === 0) return;
    setLoading(true);
    dispatch(addSubAdmin({ email, password, permissions: access })).then((res) => {
      setLoading(false);
      if (!res.error) { onCreated?.(); onClose(); }
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <div>
            <h2>{isAdd ? 'Add New Sub-Admin' : (admin?.email ?? '—')}</h2>
            {!isAdd && <p>{admin?.id?.slice(0, 6).toUpperCase() ?? '—'}</p>}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.body}>
          {isAdd && (
            <div className={styles.fieldGroup}>
              <label>Email</label>
              <Input
                plain
                type="email"
                placeholder="subadmin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon="/assets/icons/email.svg"
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label>Password</label>
            <Input
              plain
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon="/assets/icons/lock.svg"
              rightIcon="/assets/icons/eye-off.svg"
              rightIconActive="/assets/icons/eye.svg"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Access</label>
            <div className={styles.accessList}>
              {ACCESS_OPTIONS.map((item) => (
                <label key={item} className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={access.includes(item)}
                    onChange={() => toggle(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          {isAdd ? (
            <button className={styles.btnSave} onClick={handleAdd} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <>Add Sub-Admin <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 18, height: 18 }} /></>}
            </button>
          ) : (
            <>
              <button
                className={styles.btnSave}
                disabled={saving}
                onClick={() => onSave?.({ id: admin.id, password, permissions: access })}
              >
                {saving ? <span className={styles.spinner} /> : <>Save <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 18, height: 18 }} /></>}
              </button>
              <button
                className={styles.btnDelete}
                disabled={deleting}
                onClick={() => onDelete?.(admin.id)}
              >
                {deleting ? <span className={styles.spinner} /> : <>Delete This Sub-Admin <DeleteIcon /></>}
              </button>
            </>
          )}
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel <CloseIcon color="#ffffff" size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
