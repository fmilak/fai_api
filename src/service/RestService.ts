import { isNil } from "lodash";
import RestOptions from "../model/RestOptions";
import parse, { Links } from "parse-link-header";

/**
 * Main service for REST requests
 */
class RestService {
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
    const url = RestService.handleUrlParams(path, restOptions.params);
    try {
      const requestInit: RequestInit = {
        method: restOptions.method,
        headers: restOptions.headers,
        body: restOptions.body,
      };

      const response = await fetch(url, requestInit);
      const responseObject = await this.handleApiResponse(response);
      this.handleApiResponseJson(
        responseObject.responseJson,
        callback,
        responseObject.parsedLink
      );
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
  private handleApiResponse = async (response: Response): Promise<any> => {
    const responseLink = response.headers.get("Link");
    let parsedLink = undefined;
    if (!isNil(responseLink)) {
      parsedLink = parse(responseLink);
    }
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
    const responseJson = await response.json();
    return { responseJson, parsedLink };
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
    callback: Function,
    responseLink?: Links
  ): void => {
    const stringifiedResponse = JSON.stringify(responseJson);
    console.log(`Response JSON -> ${stringifiedResponse}`);
    const response: any = JSON.parse(stringifiedResponse);

    callback(response, responseLink);
  };

  /**
   * Adds params to base path if they exist
   * @param path -> base path
   * @param params -> map of optional parameters for rest call
   */
  private static handleUrlParams(
    path: string,
    params: Map<string, any>
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

  fetchByLink = async (
    path: string,
    restOptions: RestOptions,
    callback: Function,
    failCallback?: Function
  ): Promise<void> => {
    const url = RestService.addToExistingParams(path, restOptions.params);
    try {
      const requestInit: RequestInit = {
        method: restOptions.method,
        headers: restOptions.headers,
        body: restOptions.body,
      };

      const response = await fetch(url, requestInit);
      const responseObject = await this.handleApiResponse(response);
      this.handleApiResponseJson(
        responseObject.responseJson,
        callback,
        responseObject.parsedLink
      );
    } catch (err) {
      console.log(err);
      if (failCallback) {
        failCallback();
      }
    }
  };

  private static addToExistingParams = (
    path: string,
    params: Map<string, any>
  ): string => {
    if (isNil(params) || params.size === 0) {
      return path;
    }
    let newPath = path;
    params.forEach((value, key) => {
      newPath = newPath.concat(value.toString()).concat("&");
    });
    newPath = newPath.substring(0, newPath.length - 1);

    return newPath;
  };
}

export default RestService;
