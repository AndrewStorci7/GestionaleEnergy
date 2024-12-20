'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * 
 * @returns 
 */

const CheckCookie = () => {
  const router = useRouter();

  useEffect(() => {
    const cookieValue = Cookies.get('user-info');
    console.log('Checking cookie: ', cookieValue);

    if (!cookieValue) {
      router.push('/pages/login');
      console.log('Redirecting to login...');
    }
  }, [router]);

  return null;
};
 export default CheckCookie



