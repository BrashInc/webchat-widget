import React, { useCallback, useState, KeyboardEvent } from "react";

import { useAppContext } from "@/appContext";
import { IconSend } from "@/icons/iconSend";

export default function InputBox() {

    const { config, sendMessage } = useAppContext();
    const [text, setText] = useState("");

    const send = useCallback(() => {
        setText("");
        sendMessage(text);
    }, [sendMessage, text]);

    const onKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            send();
          }
    }, [send])

    return (
        <div className="webchat-input">
            <textarea 
                placeholder="Write a message"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={onKeyDown}
            />
            <button onClick={send}>
                <IconSend color={config.color} />
            </button>
        </div>
    );
}