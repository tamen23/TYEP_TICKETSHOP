import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './modalAuth.scss';
import { IoMdClose } from "react-icons/io";

const OrganisateurModal = ({ onClose, show, children }) => {
    return ReactDOM.createPortal(
        <CSSTransition
            in={show}
            timeout={300}
            mountOnEnter
            unmountOnExit
            classNames="modal"
        >
            <div className="modalAuth">
                <div className="container-auth">
                    <IoMdClose className="close-btnA" onClick={onClose}/>
                    {children}
                </div>
            </div>
        </CSSTransition>,
        document.getElementById('modalOrg')
    );
};

export default OrganisateurModal;
