import React, { useCallback } from "react";

import moment from "moment";

import { Message } from "@/types";
import { IconError } from "@/icons/iconError";
import { useAppContext } from "@/appContext";
import LoadingIndicator from "@/elements/LoadingIndicator";

const MessageBubble = (props: { message: Message }) => {

    const { message } = props;
    const { config, sendMessage } = useAppContext();

    const resend = useCallback(() => {
        sendMessage(message.text, message.id);
    }, [message.id, message.text, sendMessage]);

    return (
        <div 
            className={`webchat-message${message.isUser ? " is-user" : ""}`}
            style={message.status === "error" ? { cursor: "pointer" }: {}}
            onClick={message.status === "error" ? resend : undefined}
        >
            <div className="webchat-message-bubble">
                {message.text}
            </div>
            {/* {message.status === "sending" &&
                <LoadingIndicator size={15}/>
            } */}
            {message.status === "sent" &&
                <div className="webchat-message-time">
                    {moment(message.timestamp).format("h:mm a")}
                </div>
            }
            {message.isUser && message.status === "error" &&
                <div className="webchat-message-error">
                    <IconError size={18} color={config.color}/>
                    ERROR. TAP TO RETRY
                </div>
            }
        </div>
    );
}

export default MessageBubble;
