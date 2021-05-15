import { Button, Dropdown, Menu, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import { observer } from "mobx-react";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { RootStoreContext } from "../../App";
import CharacterDisplay from "../../model/CharacterDisplay";
import CharacterStore from "./CharacterStore";

const { Option } = Select;

const TableFilters = observer(({ store }: { store: CharacterStore }) => {
  return (
    <div style={{ margin: 10 }}>
      <Search
        placeholder="Enter character culture"
        onSearch={(value) => store.filterByCulture(value)}
        style={{ width: 400, height: 40 }}
        allowClear
        size="large"
        enterButton
        loading={store.isLoading}
      />
      <Select
        style={{ width: 200, marginLeft: 15 }}
        size="large"
        defaultValue="Select gender"
        loading={store.isLoading}
        onChange={store.filterByGender}
      >
        <Option value="all">All</Option>
        <Option value="male">Male</Option>
        <Option value="female">Female</Option>
        <Option value="unknown">Unknown</Option>
      </Select>
    </div>
  );
});

// todo -> maybe give whole store
const CharacterTable = observer(
  ({
    data,
    columns,
    isLoading,
  }: {
    data: Array<CharacterDisplay>;
    columns: any;
    isLoading: boolean;
  }) => {
    return <Table dataSource={data} columns={columns} loading={isLoading} />;
  }
);

const CharacterView: React.FC = observer(() => {
  const { characterStore, restService } = useContext(RootStoreContext);
  const history = useHistory();
  characterStore.history = history;
  characterStore.restService = restService;

  useEffect(() => {
    characterStore.initPage();
  }, [characterStore]);

  return (
    <div>
      <h1>Characters</h1>

      <TableFilters store={characterStore} />
      <CharacterTable
        data={characterStore.displayedCharacters.slice()}
        columns={characterStore.columns}
        isLoading={characterStore.isLoading}
      />
    </div>
  );
});

export default CharacterView;
