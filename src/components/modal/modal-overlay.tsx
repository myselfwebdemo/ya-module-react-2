import type React from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => (
  <div className={styles.overlay} onClick={onClose} />
);

export default ModalOverlay;
