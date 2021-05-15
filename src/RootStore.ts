import CharacterStore from "./layout/characters/CharacterStore";
import HouseStore from "./layout/houses/HouseStore";
import RestService from "./service/RestService";

class RootStore {
  houseStore: HouseStore;

  characterStore: CharacterStore;

  restService: RestService;

  constructor() {
    this.houseStore = new HouseStore();
    this.characterStore = new CharacterStore();
    this.restService = new RestService();
  }
}

export default RootStore;
