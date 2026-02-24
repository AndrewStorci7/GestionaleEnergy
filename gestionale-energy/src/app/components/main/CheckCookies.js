"use client";

import { useLoader } from "@/app/components/main/loader/LoaderProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 *
 */
const CheckCookie = () => {
	const router = useRouter();
	const { showLoader } = useLoader();

	useEffect(() => {
		try {
			showLoader(true);
			const cookieValue = Cookies.get("user-info");

			if (!cookieValue) {
				router.push("/pages/login");
			}
		} catch (error) {
			console.error("Error checking cookie: ", error);
		} finally {
			showLoader(false);
		}
	}, [router, showLoader]);

	return null;
};

export default CheckCookie;
