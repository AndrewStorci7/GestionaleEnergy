import Image from "next/image";
import Footer from "@/components/footer/foooter";
import Header from "@/components/header/header";
import MainContent from "@/components/main/main-content";
import LoginPage from "@/pages/Login/Login";

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
