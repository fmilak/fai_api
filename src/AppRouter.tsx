import { Layout } from "antd";
import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import CharacterView from "./layout/characters/CharacterView";
import HouseView from "./layout/houses/HouseView";

const { Content } = Layout;

const customHistory = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={customHistory}>
      <div>
        <Layout
          className="layout"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {/* <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[
                customHistory.location.key ? customHistory.location.key : "1",
              ]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="1" onClick={() => customHistory.push("/")}>
                <Icon type="home" />
                Home
              </Menu.Item>
              <Menu.Item key="2" onClick={() => customHistory.push(`/login`)}>
                <Icon type="user" />
                Login
              </Menu.Item>
            </Menu>
          </Header> */}
          <Content style={{ padding: "0 50px" }}>
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              <Switch>
                <Route path="/house/:houseId">
                  <HouseView />
                </Route>
                <Route path="/">
                  <CharacterView />
                </Route>
                <Route path="*">
                  <div>
                    <span>404</span>
                  </div>
                </Route>
              </Switch>
            </div>
          </Content>
        </Layout>
      </div>
    </Router>
  );
};

export default AppRouter;
