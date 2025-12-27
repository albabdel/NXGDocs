import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import VoCModal from './VoCModal';
import styles from './VoCWidget.module.css';

export default function VoCWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleModal = () => setIsOpen(!isOpen);

    // Close modal when path changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <>
            <button
                className={clsx('voc-fab', isOpen && 'voc-fab--hidden')}
                onClick={toggleModal}
                aria-label="Share Feedback"
            >
                <img
                    src="/img/Xo.png"
                    alt="VoC"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <span className="voc-fab-label">Feedback</span>
            </button>

            {isOpen && (
                <VoCModal
                    onClose={() => setIsOpen(false)}
                    currentPath={location.pathname}
                />
            )}
        </>
    );
}
