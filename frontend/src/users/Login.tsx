import { Button, Grid, Text, TextField } from "@radix-ui/themes";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { SyntheticEvent, useState } from "react";
import {userAPI} from '../fetchs/userAPI.ts'

export default function Login () {
    const [user, setUser] = useState({})
    const [errors, setErrors] = useState({password:'', email:''})
    const [isLoading, setLoading] = useState(false)

    const addValues = (event: SyntheticEvent) => {
        const {name, value} = event.target as HTMLInputElement;
        setUser((old:any) => ({...old, [name]: value}));
    }

    const logIn = () => {
        setLoading(true)
				setErrors({email:'', password:''})

				userAPI.sigIn(user)
				.then((res:any) => {
					window.localStorage.key = res.accessToken;
					window.localStorage.user= JSON.stringify(res);
				}).catch((error: any) => {
					if(error.status<500)
						setErrors(error.messages);
				}).finally(()=> {
					setLoading(false)
				})
    }

    return <Grid columns="1" style={{justifyItems: 'center'}} >
        <Title title="Welcome back" subTitle="Enter your credential to continue" backButton={false}/>
        <Grid gap="4" width="100%" maxWidth="20rem" mt="4">
            <Text  size="2" >Email address</Text>
            <TextField.Root radius="none" name="email" size="3" onChange={addValues} placeholder="Enter your email" />
            {errors.email && <Text size="2" color="red">{errors.email}</Text>}
            <Text size="2">Password</Text>
            <TextField.Root radius="none" name="password" size="3"  onChange={addValues} placeholder="Enter your password" />
            {errors.password && <Text size="2" color="red">{errors.password}</Text>}
            <Button radius="none" onClick={logIn} loading={isLoading} mt="4" color="gray" highContrast size="4">SIGN IN</Button>
        </Grid>
        <Grid mt="5">
            <Text>New to our platform? <strong><Link to="/register">Create an account</Link></strong></Text>
        </Grid>
    </Grid>
}
