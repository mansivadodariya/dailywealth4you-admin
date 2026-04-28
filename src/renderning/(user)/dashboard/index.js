'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithdrawRequests, fetchTransactions, fetchAdminProfitSharing, fetchUserDashboardProfitLots } from '@/store/reducers';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import moment from 'moment';
import styles from './dashboard.module.scss';
import { fetchSetting } from '@/store/slice/adminSlice';

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

const Card = ({ label, value, change, badge, count, children }) => (
  <div className={styles.statCard}>
    <div className={styles.statTop}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statRight}>
        {badge && (
          <div className={styles.badge}>

            {badge} <span className={styles.chevron}>

            </span>
            <img src="/assets/icons/down.svg" alt="chevron" />

          </div>
        )}
      </div>
    </div>

    <p className={styles.statValue}>{value}
      {change && <span className={styles.change}>({change})</span>}
    </p>
    {count && <p className={styles.withdrawCount}>Count: {count}</p>}
    {children}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { withdrawRequests, transactions, dashboardProfitLots } = useSelector((s) => s.admin);
  const setting = useSelector((s) => s.admin.setting);
  const [form, setForm] = useState({ investor: '', ib: '', company: '' });
  const [donutLabel, setDonutLabel] = useState(null);
  
  console.log(donutLabel,"donutLabel");
  
  const { profitSharing } = useSelector((s) => s.admin);

  const [chartRange, setChartRange] = useState('7 Days');
  console.log(form, "currentSharing");

  useEffect(() => {
    dispatch(fetchWithdrawRequests({ limit: 100 }));
    dispatch(fetchTransactions({limit: 10 }));
    dispatch(fetchAdminProfitSharing({ limit: 100 }));
    dispatch(fetchSetting());
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
    let endDate = moment().format('YYYY-MM-DD');

    if (chartRange === '24 Hours') {
      startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    } else if (chartRange === '7 Days') {
      startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    } else if (chartRange === '30 Days') {
      startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    }

    dispatch(fetchUserDashboardProfitLots({ startDate, endDate }));
  }, [dispatch, chartRange]);

  // --- stat derivations ---
  const deposits = transactions || [];
  const totalDeposits = deposits.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const withdrawals = withdrawRequests || [];
  const pendingWithdraw = withdrawals.filter((r) => r.status === 'pending');
  const completedWithdraw = withdrawals.filter((r) => r.status === 'approved' || r.status === 'completed');
  const pendingWithdrawTotal = pendingWithdraw.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const completedWithdrawTotal = completedWithdraw.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  // profit sharing donut
  const totalInvestorShare = (profitSharing || []).reduce((s, r) => {
    const share = (r.brokers || []).reduce((a, b) => a + (b.totalProfitShare || 0), 0);
    return s + (r.totalProfitShare ?? share ?? 0);
  }, 0);

  const donutData = [
    { name: 'Investor', value: Number(form.investor) },
    { name: 'IB', value: Number(form.ib) },
    { name: 'Company', value: Number(form.company) },
  ];

  // line chart — data from API
  const lineData = (dashboardProfitLots?.portfolioGrowth || []).map((item) => ({
    date: moment(item.date).format('MM-DD'),
    value: Number(item.value ?? 0),
  }));

  // recent transactions (deposits)
  const recentTx = deposits.slice(0, 6);

  const statCards = [
    { label: 'Total Deposits', value: `$${totalDeposits.toLocaleString()}`, badge: null },
    { label: 'Gross Profit', value: `$12,694`, badge: '24 Hours', change: '+12%' },
    { label: 'Net Profit', value: `$12,694`, badge: '24 Hours', change: '+12%' },
    { label: 'Profit Sharing Paid', value: `$${totalInvestorShare.toLocaleString() || '12,694'}`, badge: 'All Time' },
    { label: 'Total Users', value: '204', badge: null },
    { label: 'All Users Account Balance', value: '$1,800,000.82', badge: null },
    { label: 'IB Commission Paid', value: '$60,785', badge: 'All Time' },
    { label: 'Total Lots Traded', value: '1534.2', badge: '24 Hours' },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Row 1 — 4 stat cards */}
      <div className={styles.statsGrid}>
        {statCards.map((c, i) => (
          <Card key={i} label={c.label} value={c.value} change={c.change} badge={c.badge} />
        ))}
      </div>

      {/* Row 2 — chart (left wide) + right column */}
      <div className={styles.mainRow}>
        {/* Line chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>Gross Profit Growth</span>
            <select
              className={styles.select}
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
            >
              {['24 Hours', '7 Days', '30 Days'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#02df82" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#02df82" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
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
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Pending withdraw */}
          <Card
            label="Pending Withdraw Requests"
            value={`$${pendingWithdrawTotal.toLocaleString()}`}
            count={pendingWithdraw.length}
          />

          {/* Completed withdraw */}
          <Card
            label="Completed Withdraw Requests"
            value={`$${completedWithdrawTotal.toLocaleString()}`}
            count={completedWithdraw.length || "0"}
          />

          {/* Donut */}
          <div className={`${styles.donutCard} ${styles.fullWidth}`}>
            <span className={styles.chartTitle}>Current Sharing Model</span>
            <div className={styles.donutWrap}>
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
                        fill={i === 2 ? "url(#patternHatch)" : DONUT_COLORS[i]}
                        stroke="none"
                        onClick={() => setDonutLabel(d)}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
                <span className={styles.donutLabel}>{donutLabel?.name || "Investor"}</span>
                <span className={styles.donutPct}>{donutLabel?.value || "50"}%</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {donutData.map((d, i) => (
                <span key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={
                      i === 2
                        ? {
                          backgroundImage: `repeating-linear-gradient(
            0deg,
            #848A8A 0px,
            #848A8A 1px,
            transparent 1px,
            transparent 4px
          )`,
                          backgroundColor: 'transparent',
                        }
                        : { background: DONUT_COLORS[i] }
                    }
                  />                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className={`${styles.txCard} ${styles.fullWidth}`}>
            <span className={styles.chartTitle}>Recent Transactions</span>
            <div className={styles.txList}>
              {recentTx.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
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
                : recentTx.map((tx, i) => (
                  <div key={i} className={styles.txItem}>
                    <div>
                      <p className={styles.txName}>
                        {tx.user?.firstName ?? ''} {tx.user?.lastName ?? ''}
                      </p>
                      <p className={styles.txId}>#{tx.user.accNumber}</p>
                      <p className={styles.txTime}>{moment(tx.createdAt).fromNow()}</p>
                    </div>
                    <div className={styles.txRight}>
                      <p className={styles.txAmount}>${Number(tx.amount || 0).toLocaleString()}</p>
                      <span className={styles.txBadge}>{(tx.type).slice(0, 1).toUpperCase() + (tx.type).slice(1)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
