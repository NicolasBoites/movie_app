import { Text, Flex, Box, Card, Grid, Button } from '@radix-ui/themes'
import {  PlusIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import Movie from '../fetchs/movies'
import {useNavigate} from 'react-router'
import type IMovie from '../interfaces/movies'
import Form from './Form'
import Title from './Title'

export default function () {
	const [movie, setMovie]:any = useState<IMovie>({});
	const [errors, setErrors] = useState<IMovie>({});
	const navigate = useNavigate();

	const saveMovie = () => {
		Movie.post(movie)
		.then(res => {
			if (res.error)
				navigate('/')
		}).catch(async err => {
			setErrors(await err)
		})
	}

	const getBack = () => {
		navigate(-1)
	}
    return <Grid columns="1" gap="2" style={{ justifyItems: 'center', }} align="center" mt="9">
        <Grid gap="5" align="center">
            <Title title="Add New movie" subTitle="Create new movie entry for your collection" back={getBack}/>
						<Card>
							<Form onChange={setMovie}/>
							<ButtonOptions>
								<PlusIcon/>
								Create movie
							</ButtonOptions>
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
                                Movie titles should be unique in the collection
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
