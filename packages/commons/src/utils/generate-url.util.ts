export class GenerateUrl {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getMediaUrl() {
    return `${process.env.MEDIA_SERVER_ENDPOINT ?? 'localhost:9000'}${this.url}`;
  }
}
