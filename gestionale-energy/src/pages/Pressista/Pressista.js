import Footer from "@/components/footer/foooter";
import Header from "@/components/header/header";
import MainContent from "@/components/main/main-content";

export default function Pressista() {

    return(
        <div className="w-[95%] m-[2.5%]">
            <Header 
                facility={facility}
            />
            <MainContent 
                type={userType}
            />
            <Footer />
        </div>
    );
}