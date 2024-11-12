'use client';

import LoginPage from "@/app/pages/login/page";
import App from "next/app";

export default function Home() {

  return(
    <LoginPage />
  );
}

// export default function Home( {userType, facility, } ) {
//   return (
//     <div className="w-[95%] m-[2.5%]">
//       <Header 
//         facility={facility}
//       />
//       <MainContent 
//         type={userType}
//       />
//       <Footer />
//     </div>
//   );
// }
