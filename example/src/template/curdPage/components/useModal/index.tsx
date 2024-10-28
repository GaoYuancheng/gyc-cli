import { Modal, ModalProps } from 'antd';
import React, { useRef, useState } from 'react';

// type Open = (params?: ModalOptions & Record<string, any>) => void;

//  type ModalOptions = ModalProps & Record<string, any>;

//  type UseModalReturn = {
//   open: Open;
//   close: () => void;
//   modalDom: React.ReactNode;
//   modalOptions: ModalOptions;
// };

//  type UseModal = (
//   ModalComponent: React.ElementType<ModalOptions>,
//   modalOptions?: ModalOptions,
// ) => UseModalReturn;

const useModal = <P extends React.ElementType>(
  ModalComponent: P,
  modalProps: Partial<ModalProps & React.ComponentProps<P>> = {},
) => {
  type ModalOptions = Partial<ModalProps & React.ComponentProps<P>>;

  type UseModalReturn = {
    open: (params: ModalOptions) => void;
    close: () => void;
    modalDom: React.ReactNode;
    modalOptions: ModalOptions;
  };

  // 默认配置
  const defaultModalOptions: ModalProps = {
    open: false,
    onCancel: () => {
      close();
    },
    ...modalProps,
  };

  const [modalOptions, setModalOptions] =
    useState<ModalProps>(defaultModalOptions);

  const initialModalOptionsRef = useRef(defaultModalOptions);

  const close = () => {
    setModalOptions({
      ...modalOptions,
      open: false,
    });
  };
  const modalDom = React.createElement(ModalComponent, modalOptions);

  const open: UseModalReturn['open'] = ({ ...rest }) => {
    setModalOptions({
      ...initialModalOptionsRef.current,
      ...rest,
      open: true,
    });
  };

  return {
    modalDom,
    open,
    close,
    modalOptions,
  } as UseModalReturn;
};

export default useModal;
