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

  @observable displayedCharacters: Array<CharacterDisplay> = [];

  @observable isLoading = false;

  cultureFilter = "";

  genderFilter = "";

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

    if (this.genderFilter !== "") {
      restOptions.params.set("gender", this.genderFilter);
    }
    if (this.cultureFilter !== "") {
      restOptions.params.set("culture", this.cultureFilter);
    }

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
      this.displayedCharacters = [];
      console.log(this.characters);
      this.characters.forEach((character: Character) => {
        this.displayedCharacters.push(new CharacterDisplay(character));
      });
      console.log(this.displayedCharacters);
      this.isLoading = false;
    });
  };

  private handleInitFail = (): void => {
    runInAction(() => {
      this.isLoading = false;
      alert("Error fetching characters");
    });
  };

  @action
  filterByCulture = (input: string): void => {
    this.cultureFilter = input;
    this.initPage();
  };

  @action
  filterByGender = (input: string): void => {
    if (input === "all") {
      this.genderFilter = "";
    } else {
      this.genderFilter = input;
    }
    this.initPage();
  };
}

export default CharacterStore;
