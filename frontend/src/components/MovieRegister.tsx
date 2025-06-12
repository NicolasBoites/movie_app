import {Heading, Text, IconButton, Flex, Box, TextField, Select, Card} from '@radix-ui/themes'
import {ArrowLeftIcon} from '@radix-ui/react-icons'

export default function () {
    return <Flex direction="column" justify="start" gap="2">
        <Flex style={{fontSize:'2vmin'}} justify="start" align="center" gap="2">
            <Box inset='2'>
                <IconButton variant="ghost" color="gray">
                    <ArrowLeftIcon width="30" height="30"/>
                </IconButton>
            </Box>
            <Box>
                <Heading size="8">Add new movie</Heading>
                <Text size="4" weight="medium" color="gray" htmlFor="">create new movie entry for your collection</Text>
            </Box>
        </Flex>
        <Card size="3">
            <Box>
                <Text>MOVIE TITLE</Text>
                <TextField.Root style={{fontSize: '2vmin', height: '5vmin'}}  variant="surface" placeholder="Enter movie title..."/>
            </Box>
            <Box>
                <Text>RANK</Text>
                <TextField.Root style={{fontSize: '1vw', height: '3vw'}}  size="3" placeholder="Enter rank number..."/>
            </Box>
            <Box>
                <Text>Genre</Text>
                <Select.Root defaultValue="0" size="3" >
                    <Select.Trigger style={{fontSize: '2vh', height: '3rem', width:'100%'}} variant="ghost"/>
                    <Select.Content>
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
            </Box>
        </Card>
    </Flex>
}