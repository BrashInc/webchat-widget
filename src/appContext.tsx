import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppConfig, Message } from "@/types";
import { getChatResponse } from "./api";
import { randomId } from "./utils";

const DefaultConfig = {
    name: "Chatbot",
    color: "orange",
    textColor: "black",
    headerTextColor: "white",
}

interface AppContextProps {
    isEnlarged: boolean,
    isLoading: boolean,
    messages: Message[],
    config: AppConfig,
    toggleChatbox: () => void;
    setConfig: (config: AppConfig) => void;
	sendMessage: (message: string) => void;
}

const AppContext = React.createContext<AppContextProps>({
    isEnlarged: false,
    isLoading: false,
    messages: [],
    config: DefaultConfig,
    toggleChatbox() {},
    setConfig() {},
    sendMessage() {},
});

export function useAppContext() {
	return useContext(AppContext);
}

export function AppContextProvider(props: {
    config: Partial<AppConfig>;
	children: React.ReactNode;
}) {
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<AppConfig>(DefaultConfig);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesRef = useRef(messages);

    useEffect(() => {
        const savedMessages = sessionStorage.getItem("messages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [])

    useEffect(() => {
        setConfig({
            ...DefaultConfig,
            ...props.config,
        })
    }, [props.config])

    useEffect(() => {
        document.documentElement.style.setProperty('--color', config.color);
        document.documentElement.style.setProperty('--textColor', config.textColor);
        document.documentElement.style.setProperty('--headerTextColor', config.headerTextColor);
    }, [
        config.color,
        config.textColor,
        config.headerTextColor,
    ])

    const toggleChatbox = useCallback(() => {
        setIsEnlarged(!isEnlarged);
    }, [isEnlarged])

	const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
        const newMessage: Message = {
            ...message,
            id: randomId(),
            timestamp: new Date().getTime(),
        }
        setMessages(messagesRef.current.concat([newMessage]));
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (text !== "") {
            const history = messagesRef.current.map(message => {
                return { message: message.text, isUser: message.isUser }
            });

            addMessage({ text, isUser: true });    

            setIsLoading(true);
            const chatResponse = await getChatResponse({
                message: text,
                history,
            })
            setIsLoading(false);
            if (chatResponse) {
                addMessage({ text: chatResponse, isUser: false });    
            }
        }
    }, [addMessage]);

    useEffect(() => {
        messagesRef.current = messages;
        sessionStorage.setItem("messages", JSON.stringify(messages));
    }, [messages])

	return (
		<AppContext.Provider 
            value={{ 
                isEnlarged,
                isLoading,
                messages,
                config,
                toggleChatbox,
                setConfig,
                sendMessage,
            }}
        >
			{props.children}
		</AppContext.Provider>
	);
}
