
import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks'
const ProtectedLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/sign-in');
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedLayout;
