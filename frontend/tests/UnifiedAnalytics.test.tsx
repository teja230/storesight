/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import DashboardPage from '../src/pages/DashboardPage';
import { AuthContext } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the fetchWithAuth helper so we can intercept network calls
jest.mock('../src/api', () => {
  const real = jest.requireActual('../src/api');
  return {
    ...real,
    fetchWithAuth: jest.fn()
  };
});

const { fetchWithAuth } = require('../src/api');

afterEach(() => {
  sessionStorage.clear();
  (fetchWithAuth as jest.Mock).mockReset();
  cleanup();
});

const unifiedPayload = {
  lastUpdated: '2030-01-01T00:00:00Z',
  revenue: { totalRevenue: 100, timeseries: [] },
  products: [],
  lowInventory: 0,
  newProducts: 0,
  conversionRate: 1.23,
  abandonedCarts: 0,
};

const renderDashboard = () =>
  render(
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        authLoading: false,
        isAuthReady: true,
        shop: 'test-shop.myshopify.com',
      }}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Unified analytics caching', () => {
  it('calls unified endpoint exactly once on first load', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(unifiedPayload), { status: 200 })
    );

    renderDashboard();
    await waitFor(() => {
      expect(fetchWithAuth).toHaveBeenCalledTimes(1);
      expect(fetchWithAuth).toHaveBeenCalledWith('/api/analytics/unified');
    });
  });

  it('reads from sessionStorage cache on re-mount (no duplicate call)', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(unifiedPayload), { status: 200 })
    );
    // First mount populates cache
    renderDashboard();
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalledTimes(1));
    cleanup();

    // Re-mount – should not trigger extra fetch
    renderDashboard();
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalledTimes(1));
  });

  it('falls back to backend/Redis after sessionStorage cleared', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(unifiedPayload), { status: 200 })
    );

    renderDashboard(); // first call
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalledTimes(1));
    cleanup();

    sessionStorage.clear(); // simulate new browser session
    renderDashboard();
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalledTimes(2));
  });

  it('displays lastUpdated timestamp from payload', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(unifiedPayload), { status: 200 })
    );
    const { findByText } = renderDashboard();
    // Simple contains-year check - UI formats timestamp via date-fns
    await findByText(/2030/);
  });
});