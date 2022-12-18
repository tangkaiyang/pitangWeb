// import { EditableProTable} from '@ant-design/pro-components';
// // import { EditableProTable} from '@ant-design/pro-table';
// import React, { useState } from 'react';
// export default ({ columns, dataSource, title, setDataSource }) => {
//   const [editableKeys, setEditableRowKeys] = useState(() => dataSource.map((item) => item.id));
//   return (
//     <EditableProTable
//       headerTitle={title}
//       columns={columns}
//       rowkeys="id"
//       value={dataSource}
//       onChange={setDataSource}
//       recordCreatorProps={{ newRecordType: 'dataSource', record: () => ({ id: Date.now() }) }}
//       editable={{
//         type: 'multiple',
//         editableKeys,
//         actionRender: (row, config, defaultDoms) => {
//           return [defaultDoms.delete];
//         },
//         onValueChange: (record, recordList) => {
//           setDataSource(recordList);
//         },
//         onChange: setEditableRowKeys,
//       }}
//     />
//   );
// };

import { EditableProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';
const defaultData = [
  {
    id: 624748504,
    key: '活动名称一',
    value: '活动名称一',
    description: '这个活动真好玩',
  },
  {
    id: 624691229,
    key: '活动名称二',
    value: '活动名称二',
    description: '这个活动真好玩',
  },
];
export default () => {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: 'KEY',
      dataIndex: 'key',
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            var _a;
            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null ||
            _a === void 0
              ? void 0
              : _a.call(action, record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    // return只能返回一个标签,因此使用空标签<></>
    <>
      <EditableProTable
        rowKey="id"
        headerTitle="Query Params"
        // maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        }}
        loading={false}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
