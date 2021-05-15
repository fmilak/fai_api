/**
 * Additional options for REST requests
 */
class RestOptions {
  method = "";

  headers: any;

  body: any;

  params: Map<string, any> = new Map<string, any>();
}

export default RestOptions;
