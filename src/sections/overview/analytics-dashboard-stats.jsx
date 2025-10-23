import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Alert } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { dashboardService } from 'src/services/dashboardService';
import { fNumber } from 'src/utils/format-number';

// Certificate Expiring Component
export function CertificatesExpiringCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await dashboardService.getCertificatesExpiring();
        setCertificates(data);
      } catch (err) {
        setError('Failed to fetch certificates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading certificates...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Iconify icon="mdi:certificate" width={24} sx={{ mr: 1 }} />
          <Typography variant="h6">Certificates Expiring</Typography>
        </Box>
        
        {certificates.length === 0 ? (
          <Typography color="text.secondary">No certificates expiring</Typography>
        ) : (
          <Box>
            {certificates.map((cert, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">{cert.certificateName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                </Typography>
                <Chip 
                  size="small" 
                  label={cert.expiryDate <= 30 ? 'Expiring Soon' : 'Valid'} 
                  color={cert.expiryDate <= 30 ? 'warning' : 'success'}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Stock Count Component
export function StockCountCard({ title, icon, color, count, loading, error }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Iconify icon={icon} width={24} sx={{ mr: 1, color: `${color}.main` }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography variant="h3" color={`${color}.main`}>
            {fNumber(count)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// Main Dashboard Stats Component
export function DashboardStats() {
  const [mainStockCount, setMainStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [finishedGoodsCount, setFinishedGoodsCount] = useState(0);
  const [loading, setLoading] = useState({
    mainStock: true,
    outOfStock: true,
    finishedGoods: true
  });
  const [errors, setErrors] = useState({
    mainStock: null,
    outOfStock: null,
    finishedGoods: null
  });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

useEffect(() => {
  const fetchCounts = async () => {
    try {
      await delay(500); // Delay before starting
      
      const [mainStockData, outOfStockData, finishedGoodsData] = await Promise.all([
        dashboardService.getMainStockCount(),
        dashboardService.getOutOfStockCount(),
        dashboardService.getFinishedGoodsCount()
      ]);

      setMainStockCount(mainStockData.count);
      setOutOfStockCount(outOfStockData.count);
      setFinishedGoodsCount(finishedGoodsData.count);
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        mainStock: err.message || 'Failed to fetch main stock count',
        outOfStock: err.message || 'Failed to fetch out of stock count',
        finishedGoods: err.message || 'Failed to fetch finished goods count'
      }));
    } finally {
      setLoading(prev => ({ ...prev, mainStock: false, outOfStock: false, finishedGoods: false }));
    }
  };

  fetchCounts();
}, []);


  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StockCountCard
          title="Main Stock"
          icon="mdi:package-variant"
          color="primary"
          count={mainStockCount}
          loading={loading.mainStock}
          error={errors.mainStock}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <StockCountCard
          title="Out of Stock"
          icon="mdi:package-variant-remove"
          color="error"
          count={outOfStockCount}
          loading={loading.outOfStock}
          error={errors.outOfStock}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <StockCountCard
          title="Finished Goods"
          icon="mdi:package-check"
          color="success"
          count={finishedGoodsCount}
          loading={loading.finishedGoods}
          error={errors.finishedGoods}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <CertificatesExpiringCard />
      </Grid>
    </Grid>
  );
}
