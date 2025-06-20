import { Text, Flex, Box, Card, Grid } from '@radix-ui/themes'
import { PlusIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { movieAPI } from '../fetchs/movieAPI'
import { useNavigate } from 'react-router'
import { type IMovie, Movie } from '../interfaces/movies'
import Form from './Form'
import Title from '../components/Title'
import ButtonOptions from './ButtonOptions'

class movieFormat {
	title: string= ''
	rank: number=0;
	genre: string='';
}

export default function () {
    const [movie, setMovie]:any  = useState(new movieFormat());
    const [errors, setErrors]: any = useState({});
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const saveMovie = () => {
        setLoading(true);
				setErrors({})

        movieAPI.post(movie)
            .then(() => {
                navigate('/')
            }).catch((err: any) => {
							console.log(err)
                if (err.statusCode < 500)
                    setErrors(err.message)
            }).finally(() => {
                setLoading(false)
            })
    }

    const getBack = () => {
        if (!isLoading)
            navigate(-1)
    }

    return <Grid columns="1" gap="2" style={{ justifyItems: 'center', }} align="center" mt="9">
        <Grid gap="5" align="center">
            <Title title="Add New movie" subTitle="Create new movie entry for your collection" back={getBack} />
            <Card>
                <Form data={movie} onChange={setMovie} errors={errors} />
                <ButtonOptions onAccept={saveMovie} onCancel={getBack} isLoading={isLoading}>
                    <PlusIcon />
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
