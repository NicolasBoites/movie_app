import {useState, useEffect} from 'react'
import { Card, Grid } from "@radix-ui/themes";
import Form from "./Form";
import { useParams } from "react-router-dom";
import {movieAPI} from '../fetchs/movieAPI'
import {Movie} from '../movies/Movie';
import {useNavigate} from 'react-router'
import Title from '../components/Title'
import ButtonOptions from './ButtonOptions'
import {Pencil1Icon} from '@radix-ui/react-icons'

export default function UpdateMovie () {
	const [movie, setMovie] = useState<Movie>(new Movie());
	const [errors, setErrors] = useState<any>({});
	const [isLoading, setLoading] = useState(true);
	let params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true)
		movieAPI.find(params.id)
		.then(res => setMovie(new Movie(res)))
		.catch(() => {
			navigate(-1)
		}).finally( () => {
			setLoading(false)
		})
	}, [])

	const updateMovie = () => {
		setLoading(true)
		movieAPI.put(movie).
		then(() => {
			navigate('/');
		}).catch(error => {
			if(error.status<500)
				setErrors(error.messages)
		})
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
			<Form data={movie} onChange={setMovie} errors={errors}/>
			<ButtonOptions onSave={updateMovie} isLoading={isLoading}>
				<Pencil1Icon/>
				Update movie
			</ButtonOptions>
		</Card>
	</Grid>
	</Grid>
}
