/**
 * Footer components
 * @returns Footer
 */
import Image from "next/image";
import packageJson from "../../../../package.json";

export default function Footer( props ) {

  const year = new Date().getFullYear();

  return (
    <div className="p-4 text-slate-500 dark:text-slate-400 rounded-xl footer fixed bottom-0 left-0 w-full dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row justify-center items-center text-xs gap-x-3">
        <Image
          src="/logoon.png"
          width={30}
          height={45}
          alt="Oppimittinetworking Logo"
        />
        <div className="font-semibold text-center sm:text-left">
          Powered by <a href="https://oppimittinetworking.com">Oppimittinetworking.com</a>
        </div>
        <div className="text-center sm:text-left">{year} @‌copyright</div>
        <div className="text-center sm:text-left">v{packageJson.version}</div>
      </div>
    </div>
  );
}