import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { LogOut, User, CheckCircle, Search, TrendingUp, Star } from 'lucide-react';

export const MockDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--primary-emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '2px solid rgba(16, 185, 129, 0.4)'
        }}
      >
        <CheckCircle size={32} />
      </div>

      <h2 className="form-title" style={{ fontSize: '1.8rem' }}>Welcome to PriceLens!</h2>
      <p className="form-subtitle" style={{ marginBottom: '1.5rem' }}>
        Frontend authentication successful (Mock Session)
      </p>

      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <User size={16} />
          <span>User: <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <span>Email: <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <span>Session Type: <strong style={{ color: 'var(--primary-emerald)' }}>Frontend Phase 1 Integration Ready</strong></span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <Search size={18} style={{ color: 'var(--primary-emerald)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tracked Products</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>12 Active</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <TrendingUp size={18} style={{ color: 'var(--accent-cyan)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg. Savings</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>24.5%</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <Star size={18} style={{ color: 'var(--accent-indigo)', marginBottom: '4px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Sentiment</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>4.8 / 5.0</div>
        </div>
      </div>

      <Button variant="outline" onClick={logout} icon={LogOut}>
        Sign Out (Test Login Again)
      </Button>
    </div>
  );
};
