import { Button, Descriptions, Layout } from "antd";
import { observer } from "mobx-react";
import React, { useContext, useEffect } from "react";
import { ReactElement } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { RootStoreContext } from "../../App";
import HouseStore from "./HouseStore";

const { Header, Content } = Layout;

const HouseContent = observer(({ store }: { store: HouseStore }) => {
  // todo -> maybe change look to be look more flashy
  return (
    <Content style={{ height: "80%", padding: "2%" }}>
      <Descriptions title="House info">
        <Descriptions.Item label="Name of the house">
          {store.currentHouse.name}
        </Descriptions.Item>
        <Descriptions.Item label="Region">
          {store.currentHouse.region}
        </Descriptions.Item>
        <Descriptions.Item label="Coat of Arms">
          {store.currentHouse.coatOfArms}
        </Descriptions.Item>
        <Descriptions.Item label="Words">
          {store.currentHouse.words}
        </Descriptions.Item>
        <Descriptions.Item label="Titles">
          {store.currentHouse.titles.join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="Seats">
          {store.currentHouse.seats.join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="Has died out">
          {store.currentHouse.diedOut === ""
            ? "No"
            : store.currentHouse.diedOut}
        </Descriptions.Item>
        <Descriptions.Item label="Has overlord">
          {store.currentHouse.overlord === "" ? "No" : "Yes"}
        </Descriptions.Item>
        <Descriptions.Item label="Number of Cadet Branches">
          {store.currentHouse.cadetBranches.length}
        </Descriptions.Item>
      </Descriptions>
    </Content>
  );
});

const HouseView = observer((): ReactElement => {
  const { houseStore, restService } = useContext(RootStoreContext);
  let { houseId } = useParams();
  const history = useHistory();
  houseStore.history = history;
  houseStore.restService = restService;

  useEffect(() => {
    houseStore.initPage(houseId);
  }, [houseStore, houseId]);

  return (
    <Layout style={{ backgroundColor: "white", height: "100%" }}>
      <Header style={{ color: "white", fontSize: 40 }}>
        House - {houseStore.currentHouse?.name}
      </Header>

      <div>
        <Button
          style={{ margin: 20 }}
          type="primary"
          icon="left"
          onClick={houseStore.navigateBackToList}
        >
          Back
        </Button>
      </div>
      <HouseContent store={houseStore} />
    </Layout>
  );
});

export default HouseView;
