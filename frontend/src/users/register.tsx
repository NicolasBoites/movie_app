import { Button, Grid, Text, TextField } from "@radix-ui/themes";
import Title from "../components/Title";
import { SyntheticEvent, useState } from "react";

export default function Register () {
    const [user, setUser] = useState({})
    const [errors, setErrors] = useState({name: '', email: '', password: '', confirm: ''})
    const [isLoading, setLoading] = useState(false)

    const addValues = (event: SyntheticEvent) => {
        const {name, value} = event.target as HTMLInputElement;
        setUser((old:any) => ({...old, [name]: value}));
    }

    const register = () => {}

    return <Grid columns="1" style={{justifyItems: 'center'}} >
    <Title title="Join us" subTitle="Create your account to get started"/>
    <Grid gap="4" width="100%" maxWidth="20rem" mt="4">
        <Text  size="2" >User name</Text>
        <TextField.Root name="name" size="3" onChange={addValues} placeholder="Choose your username" />
        {errors.name && <Text size="2">{errors.name}</Text>}
        <Text  size="2" >Email address</Text>
        <TextField.Root name="email" size="3" onChange={addValues} placeholder="Enter your email" />
        {errors.email && <Text size="2">{errors.email}</Text>}
        <Text size="2">Password</Text>
        <TextField.Root name="password" size="3"  onChange={addValues} placeholder="Create a password" />
        <Text size="2">Comfirm your password</Text>
        <TextField.Root name="password" size="3"  onChange={addValues} placeholder="Comfirm your password" />
        {errors.confirm && <Text size="2">{errors.confirm}</Text>}
        <Button radius="none" onClick={register} loading={isLoading} mt="4" color="gray" highContrast size="4">CREATE ACCOUNT</Button>
    </Grid>
    </Grid>
}