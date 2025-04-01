export class GenreResponse {
  id: number;
  name: string;

  constructor(id?: number, name?: string) {
    this.id = id;
    this.name = name;
  }

  static mapToList(
    init: {
      id: number;
      name: string;
    }[],
  ) {
    return init.map((genre) => new GenreResponse(genre.id, genre.name));
  }
}
