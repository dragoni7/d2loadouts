import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthReturn } from '../../features/auth/components/AuthReturn';

/**
 * Bungie OAuth redirects here
 */
export const ReturnRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (await handleAuthReturn()) {
        // exit component if successful
        navigate('/');
      }
    };

    init().catch(console.error);
  }, []);

  return false;
};
