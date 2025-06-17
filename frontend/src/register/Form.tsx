import {Text, Grid, TextField, Select} from '@radix-ui/themes'

export default function Form (props: any) {

	const saveData = (event: SyntheticEvent) => {
		const el = event.target as HTMLInputElement;
		props.onChange(old => ({...old, [el.name]: el.value}));
	}

	const selectGenre = (value: int) => {
		props.onChange({...movie, genre: value});
	}

	return <Grid gap="4" m="4">
			<Text size="2">MOVIE TITLE</Text>
			<TextField.Root name="title" color="gray" onChange={saveData} variant="surface"  size="3" placeholder="Enter movie title..." />
			<Text size="2">RANK</Text>
			<TextField.Root name="rank" color='gray' onChange={saveData} variant="surface" size="3"  placeholder="Enter rank number..." />
			<Text size="2">Genre</Text>
			<Select.Root size="3" name="genre" onValueChange={selectGenre}>
					<Select.Trigger placeholder='Select genre...' color='gray' variant="surface"  />
					<Select.Content color="gray" variant="solid">
							<Select.Item value="0">
									Thriller
							</Select.Item>
							<Select.Item value="1">
									Joke
							</Select.Item>
							<Select.Item value="2">
									Terror
							</Select.Item>
							<Select.Item value="3">
									Suspence
							</Select.Item>
					</Select.Content>
			</Select.Root>
		</Grid>;
}
