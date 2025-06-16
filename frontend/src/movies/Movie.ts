export  class Movie {
  _id: string | undefined;
  title: string = '';
  rank: number = 0;
  genre: string = '';
  // imageUrl: string = '';

  get isNew(): boolean {
    return this._id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer._id) this._id = initializer._id;
    if (initializer.title) this.title = initializer.title;
    if (initializer.rank) this.rank = initializer.rank;
    if (initializer.genre) this.genre = initializer.genre;
    //   if (initializer.imageUrl) this.imageUrl = initializer.imageUrl;

  }
}