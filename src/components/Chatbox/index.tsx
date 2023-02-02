import React, { createRef, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

import "./styles.scss";
import { useAppContext } from "@/appContext";
import Header from "../Header";
import InputBox from "../InputBox";
import moment from "moment";
import LoadingIndicator from "@/elements/LoadingIndicator";
import { Message } from "@/types";

export default function Chatbox() {

    const { isEnlarged, isLoading, messages } = useAppContext();

    const [status, setStatus] = useState<"visible" | "hidden" | "destroyed">("hidden");
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => {
        if (isEnlarged) {
            setStatus("hidden");
            timeoutRef.current = setTimeout(() => setStatus("visible"), 10);
        }
        else {
            setStatus("hidden");
            timeoutRef.current = setTimeout(() => setStatus("destroyed"), 1000);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [isEnlarged])

    const containerRef = createRef<HTMLDivElement>();
    const { height, ref: resizeRef } = useResizeDetector();
    // scroll to bottom when new message added
    useEffect(() => {
        if (isEnlarged) {
            containerRef.current?.scrollTo({ top: height });
        }
    }, [isEnlarged, containerRef, resizeRef , height]);

    if (status === "destroyed") return null;

    return (
        <div className={`webchat-window${status === "visible" ? " enlarged" : ""}`}>
            <Header/>
            <div ref={containerRef} className="webchat-chat-messages-container">
                <div ref={resizeRef}>
                    {messages.map((message, index) => {
                        const date = moment(message.timestamp).format("MMM DD, YYYY");
                        return (
                            <React.Fragment key={message.id}>
                                {(index === 0 || date !== moment(messages[index - 1].timestamp).format("MMM DD, YYYY")) &&
                                    <div className="webchat-chat-date">{date}</div>
                                }
                                <MessageBubble message={message} />
                            </React.Fragment>
                        )
                    })}
                </div>
                {isLoading && 
                    <div className={"webchat-message"}>
                        <div className="webchat-message-bubble">
                            <LoadingIndicator size={20}/>
                        </div>
                    </div>
                }
            </div>
            <InputBox/>
            <div className="webchat-footer">
                <b>This bot is powered purely by AI</b>
            </div>
        </div>
    );
}

const MessageBubble = (props: { message: Message }) => {

    const { message } = props;

    return (
        <div className={`webchat-message${message.isUser ? " is-user" : ""}`}>
            <div className="webchat-message-bubble">
                {message.text}
            </div>
            <div className="webchat-message-time">
                {moment(message.timestamp).format("h:mm a")}
            </div>
        </div>
    );
}