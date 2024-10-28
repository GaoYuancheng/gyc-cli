import { addNotice, getNoticeDetail } from '../../services';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
// import { file } from '@pms/console';
import { Form, FormInstance, message, Modal, ModalProps } from 'antd';
import React, { useEffect } from 'react';

const formatDataOnSubmit = (data: any) => {
  const { attachments, ...rest } = data;
  return {
    ...rest,
    attachments: (attachments || [])
      .map((item: any) => item.response?.fileUuid)
      .join(','),
  };
};

const formatDataOnInit = (data: any) => {
  const { attachmentList = [], ...rest } = data;

  return {
    ...rest,
    attachments: attachmentList.map((item: any) => ({
      name: item.fileName,
      url: item.fileUrl,
      response: {
        fileUuid: item.fileUuid,
      },
      status: 'done',
    })),
  };
};

interface Props extends ModalProps {
  data?: any;
  data1?: any;
  data2: any;
  onSuccess: () => void;
}

const EditModal: React.FC<Props> = ({
  data = {},
  onSuccess,
  ...modalProps
}) => {
  const isEdit = data?.id;
  const { open } = modalProps;
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    const params = formatDataOnSubmit(values);
    if (data?.id) {
      console.log('编辑', params);
    } else {
      // 新建
      await addNotice(params);
    }
    onSuccess();
  };

  const init = async () => {
    // TODO: 详情
    const res = await getNoticeDetail({
      id: data?.id,
    });
    form.setFieldsValue(formatDataOnInit(res?.data));
  };

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      // 编辑回填
      init();
    }
  }, [open]);

  return (
    <Modal onOk={onOk} title={isEdit ? '编辑' : '新建'} {...modalProps}>
      <ProForm
        form={form}
        autoFocus={false}
        // 默认为true 需要置为 false
        autoFocusFirstInput={false}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        submitter={false}
      >
        <ProFormText
          name="title"
          label="标题"
          fieldProps={{
            placeholder: '请输入',
            maxLength: 100,
          }}
          formItemProps={{
            rules: [{ required: true, message: '请输入标题' }],
          }}
        />

        <ProFormTextArea
          name="content"
          label="正文"
          fieldProps={{
            placeholder: '请输入',
            maxLength: 1000,
          }}
          formItemProps={{
            rules: [{ required: true, message: '请输入正文' }],
          }}
        />

        <ProFormUploadButton
          name="attachments"
          label="附件"
          listType="picture-card"
          fieldProps={{
            customRequest: (parameters) => {
              // file.upload({
              //   ...parameters,
              //   onUploadAfter: (...rest) => {},
              // });
            },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default EditModal;
