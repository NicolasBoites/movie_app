import {Flex, Box, IconButton, Grid, Heading, Text} from '@radix-ui/themes'
import { ArrowLeftIcon} from '@radix-ui/react-icons'

export default function Title (props: any) {

	return <Flex align="center" gap="4" >
				<Box onClick={props.back} >
						<IconButton variant="ghost" color="gray" >
								<ArrowLeftIcon width="35" height="auto" />
						</IconButton>
				</Box>
				<Grid gap="2">
						<Heading size="8" weight="medium">{props.title}</Heading>
						<Text size="4" weight="medium" style={{ color: '#6b7280' }} htmlFor="">
							{props.subTitle}
						</Text>
				</Grid>
		</Flex>
}
