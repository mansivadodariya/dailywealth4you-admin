'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/reducers';
import { fetchSetting, fetchAdminDashboardStats, fetchAdminProfitAndIbCommission, fetchUserDashboardProfitLots } from '@/store/slice/adminSlice';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import moment from 'moment';
import styles from './dashboard.module.scss';
import Select from 'react-select';
import Skeleton from '@/components/skeleton';

const DONUT_COLORS = ['#02df82', '#2B3535', '#1a2b2b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      <p className={styles.tooltipVal}>${payload[0].value?.toLocaleString()}</p>
      <div className={styles.tooltipArrow} />
    </div>
  );
};

const BADGE_OPTIONS = ['24 Hours', '7 Days', '30 Days'];

const customSelectStyles = {
  control: (p) => ({ ...p, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', minHeight: '26px', height: '26px', boxShadow: 'none', cursor: 'pointer', '&:hover': { border: '1px solid rgba(255,255,255,0.2)' } }),
  valueContainer: (p) => ({ ...p, padding: '0 2px 0 10px' }),
  input: (p) => ({ ...p, margin: 0, padding: 0, color: '#fafafa' }),
  singleValue: (p) => ({ ...p, color: '#fafafa', fontSize: '11px', fontWeight: '500' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (p) => ({ ...p, padding: '0 8px 0 4px', color: '#fafafa', '&:hover': { color: '#fafafa' }, svg: { width: '12px', height: '12px' } }),
  menu: (p) => ({ ...p, backgroundColor: '#1B2626', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }),
  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? 'rgba(255,255,255,0.1)' : s.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent', color: '#fafafa', fontSize: '11px', cursor: 'pointer', '&:active': { backgroundColor: 'rgba(255,255,255,0.1)' } }),
};

const Card = ({ label, value, change, badge, badgeValue, onBadgeChange, count, children, loading }) => (
  <div className={styles.statCard}>
    <div className={styles.statTop}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statRight}>
        {badge &&
          <Select
            value={{ value: badgeValue || badge, label: badgeValue || badge }}
            onChange={(opt) => onBadgeChange && onBadgeChange(opt.value)}
            options={BADGE_OPTIONS.map((o) => ({ value: o, label: o }))}
            styles={customSelectStyles}
            isSearchable={false}
          />
        }
      </div>
    </div>
    {loading ? (
      <Skeleton height="28px" width="60%" style={{ marginTop: '8px', marginBottom: '4px' }} />
    ) : (
      <p className={styles.statValue}>{value}
        {change && <span className={styles.change}>({change})</span>}
      </p>
    )}
    {count != null && (
      loading ? (
        <Skeleton height="14px" width="30%" />
      ) : (
        <p className={styles.withdrawCount}>Count: {count}</p>
      )
    )}
    {children}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { transactions, dashboardProfitLots, dashboardStats, adminProfitAndIbCommission, loading } = useSelector((s) => s.admin);
  const setting = useSelector((s) => s.admin.setting);
  const [form, setForm] = useState({ investor: '', ib: '', company: '' });
  const [donutLabel, setDonutLabel] = useState(null);
  const [chartRange, setChartRange] = useState('7 Days');
  const [badgeRanges, setBadgeRanges] = useState({});

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchAdminProfitAndIbCommission());
    dispatch(fetchSetting());
    dispatch(fetchTransactions({ limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setForm({
        investor: setting.investorPercentage || '',
        ib: setting.ibPercentage || '',
        company: setting.companyPercentage || '',
      });
    }
  }, [setting]);

  useEffect(() => {
    let startDate;
    const endDate = moment().format('YYYY-MM-DD');
    if (chartRange === '24 Hours') startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    else if (chartRange === '7 Days') startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    else if (chartRange === '30 Days') startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    dispatch(fetchUserDashboardProfitLots({ startDate, endDate }));
  }, [dispatch, chartRange]);

  // Stats from dashboardStats API
  const totalDeposit = dashboardStats?.totalDeposit ?? 0;
  const totalPendingWithdrawal = dashboardStats?.totalPendingWithdrawal ?? 0;
  const totalApprovedWithdrawal = dashboardStats?.totalApprovedWithdrawal ?? 0;
  const pendingWithdrawalCount = dashboardStats?.totalPendingWithdrawalCount ?? 0;
  const approvedWithdrawalCount = dashboardStats?.totalApprovedWithdrawalCount ?? 0;
  const allUserAccountBalance = dashboardStats?.allUserAccountBalance ?? 0;
  const totalUsers = dashboardStats?.totalUsers ?? 0;

  // Stats from adminProfitAndIbCommission API
  const totalInvestorShare = adminProfitAndIbCommission?.totalAdminProfitSharing ?? 0;
  const totalIbCommission = adminProfitAndIbCommission?.totalIbCommission ?? 0;
  const totalLots = adminProfitAndIbCommission?.totalLots ?? 0;

  const donutData = [
    { name: 'Investor', value: Number(form.investor) },
    { name: 'IB', value: Number(form.ib) },
    { name: 'Company', value: Number(form.company) },
  ];

  const lineData = (dashboardProfitLots?.portfolioGrowth || []).map((item) => ({
    date: moment(item.date).format('MM-DD'),
    value: Number(item.value ?? 0),
  }));

  const recentTx = transactions || [];

  const statCards = [
    { label: 'Total Deposits', value: `$${totalDeposit.toLocaleString()}` },
    { label: 'Gross Profit', value: '$12,694', badge: '24 Hours', change: '+12%' },
    { label: 'Net Profit', value: '$12,694', badge: '24 Hours', change: '+12%' },
    { label: 'Profit Sharing Paid', value: `$${totalInvestorShare.toLocaleString()}`, badge: '30 Days' },
    { label: 'Total Users', value: String(totalUsers) },
    { label: 'All Users Account Balance', value: `$${allUserAccountBalance.toLocaleString()}` },
    { label: 'IB Commission Paid', value: `$${totalIbCommission.toLocaleString()}`, badge: '30 Days' },
    { label: 'Total Lots Traded', value: String(totalLots), badge: '24 Hours' },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsGrid}>
        {statCards.map((c, i) => (
          <Card
            key={i}
            label={c.label}
            value={c.value}
            change={c.change}
            badge={c.badge}
            badgeValue={badgeRanges[i] || c.badge}
            onBadgeChange={(val) => setBadgeRanges((prev) => ({ ...prev, [i]: val }))}
            loading={loading || dashboardStats === null}
          />
        ))}
      </div>

      <div className={styles.mainRow}>
        {/* Line chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>Gross Profit Growth</span>
            <Select
              styles={customSelectStyles}
              isSearchable={false}
              value={{ value: chartRange, label: chartRange }}
              onChange={(opt) => setChartRange(opt.value)}
              options={BADGE_OPTIONS.map((o) => ({ value: o, label: o }))}
            />
          </div>
          <div className={styles.chartArea}>
            {loading || dashboardProfitLots === null || !dashboardProfitLots.portfolioGrowth ? (
              <Skeleton height="100%" width="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#02df82" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#02df82" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    offset={-50}
                    position={{ y: 50 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#02df82"
                    strokeWidth={2}
                    fill="url(#lineGlow)"
                    activeDot={{ r: 5, fill: '#02df82', stroke: '#030F0F', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <Card label="Pending Withdraw Requests" value={`$${totalPendingWithdrawal.toLocaleString()}`} count={pendingWithdrawalCount || 0} loading={loading || dashboardStats === null} />
          <Card label="Completed Withdraw Requests" value={`$${totalApprovedWithdrawal.toLocaleString()}`} count={approvedWithdrawalCount || 0} loading={loading || dashboardStats === null} />

          {/* Donut */}
          <div className={`${styles.donutCard} ${styles.fullWidth}`}>
            <span className={styles.chartTitle}>Current Sharing Model</span>
            <div className={styles.donutWrap}>
              {loading || dashboardStats === null ? (
                <Skeleton variant="circle" height="220px" width="220px" style={{ margin: '0 auto' }} />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <defs>
                        <pattern id="patternHatch" width="6" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
                          <rect width="6" height="4" fill="transparent" />
                          <line x1="0" y1="0" x2="0" y2="4" stroke="#848A8A" strokeWidth="2" />
                        </pattern>
                      </defs>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={110}
                        startAngle={270}
                        endAngle={-90}
                        cornerRadius={12}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {donutData.map((d, i) => (
                          <Cell
                            key={i}
                            fill={i === 2 ? 'url(#patternHatch)' : DONUT_COLORS[i]}
                            stroke="none"
                            onClick={() => setDonutLabel(d)}
                            cursor="pointer"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.donutCenter}>
                    <span className={styles.donutLabel}>{donutLabel ? donutLabel.name : donutData[0].name}</span>
                    <span className={styles.donutPct}>{donutLabel ? donutLabel.value : donutData[0].value}%</span>
                  </div>
                </>
              )}
            </div>
            <div className={styles.donutLegend}>
              {donutData.map((d, i) => (
                <span key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={
                      i === 2
                        ? { backgroundImage: `repeating-linear-gradient(0deg, #848A8A 0px, #848A8A 1px, transparent 1px, transparent 4px)`, backgroundColor: 'transparent' }
                        : { background: DONUT_COLORS[i] }
                    }
                  />
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={`${styles.txCard} ${styles.fullWidth}`}>
            <span className={styles.chartTitle}>Recent Transactions</span>
            <div className={styles.txList}>
              {loading || transactions === null ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.txItem}>
                    <div style={{ flex: 1 }}>
                      <Skeleton height="16px" width="60%" style={{ marginBottom: '4px' }} />
                      <Skeleton height="12px" width="40%" style={{ marginBottom: '4px' }} />
                      <Skeleton height="10px" width="30%" />
                    </div>
                    <div className={styles.txRight}>
                      <Skeleton height="16px" width="60px" style={{ marginBottom: '4px' }} />
                      <Skeleton height="12px" width="40px" />
                    </div>
                  </div>
                ))
              ) : recentTx.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.txItem}>
                    <div>
                      <p className={styles.txName}>Rajat Sharma</p>
                      <p className={styles.txId}>#987456</p>
                      <p className={styles.txTime}>4 Minutes Ago</p>
                    </div>
                    <div className={styles.txRight}>
                      <p className={styles.txAmount}>$12,478</p>
                      <span className={styles.txBadge}>Deposit</span>
                    </div>
                  </div>
                ))
              ) : (
                recentTx.map((tx, i) => (
                  <div key={i} className={styles.txItem}>
                    <div>
                      <p className={styles.txName}>{tx.user?.firstName ?? ''} {tx.user?.lastName ?? ''}</p>
                      <p className={styles.txId}>#{tx.user?.accNumber}</p>
                      <p className={styles.txTime}>{moment(tx.createdAt).fromNow()}</p>
                    </div>
                    <div className={styles.txRight}>
                      <p className={styles.txAmount}>${Number(tx.amount || 0).toLocaleString()}</p>
                      <span className={styles.txBadge}>
                        {tx.type ? tx.type.slice(0, 1).toUpperCase() + tx.type.slice(1) : '—'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
