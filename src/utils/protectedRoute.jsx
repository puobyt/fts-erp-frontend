
import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
const ProtectedLayout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/sign-in');
    }  else {
        setLoading(false); 
      }
  }, [router]);

  if (loading) {
   
    return <CircularProgress/>;
  }
  return <>{children}</>;
};

export default ProtectedLayout;
