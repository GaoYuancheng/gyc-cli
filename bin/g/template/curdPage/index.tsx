import React, { useRef, useState } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import Styles from './index.less';
import { deleteNotice, getNoticePageList } from './services';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import EditModal from './components/EditModal';

const NoticeSetting = () => {
  const [editModalInfo, setEditModalInfo] = useState<{
    visible: boolean;
    data?: any;
  }>({
    visible: false,
    data: {},
  });

  const actionRef = useRef<ActionType>();

  const getList = async (params) => {
    const { current, pageSize, ...rest } = params;

    const resParams = {
      pageNum: current,
      pageSize,
      ...rest,
    };

    // TODO: 列表接口
    const res = await getNoticePageList(resParams);

    return {
      data: res?.data?.records,
      total: res?.data?.total || 0,
    };
  };

  const columns: ProColumns[] = [
    {
      dataIndex: 'no',
      title: '序号',
      valueType: 'index',
      width: 50,
      hideInSearch: true,
    },
    {
      dataIndex: 'title',
      title: '公告名称',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'content',
      title: '公告内容',
      ellipsis: true,
      width: 200,
      hideInSearch: true,
    },
    {
      dataIndex: 'gmtCreate',
      title: '创建时间',
      ellipsis: true,
      width: 140,
      hideInSearch: true,
    },
    {
      dataIndex: 'creater',
      title: '创建人',
      ellipsis: true,
      width: 80,
      hideInSearch: true,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      width: 100,
      hideInSearch: true,
      render: (text, record) => (
        <Space>
          <a
            onClick={() => {
              setEditModalInfo({
                visible: true,
                data: record,
              });
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              deleteRecord(record);
            }}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 删除数据
  const deleteRecord = async (record) => {
    await deleteNotice({ noticeId: record?.noticeId });
    message.success('操作成功');
    actionRef?.current?.reload();
  };

  return (
    <div className={Styles.NoticeSetting}>
      <ProTable
        rowKey="id"
        request={getList}
        pagination={{
          defaultPageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
        size="large"
        actionRef={actionRef}
        toolbar={{
          settings: [],
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setEditModalInfo({
                  visible: true,
                });
              }}
            >
              添加
            </Button>,
          ];
        }}
        columns={columns}
      />

      <EditModal
        {...editModalInfo}
        onCancel={() => {
          setEditModalInfo({
            visible: false,
          });
        }}
        onSuccess={() => {
          setEditModalInfo({
            visible: false,
          });
          actionRef.current?.reload();
        }}
      ></EditModal>
    </div>
  );
};

NoticeSetting.menuName = '公告设置';
NoticeSetting.order = 1;
// 在二级的menu菜单栏 需要显示自己, 默认是false，显示，这里只是进行示范
NoticeSetting.hideRenderChild = true;
// NoticeSetting.hideMenuParentComponent = true;
export default NoticeSetting;
