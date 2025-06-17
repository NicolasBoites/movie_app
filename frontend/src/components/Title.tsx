import { Flex, Box, IconButton, Grid, Heading, Text } from '@radix-ui/themes'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

export default function Title({back, title, subTitle, backButton=true}: any) {

	return <Flex align="center" gap="4" >
		{backButton && <Box onClick={back} >
			<IconButton variant="ghost" color="gray" >
				<ArrowLeftIcon width="35" height="auto" />
			</IconButton>
		</Box>}
		<Grid gap="2">
			<Heading size="8" weight="medium">{title}</Heading>
			<Text size="4" weight="medium" style={{ color: '#6b7280' }} htmlFor="">
				{subTitle}
			</Text>
		</Grid>
	</Flex>
}
