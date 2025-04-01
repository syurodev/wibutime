export class AuthEndpointUtils {
  VERSION = "v1";

  constructor(version?: string) {
    if (version) {
      this.VERSION = version;
    }
  }

  get login() {
    return `${this.VERSION}/auth/login`;
  }
}
