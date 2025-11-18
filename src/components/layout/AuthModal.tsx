import React from "react";
import Overlay from "./Overlay";
import { AiOutlineClose } from "react-icons/ai";


interface AuthModalProps {
    onClose?: () => void;
    children: React.ReactNode;
}

export default function AuthModal({ onClose, children }: AuthModalProps) {
    return (
        <React.Fragment>
            <Overlay handleClose={onClose} />
            
            <div className="modal">
                <button className="modal--close" onClick={onClose}>
                    <AiOutlineClose />
                </button>

                {children}
            </div>
        </React.Fragment>
    )
}
