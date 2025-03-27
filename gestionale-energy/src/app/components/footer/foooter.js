/**
 * Footer components
 * @returns Footer
 */
import Image from "next/image";

export default function Footer( props ) {
    return (
        <div className="absolute end-[0] bottom-[0] w-screen h-[50px] h-[20px] bg-primaryON justify-center">
            <div className="flex justify-center">
                <div className="col-span-2 p-[5px] ">
                    <Image
                            src="/logoon.png"
                            width={80}
                            height={100}
                            alt="Oppimittinetworking Logo"
                        />
                </div> 
                <div className="pt-3 pl-3 font-semibold">
                Powered by <a href="https://oppimittinetworking.com">Oppimittinetworking.com</a> 
                </div>
                <div className="pt-3 pl-3">
                2025 @‌copyright
                </div>
            </div>
            
            
        </div>
    );
}