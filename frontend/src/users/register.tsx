import { Button, Grid, Text, TextField } from "@radix-ui/themes";
import Title from "../components/Title";
import { SyntheticEvent, useState } from "react";

export default function Register () {
    const [user, setUser] = useState({})
    const [isLoading, setLoading] = useState(false)

    const addValues = (event: SyntheticEvent) => {
        const {name, value} = event.target as HTMLInputElement;
        setUser((old:any) => ({...old, [name]: value}));
    }

    const register = () => {}

    return <Grid columns="1" style={{justifyItems: 'center'}} >
    <Title title="Join us" subTitle="Create your account to get started"/>
    <Grid gap="4" width="100%" maxWidth="20rem" mt="4">
        <Text  size="2" >Email address</Text>
        <TextField.Root name="email" size="3" onChange={addValues} placeholder="Enter your email" />
        <Text size="2">Email address</Text>
        <Text size="2">Password</Text>
        <TextField.Root name="password" size="3"  onChange={addValues} placeholder="Enter your password" />
        <Text size="2">Password</Text>
        <TextField.Root name="password" size="3"  onChange={addValues} placeholder="Enter your password" />
        {<Text size="2">Email address</Text>}
        <Button onClick={register} loading={isLoading} mt="4" color="gray" highContrast size="4">Sign in</Button>
    </Grid>
    </Grid>
}