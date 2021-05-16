import { action, observable, runInAction } from "mobx";
import House from "../../model/House";
import RestOptions from "../../model/RestOptions";
import RestService from "../../service/RestService";

class HouseStore {
  history!: any;

  restService!: RestService;

  houseId = "";

  @observable currentHouse: House = new House();

  @action
  initPage = (houseId: string): void => {
    this.houseId = houseId;
    const restOptions: RestOptions = new RestOptions();
    const url = `https://www.anapioficeandfire.com/api/houses/${houseId}`;
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
      this.currentHouse = { ...apiResponse };
    });
  };

  private handleInitFail = (): void => {
    console.log("fail");
  };

  @action
  navigateBackToList = (): void => {
    this.currentHouse = new House();
    this.houseId = "";
    this.history.goBack();
  };
}

export default HouseStore;
