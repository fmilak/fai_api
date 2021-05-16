import { Button, Col, Layout, Row, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import { observer } from "mobx-react";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { RootStoreContext } from "../../App";
import CharacterStore from "./CharacterStore";

const { Header, Content } = Layout;
const { Option } = Select;

const TableFilters = observer(({ store }: { store: CharacterStore }) => {
  return (
    <Row style={{ margin: 10 }}>
      <Col span={4}>
        <Search
          placeholder="Enter character culture"
          onSearch={(value) => store.filterByCulture(value)}
          style={{ width: 400, height: 40 }}
          allowClear
          size="large"
          enterButton
          loading={store.isLoading}
        />
      </Col>
      <Col span={4}>
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
      </Col>
      <Col span={4} offset={11}>
        <Button
          style={{ height: 40 }}
          onClick={() => store.changePage("first")}
          disabled={store.onFirstPage}
        >
          First page
        </Button>
        <Button
          style={{ height: 40 }}
          onClick={() => store.changePage("previous")}
          disabled={store.onFirstPage}
        >
          Previous page
        </Button>
        <Button
          style={{ height: 40 }}
          onClick={() => store.changePage("next")}
          disabled={store.onLastPage}
        >
          Next page
        </Button>
        <Button
          style={{ height: 40 }}
          onClick={() => store.changePage("last")}
          disabled={store.onLastPage}
        >
          Last page
        </Button>
      </Col>

      <Col span={1}>
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
      </Col>
    </Row>
  );
});

const CharacterTable = observer(({ store }: { store: CharacterStore }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <Table
        dataSource={store.displayedCharacters.slice()}
        columns={store.columns}
        loading={store.isLoading}
        pagination={false}
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
    <Layout style={{ backgroundColor: "white", height: "100%" }}>
      <Header style={{ color: "white", fontSize: 40 }}>Characters</Header>

      <Content style={{ height: "80%", padding: "2%" }}>
        <TableFilters store={characterStore} />
        <CharacterTable store={characterStore} />
      </Content>
    </Layout>
  );
});

export default CharacterView;
