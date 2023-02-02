import React from 'react'
import ReactDOM from "react-dom/client";

import "@/styles.scss";
import { AppContextProvider } from './appContext';
import { AppConfig } from "./types";
import ChatbotIcon from './components/ChatbotIcon';
import Chatbox from './components/Chatbox';

interface userConfig extends Partial<AppConfig> {
  siteId: string;
}

export const init = (config: userConfig) => {
  sessionStorage.setItem("siteId", config.siteId);
  const root = ReactDOM.createRoot(
    document.getElementById("webchat") as HTMLElement
  );
  root.render(
    <React.StrictMode>
        <AppContextProvider config={config}>
          <Chatbox/>
          <ChatbotIcon/>
      </AppContextProvider>
    </React.StrictMode>
  );
}

// init({
//   siteId: "TzQwFtKp42nFvkeC8BkP",
//   color: "red",
//   // headerTextColor: "red",
// });

