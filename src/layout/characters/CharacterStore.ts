import { isNil, toNumber } from "lodash";
import { action, observable, runInAction } from "mobx";
import { Links } from "parse-link-header";
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

  @observable onFirstPage = true;

  @observable onLastPage = false;

  paginationLinks: Links = {};

  cultureFilter = "";

  genderFilter = "all";

  pageSize = 10;

  currentPage = 1;

  @action
  initPage = (): void => {
    this.isLoading = true;
    const restOptions: RestOptions = new RestOptions();
    const url = `https://www.anapioficeandfire.com/api/characters`;
    restOptions.method = "GET";
    restOptions.headers = {
      "Content-Type": "application/json",
    };

    restOptions.params.set("page", this.currentPage);
    restOptions.params.set("pageSize", this.pageSize);

    if (this.genderFilter !== "all") {
      // todo -> not sure if you can filter by undefined gender
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

  private handleInitResponse = (
    apiResponse: any,
    responseLink?: Links
  ): void => {
    if (!isNil(responseLink)) {
      this.paginationLinks = responseLink;
      if (this.paginationLinks.first.page === this.paginationLinks.last.page) {
        runInAction(() => {
          this.onFirstPage = true;
          this.onLastPage = true;
        });
      }
    }
    runInAction(() => {
      this.characters = [...apiResponse];
      this.displayedCharacters = [];
      this.characters.forEach((character: Character) => {
        this.displayedCharacters.push(new CharacterDisplay(character));
      });
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
    this.currentPage = 1;
    runInAction(() => {
      this.onFirstPage = true;
    });
    this.initPage();
  };

  @action
  filterByGender = (input: string): void => {
    if (input === "unknown") {
      this.genderFilter = "";
    } else {
      this.genderFilter = input;
    }
    this.currentPage = 1;
    runInAction(() => {
      this.onFirstPage = true;
    });
    this.initPage();
  };

  changePageSize = (input: string): void => {
    this.pageSize = toNumber(input);
    this.currentPage = 1;
    runInAction(() => {
      this.onFirstPage = true;
      this.onLastPage = false;
    });
    this.initPage();
  };

  changePage = (option: string): void => {
    let url = "";
    runInAction(() => {
      this.isLoading = true;
      switch (option) {
        case "first":
          if (!this.paginationLinks.first) {
            break; // todo -> handle this better
          }
          url = this.paginationLinks.first.url;
          this.onFirstPage = true;
          this.onLastPage = false;
          break;
        case "previous":
          if (!this.paginationLinks.prev) {
            break;
          }
          url = this.paginationLinks.prev.url;
          if (
            this.paginationLinks.prev.page === this.paginationLinks.first.page
          ) {
            this.onFirstPage = true;
          }
          this.onLastPage = false;
          break;
        case "next":
          if (!this.paginationLinks.next) {
            break;
          }
          url = this.paginationLinks.next.url;
          if (
            this.paginationLinks.next.page === this.paginationLinks.last.page
          ) {
            this.onLastPage = true;
          }
          this.onFirstPage = false;
          break;
        case "last":
          if (!this.paginationLinks.last) {
            break;
          }
          url = this.paginationLinks.last.url;
          this.onLastPage = true;
          this.onFirstPage = false;
          break;
        default:
          alert("Something went wrong during changing the page");
          break;
      }
    });

    const restOptions: RestOptions = new RestOptions();
    restOptions.method = "GET";
    restOptions.headers = {
      "Content-Type": "application/json",
    };

    if (this.genderFilter !== "all") {
      // todo -> not sure if you can filter by undefined gender
      restOptions.params.set("gender", this.genderFilter);
    }
    if (this.cultureFilter !== "") {
      restOptions.params.set("culture", this.cultureFilter);
    }

    this.restService.fetchByLink(
      url,
      restOptions,
      this.handleInitResponse,
      this.handleInitFail
    );
  };

  navigateToHouse = (value: string): void => {
    this.history.push(`/house/${value}`);
  };
}

export default CharacterStore;
