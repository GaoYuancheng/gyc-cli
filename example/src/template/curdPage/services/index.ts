// import { request } from "@pms/console";

import request from 'umi-request';

const server = {
  gddnNotice: '/gddn-notice/api',
};

const listMockRes = {
  success: true,
  data: {
    records: [
      {
        id: 1,
        title: '1',
        content: '1',
        attachments: 'b1c400a4-a143-8a94-a944-21151bef235c',
        attachmentList: null,
        createId: '8a748b7986a52be60186a63e6258000a',
        gmtCreate: '2024-08-06 09:59:36',
        creater: '牛马',
      },
      {
        id: 2,
        title: '2',
        content: '2',
        attachments: 'b1c400a1-e696-8a94-a944-20e93f704e0f',
        attachmentList: null,
        createId: '8a748b7986a52be60186a63e6258000a',
        gmtCreate: '2024-08-06 09:49:32',
        creater: '牛马张',
      },
      {
        id: 3,
        title: '3',
        content: '3',
        attachments: 'b1c400a0-bc5b-8a94-a944-20cd7acb8f02',
        attachmentList: null,
        createId: '8a748b7986a52be60186a63e6258000a',
        gmtCreate: '2024-08-06 09:45:19',
        creater: '牛马应',
      },
      {
        id: 4,
        title: '4',
        content: '4',
        attachments: 'b1c400a0-9aa0-8a94-a944-20ca7cfcfcee',
        attachmentList: null,
        createId: '8a748b7986a52be60186a63e6258000a',
        gmtCreate: '2024-08-06 09:44:46',
        creater: '牛马高',
      },
    ],
    total: 4,
    size: 10,
    current: 1,
    orders: [],
    hitCount: false,
    searchCount: true,
    pages: 1,
  },
};

const detailMockRes = {
  success: true,
  data: {
    id: 20,
    title: '11',
    content: '111',
    attachments: 'b1c400a4-a143-8a94-a944-21151bef235c',

    createId: '8a748b7986a52be60186a63e6258000a',
    gmtCreate: '2024-08-06 09:59:36',
    creater: '测试鑫',
  },
};

const getDetailData = (id: any) => {
  return {
    data: {
      ...listMockRes.data.records.find((item) => item.id === id),
      attachmentList: [
        {
          fileName: '图纸素材.zip',
          fileUuid: 'b1c400a4-a143-8a94-a944-21151bef235c',
          fileUrl:
            'https://sz.zt24j.com:30010/zt24-test-file/b1c400a4-a143-8a94-a944-21151bef235c.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=LTAI5tEprhV2ADpKRTCVgZEy%2F20240809%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240809T053834Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=107e422354585ade418c2881bc03cf26263cab6f6edef6185cde872beba9208b',
        },
      ],
    },
  };
};

// 新增
export async function addNotice<T>(data: any = {}) {
  return;
  return request<any>(`${server.gddnNotice}/gddnNotice/create`, {
    method: 'POST',
    data,
  });
}

// 列表查询
export async function getNoticePageList(data: any = {}) {
  return listMockRes;
  return request<any>(`${server.gddnNotice}/gddnNotice/pageList`, {
    method: 'POST',
    data,
  });
}

// 删除
export async function deleteNotice(data: any = {}) {
  const { id } = data;
  return;
  return request<any>(`${server.gddnNotice}/gddnNotice/remove/${id}`, {
    method: 'GET',
    data,
  });
}

// 详情
export async function getNoticeDetail(data: any = {}) {
  const { id } = data;
  return getDetailData(id);
  return request<any>(`${server.gddnNotice}/gddnNotice/detail/${id}`, {
    method: 'GET',
    data,
  });
}
