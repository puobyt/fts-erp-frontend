import axiosInstance from '../configs/axiosInstance';
import { mockDashboardData } from '../_mock/dashboardData';

// Dashboard API endpoints
export const dashboardService = {
  // Get certificates expiring
  getCertificatesExpiring: async () => {
    try {
      // For development, return mock data
      // In production, uncomment the axios call below
      // return mockDashboardData.certificatesExpiring;
      
      const response = await axiosInstance.get('/dashboard/certificates-expiring');
      console.log('Certificates expiring response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching certificates expiring:', error);
      throw error;
    }
  },

  // Get main stock count
  getMainStockCount: async () => {
    try {
      // For development, return mock data
      // In production, uncomment the axios call below
      // return mockDashboardData.mainStockCount;
      
      const response = await axiosInstance.get('/dashboard/main-stock-count');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching main stock count:', error);
      throw error;
    }
  },

  // Get out of stock count
  getOutOfStockCount: async () => {
    try {
      // For development, return mock data
      // In production, uncomment the axios call below
      // return mockDashboardData.outOfStockCount;
      
      const response = await axiosInstance.get('/dashboard/out-of-stock-count');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching out of stock count:', error);
      throw error;
    }
  },

  // Get finished goods count
  getFinishedGoodsCount: async () => {
    try {
      // For development, return mock data
      // In production, uncomment the axios call below
      // return mockDashboardData.finishedGoodsCount;
      
      const response = await axiosInstance.get('/dashboard/finished-goods-count');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching finished goods count:', error);
      throw error;
    }
  }
};
