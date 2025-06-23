import { useState, useEffect } from 'react'
import { Callout, Card, Grid } from "@radix-ui/themes";
import Form from "./Form";
import { useParams } from "react-router-dom";
import { movieAPI } from '../fetchs/movieAPI'
import { Movie } from '../movies/Movie';
import { useNavigate } from 'react-router'
import Title from '../components/Title'
import ButtonOptions from './ButtonOptions'
import { CheckIcon, Pencil1Icon } from '@radix-ui/react-icons'

export default function UpdateMovie() {
	const [movie, setMovie] = useState<Movie>(new Movie());
	const [title, setTitle] = useState('')
	const [errors, setErrors] = useState<any>({});
	const [isLoading, setLoading] = useState(true);
	const [isSuccess, setSuccess] = useState(false);
	let params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true)
		movieAPI.find(params.id)
			.then(res => {
				setTitle(res.title)
				setMovie(res)
			})
			.catch(() => {
				navigate(-1)
			}).finally(() => {
				setLoading(false)
			})
	}, [])

	const updateMovie = () => {
		setLoading(true)
		movieAPI.put(movie).
			then(() => {
				setSuccess(true)
				setTimeout( () => navigate('/'), 2500)
			}).catch(error => {
				if (error.status < 500)
					setErrors(error.messages)
				setLoading(false)
			})
	}

	const Back = () => {
		if (!isLoading)
			navigate('/')
	}

	return <Grid style={{ justifyItems: 'center' }}>
		<Grid gap="5" cols="1" align="center">
			<Title title="Update movie" subTitle={"Update the movie " + title} back={Back} />
			{isSuccess && <Callout.Root color="green" size="3">
				<Callout.Icon width="5rem">
					<CheckIcon />
				</Callout.Icon>
				<Callout.Text>
					Movie Updated <strong>{movie.title}!</strong>
				</Callout.Text>
			</Callout.Root>}
			<Card>
				<Form data={movie} onChange={setMovie} errors={errors} />
				<ButtonOptions onAccept={updateMovie} isLoading={isLoading} onCancel={Back}>
					<Pencil1Icon />
					Update movie
				</ButtonOptions>
			</Card>
		</Grid>
	</Grid>
}
