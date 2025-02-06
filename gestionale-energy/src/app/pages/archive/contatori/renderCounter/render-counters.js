import React, { useEffect } from 'react'

import { WebSocketProvider, useWebSocket } from "@/app/components/main/ws/use-web-socket";

export default function RenderCounters({ handler }) {

    const { ws, message } = useWebSocket();

    useEffect(() => {
        console.log('reloading')
        handler();
    }, [message])

    return (
        <></>
    )
}
