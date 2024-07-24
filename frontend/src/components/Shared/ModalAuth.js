import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './modalAuth.scss';

const ModalAuth = ({ onClose, show, children }) => {
    const containerRef = useRef(null);

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);

    return ReactDOM.createPortal(
        <CSSTransition
            in={show}
            timeout={300}
            classNames="fade"
            unmountOnExit
        >
            <div className="modalAuth">
                <div className={`container-auth ${show ? 'container-authClick' : ''}`} ref={containerRef} onClick={e => e.stopPropagation()}>
                    <div className="close" onClick={onClose}>X</div>
                    {children}
                </div>
            </div>
        </CSSTransition>,
        document.getElementById('modalAuth')
    );
};

export default ModalAuth;
