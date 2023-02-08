import React from "react";

import "./styles.scss";

export default function LoadingIndicator({ size }: { size?: number }) {

    return (
        <div className="lds-ellipsis-container" style={{ "--size": `${size ?? 80}px` } as React.CSSProperties}>
            <div className="lds-ellipsis">
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    );
}