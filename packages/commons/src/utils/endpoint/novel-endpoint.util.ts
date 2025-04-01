export class NovelEndpointUtils {
  VERSION = "v1";

  constructor(version?: string) {
    if (version) {
      this.VERSION = version;
    }
  }

  get getTopNovels() {
    return `${this.VERSION}/novels/top`;
  }

  get getHistories() {
    return `${this.VERSION}/reading-histories`;
  }

  getNovelDetail(id: number) {
    return `${this.VERSION}/novels/${id}/detail`;
  }
}
