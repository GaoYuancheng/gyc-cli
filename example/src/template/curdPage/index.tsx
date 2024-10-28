import { useRef } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import Styles from './index.less';
import { deleteNotice, getNoticePageList } from './services';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import useModal from './components/useModal';
import EditModal from './components/EditModal';

const CurdPage = () => {
  const actionRef = useRef<ActionType>();

  const editModal = useModal(EditModal, {
    onSuccess: () => {
      message.success('操作成功');
      editModal.close();
      actionRef.current?.reload();
    },
  });

  const getList = async (params: any) => {
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
      title: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'content',
      title: 'content',
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
      width: 60,
      hideInSearch: true,
      render: (text, record) => (
        <Space>
          <a
            onClick={() => {
              editModal.open({
                data: record,
              });
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              await deleteNotice({ id: record?.id });
              message.success('操作成功');
              actionRef?.current?.reload();
            }}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
                editModal.open({});
              }}
            >
              添加
            </Button>,
          ];
        }}
        columns={columns}
      />

      {editModal.modalDom}
    </div>
  );
};

CurdPage.menuName = '示例页面';
// 1企业 2分公司 3项目
CurdPage.organizationType = [3];
CurdPage.order = 1;
// 在二级的menu菜单栏 需要显示自己, 默认是false，显示，这里只是进行示范
CurdPage.hideRenderChild = true;
// NoticeSetting.hideMenuParentComponent = true;
export default CurdPage;
