import { Text, Grid, TextField, Select, Badge } from '@radix-ui/themes'
import { SyntheticEvent } from 'react';
import { Movie } from '../movies/Movie'

const genre = ['Thriller','Joke','Terror','Horror','Suspence','Sci-Fi','Action']

interface Props {
	onChange: (old: any) => void;
	errors: any;
	data?: Movie;
}

export default function Form({ data = new Movie(), onChange, errors = {} }: Props) {

	const saveData = (event: SyntheticEvent) => {
		const { name, value } = event.target as HTMLInputElement;
		onChange((old: Movie) => ({ ...old, [name]: parseInt(value) || value }));
	}

	const selectGenre = (genre: string) => {
		onChange((old: Movie) => ({ ...old, genre }));
	}

	return <Grid gap="4" m="4">
		<Text size="2">MOVIE TITLE</Text>
		<TextField.Root value={data.title} name="title" color="gray" onChange={saveData} variant="surface" size="3" placeholder="Enter movie title..." />
		{errors.title && <Badge color="red">{errors.title}</Badge>}
		<Text size="2">RANK</Text>
		<TextField.Root value={data.rank} name="rank" color='gray' onChange={saveData} variant="surface" size="3" placeholder="Enter rank number..." />
		{errors.rank && <Badge color="red">{errors.rank}</Badge>}
		<Text size="2">Genre</Text>
		<Select.Root size="3" name="genre" onValueChange={selectGenre} value={data.genre} >
			<Select.Trigger placeholder='Select genre...' color='gray' variant="surface" />
			<Select.Content color="gray" variant="solid">
				{
					genre.map((genre) =>
						<Select.Item key={genre} value={genre} >
							{genre}
						</Select.Item>
					)
				}
			</Select.Content>
		</Select.Root>
		{errors.genre && <Badge color="red">{errors.genre}</Badge>}
	</Grid>;
}
