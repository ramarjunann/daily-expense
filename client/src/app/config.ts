
export class Config {

  public static getEnvironmentVariable(value) {
    var environment:string;
    var data = {};
    environment = window.location.hostname;
    switch (environment) {
      case 'localhost':
        data = {
          baseApiUrl: 'http://localhost:3000/api/v1',
        };
        break;
      default:
        data = {
          baseApiUrl: '/api/v1',
        };
    }
    return data[value];
  }
}
