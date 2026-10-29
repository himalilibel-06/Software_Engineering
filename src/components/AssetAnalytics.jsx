import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FiPieChart, FiBarChart2 } from 'react-icons/fi';

export default function AssetAnalytics({ assets }) {
  // --- 1. Process Data for Status Pie Chart ---
  const statusCounts = assets.reduce((acc, asset) => {
    const status = asset.status || 'Operational';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  // Match your exact design tokens
  const COLORS = {
    Operational: '#10b981', // emerald-500
    Maintenance: '#f59e0b', // amber-500
    Critical: '#ef4444',    // red-500
  };

  // --- 2. Process Data for Average Health by Category Bar Chart ---
  const categoryDataMap = assets.reduce((acc, asset) => {
    const cat = asset.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { totalHealth: 0, count: 0 };
    }
    acc[cat].totalHealth += asset.health || 100;
    acc[cat].count += 1;
    return acc;
  }, {});

  const barData = Object.keys(categoryDataMap).map(cat => ({
    category: cat,
    'Avg Health %': Math.round(categoryDataMap[cat].totalHealth / categoryDataMap[cat].count)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Bar Chart: Health Condition by Department/Category */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <FiBarChart2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Equipment Health Index</h3>
            <p className="text-xs text-slate-400">Average operational health rating per category</p>
          </div>
        </div>
        
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" axisLine={false} tickLine={false} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="Avg Health %" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Status Distribution Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <FiPieChart size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Status Allocation</h3>
            <p className="text-xs text-slate-400">Current allocation of assets across conditions</p>
          </div>
        </div>

        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Absolute Centered Metric */}
          <div className="absolute text-center">
            <span className="text-2xl font-bold text-slate-800">{assets.length}</span>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total</p>
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50 text-center">
          {pieData.map(entry => (
            <div key={entry.name}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.name] }} />
                {entry.name}
              </div>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}