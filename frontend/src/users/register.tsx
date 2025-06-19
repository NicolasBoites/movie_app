import { Button, Checkbox, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import Title from "../components/Title";
import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../fetchs/userAPI";

export default function Register() {
    const [user, setUser]: any = useState({ terms: false });
    const [errors, setErrors]: any = useState({});
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addValues = (event: SyntheticEvent) => {
        const { name, value } = event.target as HTMLInputElement;
        setUser((old: any) => ({ ...old, [name]: value }));
    }

    const checkTerms = () => {
        setUser((old: any) => ({ ...old, terms: !old.terms }))
    }

    const register = () => {
        setLoading(true)
        setErrors({})

        if (!user?.terms) {
            setLoading(false)
            return setErrors((old: any) => ({ ...old, terms: 'you must accept the terms' }))
        } else if (user.password!==user.confirm) {
            console.log(user)
            setLoading(false)
            return setErrors((old:any) => ({...old, confirm: "passwords doesn't match"}))
        }

        userAPI.signUp(user)
        .then((res:any) => {
            window.localStorage.user = JSON.stringify(res);
            navigate('/')
        }).catch((res:any) => {
            if (res.status < 500)
                setErrors(res.message)
        }).finally(() => {
            setLoading(false)
        })
    }

    const getBack = () => {
        if (!isLoading)
            navigate('/login')
    }

    return <Grid columns="1" style={{ justifyItems: 'center' }} gap="3">
        <Grid gap="4" width="100%" maxWidth="23rem">
            <Title mb="4" title="Join us" subTitle="Create your account to get started" back={getBack} />
            <Text size="2" >User name</Text>
            <TextField.Root name="username" size="3" onChange={addValues} placeholder="Choose your username" radius="none" />
            {errors.name && <Text size="2" color="red">{errors.name}</Text>}
            <Text size="2" >Email address</Text>
            <TextField.Root name="email" size="3" onChange={addValues} placeholder="Enter your email" radius="none" />
            {errors.email && <Text size="2" color="red">{errors.email}</Text>}
            <Text size="2">Password</Text>
            <TextField.Root type="password" name="password" size="3" onChange={addValues} placeholder="Create a password" radius="none" />
            {errors.password && <Text size="2" color="red">{errors.password}</Text>}
            <Text size="2">Comfirm your password</Text>
            <TextField.Root type="password" name="confirm" size="3" onChange={addValues} placeholder="Comfirm your password" radius="none" />
            {errors.confirm && <Text size="2" color="red">{errors.confirm}</Text>}
            <Text size="2" align="center">
                <Flex gap="2">
                    <Checkbox color="gray" highContrast name="terms" onClick={checkTerms} />
                    I agree to the Terms of Service and Privacy Policy
                </Flex>
                {errors.terms && <Text size="2" color="red">{errors.terms}</Text>}
            </Text>
            <Button radius="none" onClick={register} loading={isLoading} mt="4" color="gray" highContrast size="4">CREATE ACCOUNT</Button>
        </Grid>
        <Text mt="4" color="gray" size="3">Already have an account? <strong><Link to="/login">Sign in</Link></strong></Text>
    </Grid>
}
