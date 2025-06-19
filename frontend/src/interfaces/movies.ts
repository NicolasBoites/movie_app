
export interface IMovie{
	id?: string,
	title: string,
	rank?: Number,
	genre: string
}

export class Movie {
	id?: string ='';
	title: string='';
	rank?: Number;
	genre: string='';
}
