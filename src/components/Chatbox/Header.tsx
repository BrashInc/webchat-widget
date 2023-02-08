import React from "react";

import { useAppContext } from "@/appContext";
import { IconClose } from "@/icons/IconClose";

export default function Header() {

    const { config, toggleChatbox } = useAppContext();

    return (
        <div className="webchat-header">
            {/* <div className="webchat-header-icon"></div> */}
            <div className="webchat-header-title">{config.name}</div>
            <button className="webchat-header-close-button" onClick={toggleChatbox}>
                <IconClose color={config.headerTextColor} />
            </button>
        </div>
    );
}