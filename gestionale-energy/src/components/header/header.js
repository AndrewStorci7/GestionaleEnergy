import Image from "next/image";

export default function Header() {

    return (
        <div className="w-[95%] h-[30px] m-[2.5%] bg-primary ">
            <div className="grid grid-cols-7 gap-4">
                {/* LOGO */}
                <div className="col-span-2">
                <Image
                    src="/logo-oe.webp"
                    width={200}
                    height={100}
                    alt="Oppimitti Energy Logo"
                />
                </div> {/* end LOGO */}
                <div className="p-[5px] bg-white ">
                    Impianto A
                </div>
                <div className="">
                    Turno 2
                </div>
                <div className="">
                    Data
                </div>
                <div className="">
                    Ora
                </div>
                <div className="">
                    Utente
                </div>
            </div>
        </div>
    );
}