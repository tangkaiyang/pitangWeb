import { EditableProTable } from '@ant-design/pro-components';

export default ({
  columns,
  title,
  dataSource,
  setDataSource,
  editableKeys,
  setEditableRowKeys,
  extra,
}) => {
  return (
    // return只能返回一个标签,因此使用空标签<></>
    <>
      <EditableProTable
        headerTitle={title}
        columns={columns}
        rowKey="id"
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            extra(recordList);
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
