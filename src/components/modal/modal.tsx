import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from './modal-overlay';

import type React from 'react';

import styles from './modal.module.css';

type TModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const modalRoot =
  typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

export const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return (): void => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const modalContent = (
    <div className={styles.modal_wrapper}>
      <ModalOverlay onClose={onClose} />
      <section className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h2 className={`text text_type_main-large ${styles.title}`}>{title}</h2>
          <button
            type="button"
            className={styles.close_button}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </div>
  );

  return createPortal(modalContent, modalRoot ?? document.body);
};

export default Modal;
