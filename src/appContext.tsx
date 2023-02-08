import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppConfig, Message } from "@/types";
import { getChatResponse, sendEmailReceipt } from "./api";
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
    hasCapacity: boolean,
    messages: Message[],
    config: AppConfig,
    toggleChatbox: () => void;
    setConfig: (config: AppConfig) => void;
	sendMessage: (message: string, id?: string) => void;
}

const AppContext = React.createContext<AppContextProps>({
    isEnlarged: false,
    isLoading: false,
    hasCapacity: true,
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
    const [hasCapacity, setHasCapacity] = useState(true);
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

	const addMessage = useCallback((message: Pick<Message, "text" | "isUser" | "status">) => {
        const id = randomId();
        const newMessage: Message = {
            ...message,
            id,
            timestamp: new Date().getTime(),
        }
        setMessages(messagesRef.current.concat([newMessage]));
        return id;
    }, []);

    const updateMessage = (id: string, message: Partial<Message>) => {
        let messages = messagesRef.current.slice();
        const index = messages.findIndex(x => x.id === id);
        if (index !== -1) {
            messages[index] = {
                ...messages[index],
                ...message,
            };
        }
        setMessages(messages);
    }

    const sendMessage = useCallback(async (text: string, id?: string) => {
        if (text !== "") {
            const history = messagesRef.current.map(message => {
                return { message: message.text, isUser: message.isUser }
            });

            if (id) { // resend
                updateMessage(id, { status: "sending" });    
            }
            else {
                id = addMessage({ text, isUser: true, status: "sending" });    
            }   

            setIsLoading(true);
            const chatResponse = await getChatResponse({
                message: text,
                history,
            })
            setIsLoading(false);
            if (chatResponse) {
                if (chatResponse.message) {
                    updateMessage(id, { status: "sent", timestamp: new Date().getTime() });
                    addMessage({ text: chatResponse.message, isUser: false });  
                }
                setHasCapacity(chatResponse.hasCapacity)
            }
            else {
                updateMessage(id, { status: "error" });
            }
        }
    }, [addMessage]);

    // save messages in session storage
    useEffect(() => {
        messagesRef.current = messages;
        sessionStorage.setItem("messages", JSON.stringify(messages));
    }, [messages])

    // on unload, send email receipt
    useEffect(() => {
        const unloadCallback = () => { 
            const history = messagesRef.current.map(message => {
                return { message: message.text, isUser: message.isUser }
            });
            sendEmailReceipt({ history });
        };
      
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

	return (
		<AppContext.Provider 
            value={{ 
                isEnlarged,
                isLoading,
                hasCapacity,
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
