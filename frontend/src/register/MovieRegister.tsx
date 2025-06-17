import { Heading, Text, IconButton, Flex, Box, TextField, Select, Card, Grid, Button } from '@radix-ui/themes'
import { ArrowLeftIcon, PlusIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useState, SyntheticEvent } from 'react'
import Movie from '../fetchs/movies'
import {useNavigate} from 'react-router'
import type IMovie from '../interfaces/movies'

export default function () {
	const [movie, setMovie]:any = useState<IMovie>({});
	const [errors, setErrors] = useState<IMovie>({});
	const navigate = useNavigate();

	const saveData = (event: SyntheticEvent) => {
		const el = event.target as HTMLInputElement;
		setMovie(old => ({...old, [el.name]: el.value}));
	}

	const selectGenre = (value: int) => {
		setMovie({...movie, genre: value});
	}

	const saveMovie = () => {
		Movie.post(movie)
		.then(res => {
			if (res.error)
				navigate('/')
		}).catch(async err => {
			setErrors(await err)
		})
	}

    return <Grid columns="1" gap="2" style={{ justifyItems: 'center', }} align="center" mt="9">
        <Grid gap="5" align="center">
            <Flex align="center" gap="4" >
                <Box >
                    <IconButton variant="ghost" color="gray" >
                        <ArrowLeftIcon width="35" height="auto" />
                    </IconButton>
                </Box>
                <Grid gap="2">
                    <Heading size="8" weight="medium">Add New movie</Heading>
                    <Text size="4" weight="medium" style={{ color: '#6b7280' }} htmlFor="">
                        Create new movie entry for your collection
                    </Text>
                </Grid>
            </Flex>
						<Card>
							<Grid gap="4" m="4">
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
							</Grid>
							<Grid columns="2" gap="3" justify="center" m="4" mt="6">
								<Button radius="none" size="4" variant="outline" color='gray' highContrast>
											Cancel
									</Button>
									<Button onClick={saveMovie} radius="none" size="4" color='gray' highContrast>
											<PlusIcon />
											Create Movie
									</Button>
							</Grid>
						</Card>
            <Card>
                <Flex >
                    <Box mt="3">
                        <InfoCircledIcon color="gray" />
                    </Box>
                    <Box p="2">
                        <Text>Movie Creation Guidelines</Text>
                        <ul>
                            <li>
                                Movie tistles should be unique in the collection
                            </li>
                            <li>
                                Rank numbers should reflect the movie's position in your personal ranking
                            </li>
                            <li>
                                Select the most appropriate genre for the movie
                            </li>
                        </ul>
                    </Box>
                </Flex>
            </Card>
        </Grid>
    </Grid>
}
