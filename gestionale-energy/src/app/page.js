'use client';

import React from "react";
import LoginPage from "@/app/pages/login/page";
import { WebSocketProvider } from '@main/ws/use-web-socket';
import { LoaderProvider } from "@main/loader/loaderProvider";
// import { AlertProvider } from "@/app/components/main/alert/alertProvider";

/**
 * Main Component for the APP
 *  
 * @returns 
 */
export default function Home() {

	return (
		<WebSocketProvider user={{ user: 'none', name: 'none', surname: 'none' }}>
			<LoaderProvider>
				<LoginPage />
			</LoaderProvider>
		</WebSocketProvider>
	);
}
