import { Text, Grid, TextField, Select } from '@radix-ui/themes'
import { SyntheticEvent } from 'react';
import { Movie } from '../movies/Movie'

const genre = ['Thriller', 'Joke', 'Terror', 'Suspence']

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
		{errors.title && <Text color="red">{errors.title}</Text>}
		<Text size="2">RANK</Text>
		<TextField.Root value={data.rank} name="rank" color='gray' onChange={saveData} variant="surface" size="3" placeholder="Enter rank number..." />
		{errors.rank && <Text color="red">{errors.rank}</Text>}
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
		{errors.genre && <Text color="red">{errors.genre}</Text>}
	</Grid>;
}
