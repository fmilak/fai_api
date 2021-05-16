import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import CharacterView from "./layout/characters/CharacterView";
import HouseView from "./layout/houses/HouseView";

const customHistory = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={customHistory}>
      <div>
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
    </Router>
  );
};

export default AppRouter;
