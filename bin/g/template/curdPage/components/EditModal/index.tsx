import { addNotice, getNoticeDetail } from '../../services';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { file } from '@pms/console';
import { message, Modal, ModalProps } from 'antd';
import React, { useEffect } from 'react';

interface Props extends ModalProps {
  data?: any;
  visible: any;
  onSuccess: () => void;
}

const formatDataOnInit = (data) => {
  const { attachmentList = [], ...rest } = data;

  return {
    ...rest,
    attachments: attachmentList.map((item) => ({
      name: item.fileName,
      url: item.fileUrl,
      response: {
        fileUuid: item.fileUuid,
      },
      status: 'done',
    })),
  };
};

const formatDataOnSubmit = (data) => {
  const { attachments, ...rest } = data;
  return {
    ...rest,
    attachments: attachments.map((item) => item.response?.fileUuid).join(','),
  };
};

const EditModal: React.FC<Props> = ({ data, onSuccess, ...rest }) => {
  const [form] = ProForm.useForm();

  const { onCancel, visible } = rest;
  const onOk = async () => {
    const values = await form.validateFields();

    const params = formatDataOnSubmit(values);

    if (data?.noticeId) {
      // TODO: 编辑
      return;
    } else {
      // TODO: 新增
      await addNotice(params);
    }

    console.log(values);
    message.success('操作成功');
    onSuccess();
  };

  const init = async () => {
    // TODO: 详情
    const res = await getNoticeDetail({
      noticeId: data?.noticeId,
    });
    console.log('res', res);
    form.setFieldsValue(formatDataOnInit(res?.data));
  };

  useEffect(() => {
    if (!visible) return;
    if (data?.noticeId) {
      // 编辑回填
      init();
    }
  }, [visible]);

  return (
    <Modal
      onOk={onOk}
      title="编辑公告"
      afterClose={() => {
        form.resetFields();
      }}
      {...rest}
    >
      <ProForm
        form={form}
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
              file.upload({
                ...parameters,
                onUploadAfter: (...rest) => {},
              });
            },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default EditModal;
