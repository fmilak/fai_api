import { Table } from "antd";
import { observer } from "mobx-react";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { RootStoreContext } from "../../App";
import CharacterDisplay from "../../model/CharacterDisplay";

const CharacterTable = observer(
  ({ data, columns }: { data: Array<CharacterDisplay>; columns: any }) => {
    return <Table dataSource={data} columns={columns} />;
  }
);

const CharacterView: React.FC = observer(() => {
  const { characterStore, restService } = useContext(RootStoreContext);
  const history = useHistory();
  characterStore.history = history;
  characterStore.restService = restService;

  useEffect(() => {
    characterStore.initPage();
  }, []);

  return (
    <div>
      <h1>Characters</h1>

      <CharacterTable
        data={characterStore.diplayedCharacters.slice()}
        columns={characterStore.columns}
      />
    </div>
  );
});

export default CharacterView;
