import { Button, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import { observer } from "mobx-react";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { RootStoreContext } from "../../App";
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

const TablePagination = observer(({ store }: { store: CharacterStore }) => {
  return (
    <div>
      <Select
        size="large"
        defaultValue="10"
        loading={store.isLoading}
        onChange={store.changePageSize}
      >
        <Option value="10">10</Option>
        <Option value="25">25</Option>
        <Option value="50">50</Option>
      </Select>

      <div>
        <Button
          onClick={() => store.changePage("first")}
          disabled={store.onFirstPage}
        >
          First page
        </Button>
        <Button
          onClick={() => store.changePage("previous")}
          disabled={store.onFirstPage}
        >
          Previous page
        </Button>
        <Button
          onClick={() => store.changePage("next")}
          disabled={store.onLastPage}
        >
          Next page
        </Button>
        <Button
          onClick={() => store.changePage("last")}
          disabled={store.onLastPage}
        >
          Last page
        </Button>
      </div>
    </div>
  );
});

const CharacterTable = observer(({ store }: { store: CharacterStore }) => {
  return (
    <div>
      <Table
        dataSource={store.displayedCharacters.slice()}
        columns={store.columns}
        loading={store.isLoading}
        pagination={{ pageSize: store.pageSize }}
      />
    </div>
  );
});

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
      <TablePagination store={characterStore} />
      <CharacterTable store={characterStore} />
    </div>
  );
});

export default CharacterView;
