import React, { useState } from "react";

export default function Button(connected, setConnected, connect, disconnect) {

    if (connected) {
        setConnected(false);
        return (
            <button onClick={disconnect}>
                Disconnect to metamask!
            </button>
        );
    }
    else {
        setConnected(true);
        return (
            <button onClick={connect}>
                Connect to metamask!
            </button>
        );
    }
}