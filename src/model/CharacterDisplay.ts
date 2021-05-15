import Character from "./Character";

class CharacterDisplay {
  character = "";
  alive = "";
  gender = "";
  culture = "";
  allegiances: Array<any> = [];
  numberOfBooks = 0;

  constructor(character: Character) {
    this.character = (
      character.name === "" ? "" : character.name.concat(",")
    ).concat(character.aliases.join(","));
    this.alive = this.getAliveAttr(character.born, character.died);
    this.gender = character.gender === "" ? "Unknown" : character.gender;
    this.culture = character.culture === "" ? "Unknown" : character.culture;
    this.allegiances = this.getAllegiancesAttr(character.allegiances);
    this.numberOfBooks = character.books.length;
  }

  private getAliveAttr = (born: string, died: string): string => {
    if (died === "") {
      return "Yes";
    }
    return "No"; // todo -> no return
  };

  private getAllegiancesAttr = (allegiances: Array<string>): Array<any> => {
    const tempArray: Array<any> = [];
    allegiances.forEach((value: string) => {
      tempArray.push(value.match(/\d/g)?.join(""));
    });

    return tempArray;
  };
}

export default CharacterDisplay;
