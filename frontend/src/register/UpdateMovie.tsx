import {useState, useEffect} from 'react'
import { Card, Grid } from "@radix-ui/themes";
import Form from "./Form";
import { useParams } from "react-router-dom";
import MoviesFetch from '../fetchs/movies'
import IMovie from '../interfaces/movies';
import {useNavigate} from 'react-router'
import Title from './Title'
import ButtonOptions from './ButtonOptions'

export default function UpdateMovie (props: any) {
	const [movie, setMovie] = useState<IMovie>({});
	const [errors, setErrors] = useState<IMovie>({});
	let params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		MoviesFetch(params.id).getMovie
		.then(setMovie)
		.catch((error: Error) => {
			console.log(error)
			navigate(-1)
		})
	}, [])

	const changeMovie = (data) => {
		setMovie(old => ({...old, data}))
	}

	const updateMovie = () => {
		MoviesFetch(movie).put.
		then((res:Response) => {
			navigate('/');
		}).catch(setErrors)
	}
	
	return <Grid cols="1" style={{justifyItems: 'center'}}>
		<Title title="Update movie" subTitle={"Update the movie "+movie.title}/>
		<Card>
			<Form onChange={changeMovie}/>
			<ButtonOptions>
				Update movie
			</ButtonOptions>
		</Card>
	</Grid>
}
