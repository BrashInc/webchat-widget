import React from 'react'
import "./styles.scss";
import { useAppContext } from "@/appContext";
import { IconChat } from "@/icons/IconChat";

export default function ChatbotIcon() {

    const { isEnlarged, toggleChatbox } = useAppContext();

    return (
        <button className={`webchat-icon${isEnlarged ? " hidden" : ""}`} onClick={toggleChatbox}>
            <IconChat size={35} />
        </button>
    );
}