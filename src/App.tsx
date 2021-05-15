import React from "react";
import "./App.css";
import { configure } from "mobx";
import RootStore from "./RootStore";
import AppRouter from "./AppRouter";
import "antd/dist/antd.css";

configure({ enforceActions: "always" });

export const RootStoreContext = React.createContext(new RootStore());

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
