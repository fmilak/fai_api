import { isNil } from "lodash";
import RestOptions from "../model/RestOptions";

/**
 * Main service for REST requests
 */
class RestService {
  private MAIN_URL = "https://www.anapioficeandfire.com/api";

  /**
   * Main fetch method
   * @param path -> url exstension
   * @param restOptions -> additional REST options for request
   * @param callback -> function that we will use as a callback
   */
  fetch = async (
    path: string,
    restOptions: RestOptions,
    callback: Function,
    failCallback?: Function
  ): Promise<void> => {
    const url =
      this.MAIN_URL + RestService.handleUrlParams(path, restOptions.params);
    try {
      const requestInit: RequestInit = {
        method: restOptions.method,
        headers: restOptions.headers,
        body: restOptions.body,
      };

      const response = await fetch(url, requestInit);
      const responseJson = await this.handleApiResponse(response);
      this.handleApiResponseJson(responseJson, callback);
    } catch (err) {
      console.log(err);
      if (failCallback) {
        failCallback();
      }
    }
  };

  /**
   * Handles initial response from backend API
   * @param response - from API
   */
  private handleApiResponse = (response: Response): Promise<any> => {
    const stringifiedResponse = JSON.stringify(response);
    console.log(`Response -> ${stringifiedResponse}`);
    if (response.status === 404) {
      throw new Error("Server returned 404.");
    }
    if (response.status === 401) {
      throw new Error("Server returned 401.");
    }
    if (response.status >= 500 && response.status <= 600) {
      throw new Error(`Server returned ${response.status}`);
    }
    return response.json();
  };

  /**
   * Helper method for parsing API response.
   * @param responseJson -> response from API
   * @param callback -> callback function
   * @param path -> url path
   * @param restOptions -> options for rest call
   */
  private handleApiResponseJson = (
    responseJson: string,
    callback: Function
  ): void => {
    const stringifiedResponse = JSON.stringify(responseJson);
    console.log(`Response JSON -> ${stringifiedResponse}`);
    const response: any = JSON.parse(stringifiedResponse);

    callback(response);
  };

  /**
   * Adds params to base path if they exist
   * @param path -> base path
   * @param params -> map of optional parameters for rest call
   */
  private static handleUrlParams(
    path: string,
    params?: Map<string, any>
  ): string {
    if (isNil(params) || params.size === 0) {
      return path;
    }

    let newPath = path;
    newPath = newPath.concat("?");
    params.forEach((value, key) => {
      newPath = newPath
        .concat(key.toString())
        .concat("=")
        .concat(value.toString())
        .concat("&");
    });
    newPath = newPath.substring(0, newPath.length - 1);

    return newPath;
  }
}

export default RestService;
