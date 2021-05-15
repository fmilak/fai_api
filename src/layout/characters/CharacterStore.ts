import { toUpper } from "lodash";
import { action, observable, runInAction } from "mobx";
import Character from "../../model/Character";
import CharacterDisplay from "../../model/CharacterDisplay";
import RestOptions from "../../model/RestOptions";
import RestService from "../../service/RestService";

class CharacterStore {
  history!: any;

  restService!: RestService;

  characters: Array<Character> = [];

  @observable diplayedCharacters: Array<CharacterDisplay> = [];

  @observable isLoading = false;

  columns = [
    {
      title: "Character",
      dataIndex: "character",
      key: "character",
    },
    {
      title: "Alive",
      dataIndex: "alive",
      key: "alive",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Culture",
      dataIndex: "culture",
      key: "culture",
    },
    {
      title: "Allegiances",
      dataIndex: "allegiances",
      key: "allegiances",
    },
    {
      title: "# of books",
      dataIndex: "numberOfBooks",
      key: "numberOfBooks",
    },
  ];

  @action
  initPage = (): void => {
    this.isLoading = true;
    const restOptions: RestOptions = new RestOptions();
    const url = `/characters`;
    restOptions.method = "GET";
    restOptions.headers = {
      "Content-Type": "application/json",
    };
    this.restService.fetch(
      url,
      restOptions,
      this.handleInitResponse,
      this.handleInitFail
    );
  };

  private handleInitResponse = (apiResponse: any): void => {
    runInAction(() => {
      this.characters = [...apiResponse];
      console.log(this.characters);
      this.characters.forEach((character: Character) => {
        this.diplayedCharacters.push(new CharacterDisplay(character));
      });
      console.log(this.diplayedCharacters);
      this.isLoading = false;
    });
  };

  private handleInitFail = (): void => {
    runInAction(() => {
      this.isLoading = false;
      alert("Error fetching characters");
    });
  };
}

export default CharacterStore;
