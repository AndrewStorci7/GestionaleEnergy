'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { useLoader } from '@main/loader/loaderProvider';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 */
const CheckCookie = () => {
  const router = useRouter();
  const { showLoader } = useLoader();

  useEffect(() => {
    try {
      showLoader(true);
      const cookieValue = Cookies.get('user-info');

      if (!cookieValue) {
        router.push('/pages/login');
      }
    } catch (error) {
      console.log('Error checking cookie: ', error);
    } finally {
      showLoader(false);
    }
  }, [router]);

  return null;
};

export default CheckCookie