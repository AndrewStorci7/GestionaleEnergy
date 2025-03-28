/**
 * Footer components
 * @returns Footer
 */
import Image from "next/image";

export default function Footer( props ) {
    return (
<div className="on-fix-index p-4 text-slate-500 dark:text-slate-400 rounded-xl mt-12 footer fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800">
  <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start mt-6">
    <div className="col-span-2 p-[5px] mb-4 sm:mb-0 sm:mr-4">
      <Image
        src="/logoon.png"
        width={60}
        height={90}
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