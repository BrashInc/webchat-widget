import React from "react";

import "./styles.scss";
import { useAppContext } from "@/appContext";

export default function LoadingIndicator({ size }: { size?: number }) {

    const { config } = useAppContext();

    return (
        <div className="lds-ellipsis-container" style={{ "--size": `${size ?? 80}px`, "--color": config.textColor } as React.CSSProperties}>
            <div className="lds-ellipsis">
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    );
}