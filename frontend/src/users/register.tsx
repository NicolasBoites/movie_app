import { Badge, Button, Callout, Checkbox, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import Title from "../components/Title";
import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../fetchs/userAPI";

export default function Register() {
    let [user, setUser]: any = useState({username:'', email:'', password:'',confirm:'', terms: false });
    let [errors, setErrors]: any = useState({ terms: '' });
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
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
        errors = {}
        let { confirm, terms, ...data } = user

        if (!terms) {
            setLoading(false)
            errors.terms = 'you must accept the terms';
        } if (!user.password && user.password !== confirm) {
            setLoading(false)
            errors.confirm = "passwords doesn't match";
        }

        if (!errors.terms && !errors.confirm) {
            userAPI.signUp(data)
                .then((res: any) => {
                    window.localStorage.user = JSON.stringify(res);
                    setSuccess(true);
                    setTimeout(() => navigate('/'), 2500)
                }).catch((res: any) => {
                    if (res.statusCode < 500)
                        setErrors({ ...errors, ...res.message, })
                }).finally(() => {
                    setLoading(false)
                })
            return;
        }

        setErrors(errors);
        setLoading(false);
    }

    const getBack = () => {
        if (!isLoading)
            navigate('/login')
    }

    return <Grid columns="1" style={{ justifyItems: 'center' }} gap="3">
        <Grid gap="4" width="100%" maxWidth="23rem">
            
            <Title mb="4" title="Join us" subTitle="Create your account to get started" back={getBack} />
            {isSuccess && <Callout.Root color="green" size="3">
                <Callout.Icon width="5rem">
                    <CheckIcon />
                </Callout.Icon>
                <Callout.Text>
                    User registered <strong>Welcome {user.username}!</strong>
                </Callout.Text>
                <Callout.Text>
                    <strong>You will be Redirected to Home</strong>
                </Callout.Text>
            </Callout.Root>}
            <Text size="2" >User name</Text>
            <TextField.Root color={errors.username ? 'red' : 'gray'} name="username" size="3" onChange={addValues} placeholder="Choose your username" radius="none" />
            {errors.username && <Badge size="2" color="red">{errors.username}</Badge>}
            <Text size="2" >Email address</Text>
            <TextField.Root color={errors.username ? 'red' : 'gray'} name="email" size="3" onChange={addValues} placeholder="Enter your email" radius="none" />
            {errors.email && <Badge size="2" color="red">{errors.email}</Badge>}
            <Text size="2">Password</Text>
            <TextField.Root color={errors.username ? 'red' : 'gray'} type="password" name="password" size="3" onChange={addValues} placeholder="Create a password" radius="none" />
            {errors.password && <Badge size="2" color="red">{errors.password}</Badge>}
            <Text size="2">Comfirm your password</Text>
            <TextField.Root color={errors.username ? 'red' : 'gray'} type="password" name="confirm" size="3" onChange={addValues} placeholder="Comfirm your password" radius="none" />
            {errors.confirm && <Badge size="2" color="red">{errors.confirm}</Badge>}
            <Text size="2" align="center">
                <Flex gap="2">
                    <Checkbox color="gray" highContrast name="terms" onClick={checkTerms} />
                    I agree to the Terms of Service and Privacy Policy
                </Flex>
                {errors.terms && <Badge size="3" color="red">{errors.terms}</Badge>}
            </Text>
            <Button radius="none" onClick={register} loading={isLoading} mt="4" color="gray" highContrast size="4">CREATE ACCOUNT</Button>
        </Grid>
        <Text mt="4" color="gray" size="3">Already have an account? <strong><Link to="/login">Sign in</Link></strong></Text>
    </Grid>
}
