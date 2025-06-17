import {useState, useEffect} from 'react'
import { Card, Grid } from "@radix-ui/themes";
import Form from "./Form";
import { useParams } from "react-router-dom";
import MoviesFetch from '../fetchs/movies'
import {IMovie, Movie} from '../interfaces/movies';
import {useNavigate} from 'react-router'
import Title from '../components/Title'
import ButtonOptions from './ButtonOptions'
import {Pencil1Icon} from '@radix-ui/react-icons'

export default function UpdateMovie () {
	const [movie, setMovie] = useState<IMovie>(new Movie());
	const [errors, setErrors] = useState<IMovie>(new Movie());
	const [isLoading, setLoading] = useState(true);
	let params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true)
		MoviesFetch(params.id).getMovie
		.then(setMovie)
		.catch((error: Error) => {
			console.log(error)
			//navigate(-1)
		}).finally( () => {
			setLoading(false)
		})
	}, [])

	const changeMovie = (data: IMovie) => {
		setMovie(old => ({...old, data}))
	}

	const updateMovie = () => {
		setLoading(true)
		MoviesFetch(movie).put.
		then(() => {
			navigate('/');
		}).catch(setErrors)
		.finally( () => {
			setLoading(false)
		})
	}

	const Back = () => {
		if(!isLoading)
			navigate('/')
	}
	
	return  <Grid style={{justifyItems: 'center'}}>
	<Grid gap="5" cols="1" align="center">
		<Title title="Update movie" subTitle={"Update the movie "+movie.title} back={Back}/>
		<Card>
			<Form onChange={changeMovie} errors={errors}/>
			<ButtonOptions onSave={updateMovie} isLoading={isLoading}>
				<Pencil1Icon/>
				Update movie
			</ButtonOptions>
		</Card>
	</Grid>
	</Grid>
}
