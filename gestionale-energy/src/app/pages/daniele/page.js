import React from 'react';
import ErrorAlert from './error-alert';
import CheckCookie from '../../components/main/check-cookie'; 

export default function Page() { 
  console.log("Hey");

  return (
    <div>
      <CheckCookie />  
    </div>
  );
}


