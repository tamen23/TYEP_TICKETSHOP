import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { IoMdClose } from "react-icons/io";

const OrganisateurModal = ({ show, children, onClose }) => {
    return ReactDOM.createPortal(
        <CSSTransition
            in={show}
            timeout={300}
            mountOnEnter
            unmountOnExit
            classNames="modal"
        >
            <div className={`modalAuth container-authOpen`}>
                <div className={`container-auth ${show ? 'container-authOpen' : ''}`}>
                    <IoMdClose className="close-btnA" onClick={onClose} />
                    {children}
                </div>
            </div>
        </CSSTransition>,
        document.getElementById('modalOrg')
    );
};

export default OrganisateurModal;
