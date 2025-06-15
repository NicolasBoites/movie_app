import { Heading, Text, IconButton, Flex, Box, TextField, Select, Card, Grid, Button } from '@radix-ui/themes'
import { ArrowLeftIcon, PlusIcon, InfoCircledIcon } from '@radix-ui/react-icons'

export default function () {
    return <Grid columns="1" gap="2" style={{ justifyItems: 'center', }} align="center" mt="9">
        <Grid width="45rem" gap="5" align="center">
            <Flex align="center" gap="4" >
                <Box >
                    <IconButton variant="ghost" color="gray" >
                        <ArrowLeftIcon width="35" height="auto" />
                    </IconButton>
                </Box>
                <Grid gap="2">
                    <Heading size="8" weight="medium">Add New movie</Heading>
                    <Text size="4" weight="medium" style={{ color: '#6b7280' }} htmlFor="">
                        Create new movie entry for your collection
                    </Text>
                </Grid>
            </Flex>
            <Grid gap="4" style={{ border: '1px solid #d2d7db' }} p="5">
                <Grid gap="3">
                    <Text size="2">MOVIE TITLE</Text>
                    <TextField.Root color="gray" variant="surface" style={{ fontSize: '1vmax', height: '3vmax' }} placeholder="Enter movie title..." />
                </Grid>
                <Grid gap="3">
                    <Text size="2">RANK</Text>
                    <TextField.Root color='gray' variant="surface" style={{ fontSize: '1vmax', height: '3vmax' }} placeholder="Enter rank number..." />
                </Grid>
                <Grid gap="3">
                    <Text size="2">Genre</Text>
                    <Select.Root size="3" >
                        <Select.Trigger placeholder='Select genre...' color='gray' variant="surface" style={{ fontSize: '1vmax', height: '3vmax', width: 'auto' }} />
                        <Select.Content color="gray" variant="solid">
                            <Select.Item value="0">
                                Thriller
                            </Select.Item>
                            <Select.Item value="1">
                                Joke
                            </Select.Item>
                            <Select.Item value="2">
                                Terror
                            </Select.Item>
                            <Select.Item value="3">
                                Suspence
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Grid>
                <Grid columns="2" rows="1" gap="5" mt="3" >
                    <Button radius="none" size="4" variant="outline" color='gray' highContrast>
                        Cancel
                    </Button>
                    <Button radius="none" size="4" color='gray' highContrast>
                        <PlusIcon />
                        Create Movie
                    </Button>
                </Grid>
            </Grid>
            <Card>
                <Flex >
                    <Box mt="3">
                        <InfoCircledIcon color="gray" />
                    </Box>
                    <Box p="2">
                        <Text>Movie Creation Guidelines</Text>
                        <ul>
                            <li>
                                Movie tistles should be unique in the collection
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