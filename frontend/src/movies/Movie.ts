export  class Movie {
  id: string | undefined;
  title: string = '';
  rank: number = 0;
  genre: string = '';
  // imageUrl: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.title) this.title = initializer.title;
    if (initializer.rank) this.rank = initializer.rank;
    if (initializer.genre) this.genre = initializer.genre;
  }
}