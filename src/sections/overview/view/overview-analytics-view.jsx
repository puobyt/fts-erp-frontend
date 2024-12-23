import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { _tasks, _timeline } from 'src/_mock'
import { DashboardContent } from 'src/layouts/dashboard'

import { AnalyticsNews } from '../analytics-news'
import { AnalyticsTasks } from '../analytics-tasks'
import { AnalyticsCurrentVisits } from '../analytics-current-visits'
import { AnalyticsOrderTimeline } from '../analytics-order-timeline'
import { AnalyticsWebsiteVisits } from '../analytics-website-visits'
import { AnalyticsWidgetSummary } from '../analytics-widget-summary'
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site'
import { AnalyticsCurrentSubject } from '../analytics-current-subject'
import { AnalyticsConversionRates } from '../analytics-conversion-rates'
import FlippableCard from '../../../components/cards/flipCard'

// ----------------------------------------------------------------------

export function OverviewAnalyticsView () {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const materialLinks = [
    {
      label: 'Vendor Management',
      route: '/vendor-stock-management/vendor-management'
    },
    {
      label: 'Purchase Order Creation',
      route: '/vendor-stock-management/purchase-order-creation'
    },
    { label: 'Gate Entry', route: '/vendor-stock-management/gate-entry' },
    {
      label: 'Inward Current Stock',
      route: '/vendor-stock-management/current-stock'
    },
    { label: 'Main Stock', route: '/vendor-stock-management/main-stock' },
    { label: 'Out Of Stock', route: '/vendor-stock-management/out-of-stock' }
  ]

  const qualityLinks = [
    { label: 'Inward quality Check', route: '/quality-control/quality-check' },
    { label: 'Rework', route: '/quality-control/rework' },
    {
      label: 'Final Quality Inspection',
      route: '/quality-control/final-quality-inspection'
    }
  ]

  const productionLinks = [
    { label: 'Process Order', route: '/production-workflow/process-order' },
    {
      label: 'Production Order Creation',
      route: '/production-workflow/production-order-creation'
    },
    {
      label: 'Request Creation For Materials',
      route: '/production-workflow/request-creation-for-materials'
    },
    {
      label: 'Material Assignment',
      route: '/production-workflow/material-assignment'
    },
    {
      label: 'Production Order Creation Output',
      route: '/production-workflow/production-order-creation-output'
    },
    {
      label: 'Bill Of Materials',
      route: '/production-workflow/bill-of-materials'
    }
  ]

  const finishedGoodsLinks = [
    {
      label: 'Finished Goods Management',
      route: '/finished-goods-invoicing/finished-goods'
    },
    {
      label: 'Invoice Creations',
      route: '/finished-goods-invoicing/invoice-creations'
    }
  ]

  return (
    <DashboardContent maxWidth='xl'>
      <Typography variant='h4' sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          color='warning'
          chart={{
            categories: []
          }}
          title={
            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Title */}
              <Typography
                variant='h4'
                sx={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  padding: '28px'
                }}
              >
                Hello, {adminData.userName}
              </Typography>

              {/* Image (Positioned Absolutely) */}
              <Box
                component='img'
                src='/assets/icons/glass/pngwing.com.png' // Replace with your image URL or path
                alt='Icon'
                sx={{
                  position: 'absolute', // Positioned relative to the box
                  top: '-125px', // Align to the top
                  right: 0, // Align to the right
                  height: '250px', // Increase image height
                  width: '250px', // Increase image width
                  objectFit: 'cover'
                }}
              />
            </Box>
          }
        />
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: '20px' }}>
        <Grid
          item // Make sure it's treated as an item inside the grid container
          xs={12}
          sm={6}
          md={3}
          sx={{ height: '300px' }} // Set desired height for the Grid
        >
          <FlippableCard
            title={'Raw Materials'}
            img={'/assets/icons/glass/composite.png'}
            links={materialLinks}
          />
        </Grid>

        <Grid
          item // Make sure it's treated as an item inside the grid container
          xs={12}
          sm={6}
          md={3}
          sx={{ height: '300px' }} // Set desired height for the Grid
        >
          <FlippableCard
            colour={'secondary'}
            title={'Quality Control'}
            img={'/assets/icons/glass/quality-control.png'}
            links={qualityLinks}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ height: '300px' }}>
          <FlippableCard
            colour={'warning'}
            title={'Production'}
            img={'/assets/icons/glass/production.png'}
            links={productionLinks}
          />
        </Grid>

        <Grid
          item // Make sure it's treated as an item inside the grid container
          xs={12}
          sm={6}
          md={3}
          sx={{ height: '300px' }} // Set desired height for the Grid
        >
          <FlippableCard
            colour={'error'}
            title={'Finished Goods'}
            img={'/assets/icons/glass/goods.png'}
            links={finishedGoodsLinks}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  )
}
