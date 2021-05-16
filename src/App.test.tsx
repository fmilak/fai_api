import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import CharacterStore from "./layout/characters/CharacterStore";
import RestService from "./service/RestService";
import { toNumber } from "lodash";
import Character from "./model/Character";
import CharacterDisplay from "./model/CharacterDisplay";

// todo -> do more tests and group tests in files to test folder

test("renders Characters text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Characters/i);
  expect(linkElement).toBeInTheDocument();
});

test("character store page size change", () => {
  const characterStore = new CharacterStore();
  characterStore.restService = new RestService();
  const pageSize = "25";
  characterStore.changePageSize(pageSize);
  expect(characterStore.pageSize).toBe(toNumber(pageSize));
});

test("CharacterDisplay object creation", () => {
  const character: Character = new Character();
  character.name = "name";
  character.aliases = ["first", "second"];
  character.gender = "gender";
  character.born = "100";
  character.died = "200";
  character.allegiances = ["ally 1", "ally 2"];
  character.books = ["1", "2"];

  const characterDisplay: CharacterDisplay = new CharacterDisplay(character);
  expect(characterDisplay.character).toEqual("name,first,second");
  expect(characterDisplay.gender).toEqual("gender");
  expect(characterDisplay.alive).toEqual("No, died at 100 years old");
  expect(characterDisplay.culture).toEqual("Unknown");
  expect(characterDisplay.allegiances).toStrictEqual(["1", "2"]);
  expect(characterDisplay.numberOfBooks).toEqual(2);
});
