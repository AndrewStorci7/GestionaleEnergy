/**
 * Footer components
 * @returns Footer
 */
import Image from "next/image";

export default function Footer( props ) {
    return (
      <div className="p-4 text-slate-500 dark:text-slate-400 rounded-xl mt-12 footer fixed bottom-0 left-0 w-full  dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start mt-6 text-xs">
          <div className="col-span-2 p-[5px] flex justify-center items-center">
            <Image
              src="/logoon.png"
              width={30}
              height={45}
              alt="Oppimittinetworking Logo"
            />
          </div>
          <div className="pt-3 pl-3 mb-2 font-semibold text-center sm:text-left">
            Powered by <a href="https://oppimittinetworking.com">Oppimittinetworking.com</a>
          </div>
          <div className="pt-3 pl-3 mb-2 text-center sm:text-left">
            2025 @‌copyright
          </div>
        </div>
      </div>
    );
}