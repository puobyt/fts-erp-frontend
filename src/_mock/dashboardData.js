// Mock data for dashboard endpoints
export const mockDashboardData = {
  certificatesExpiring: [
    {
      id: 1,
      name: 'ISO 9001:2015 Quality Management',
      expiry: '2024-03-15',
      daysUntilExpiry: 15,
      status: 'expiring_soon'
    },
    {
      id: 2,
      name: 'ISO 14001:2015 Environmental Management',
      expiry: '2024-06-20',
      daysUntilExpiry: 92,
      status: 'valid'
    },
    {
      id: 3,
      name: 'OHSAS 18001:2007 Occupational Health',
      expiry: '2024-02-28',
      daysUntilExpiry: 5,
      status: 'expiring_soon'
    }
  ],
  
  mainStockCount: {
    count: 1250,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  
  outOfStockCount: {
    count: 23,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  
  finishedGoodsCount: {
    count: 456,
    lastUpdated: '2024-01-15T10:30:00Z'
  }
};
