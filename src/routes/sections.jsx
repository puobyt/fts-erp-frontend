import { lazy, Suspense } from 'react'
import { Outlet, Navigate, useRoutes } from 'react-router-dom'
import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import ProtectedLayout from '../utils/protectedRoute'
import Box from '@mui/material/Box'
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'

import { varAlpha } from 'src/theme/styles'
import { AuthLayout } from 'src/layouts/auth'
import { DashboardLayout } from 'src/layouts/dashboard'
import QCParameterTable from '../sections/qcParameters/view/qcParameterTable'

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'))

export const VendorManagement = lazy(() => import('src/pages/vendorManagement'))
export const PurhcaseOrderCreation = lazy(() =>
  import('src/pages/purchaseOrderCreation')
)
export const GateEntry = lazy(() => import('src/pages/gateEntry'))
export const CurrentStock = lazy(() => import('src/pages/currentStock'))
export const MainStock = lazy(() => import('src/pages/mainStock'))
export const OutOfStock = lazy(() => import('src/pages/outOfStock'))
export const QualityCheck = lazy(() => import('src/pages/qualityCheck'))
export const ProductionOrderCreation = lazy(() =>
  import('src/pages/productionOrderCreation')
)
export const ProcessOrder = lazy(() => import('src/pages/processOrder'))
export const RequestCreationForMaterials = lazy(() =>
  import('src/pages/requestCreationForMaterials')
)
export const MaterialAssignment = lazy(() =>
  import('src/pages/materialAssignment')
)
export const BillOfMaterials = lazy(() => import('src/pages/billOfMaterials'))
export const FinalQualityInspection = lazy(() =>
  import('src/pages/finalQualityInspection')
)
export const InvoiceCreations = lazy(() => import('src/pages/invoiceCreations'))
export const FinishedGoods = lazy(() => import('src/pages/finishedGoods'))
export const ProductionOrderCreationOutput = lazy(() =>
  import('src/pages/productionOrderCreationOutput')
)
export const Rework = lazy(() => import('src/pages/rework'))
export const Tracebility = lazy(() => import('src/pages/tracebility'))
export const SignInPage = lazy(() => import('src/pages/signIn'))
export const SignUpPage = lazy(() => import('src/pages/signUp'))
export const ProductsPage = lazy(() => import('src/pages/products'))
export const Page404 = lazy(() => import('src/pages/page-not-found'))

const renderFallback = (
  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    flex='1 1 auto'
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: theme =>
          varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' }
      }}
    />
  </Box>
)

export function Router () {
  return useRoutes([
    {
      element: (
        <ProtectedLayout>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedLayout>
      ),
      children: [
        {
          element: (
            <Suspense fallback={<CircularProgress />}>
              <HomePage />
            </Suspense>
          ),
          index: true
        },
        { path: 'vendor-stock-management/vendor-management', element: <VendorManagement /> },
        { path: 'vendor-stock-management/purchase-order-creation', element: <PurhcaseOrderCreation /> },
        { path: 'vendor-stock-management/gate-entry', element: <GateEntry /> },
        { path: 'vendor-stock-management/current-stock', element: <CurrentStock /> },
        { path: 'vendor-stock-management/main-stock', element: <MainStock /> },
        { path: 'quality-control/quality-check', element: <QualityCheck /> },
        { path: 'quality-control/qcparameters', element: <QCParameterTable /> },
        { path: 'quality-control/rework', element: <Rework /> },
        {
          path: 'production-workflow/production-order-creation',
          element: <ProductionOrderCreation />
        },
        {
          path: 'production-workflow/production-order-creation-output',
          element: <ProductionOrderCreationOutput />
        },
        {
          path: 'production-workflow/request-creation-for-materials',
          element: <RequestCreationForMaterials />
        },
        { path: 'production-workflow/material-assignment', element: <MaterialAssignment /> },
        { path: 'production-workflow/bill-of-materials', element: <BillOfMaterials /> },
        {
          path: 'quality-control/final-quality-inspection',
          element: <FinalQualityInspection />
        },
        { path: 'finished-goods-invoicing/finished-goods', element: <FinishedGoods /> },
        { path: 'finished-goods-invoicing/invoice-creations', element: <InvoiceCreations /> },
        { path: 'vendor-stock-management/out-of-stock', element: <OutOfStock /> },
        { path: 'production-workflow/process-order', element: <ProcessOrder /> },
        { path: 'tracebility/tracebility', element: <Tracebility /> }
      ]
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      )
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      )
    },
    {
      path: '404',
      element: <Page404 />
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />
    }
  ])
}
