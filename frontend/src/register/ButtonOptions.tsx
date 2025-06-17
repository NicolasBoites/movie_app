import {PlusIcon } from '@radix-ui/react-icons'
import {Button, Grid} from '@radix-ui/themes'

export default function ButtonOptions (props: any) {

	return <Grid columns="2" gap="3" justify="center" m="4" mt="6">
			<Button onClick={props.cancel} radius="none" size="4" variant="outline" color='gray' highContrast>
						Cancel
				</Button>
				<Button onClick={props.accept} radius="none" size="4" color='gray' highContrast>
						{props.children || <PlusIcon />}
				</Button>
		</Grid>
}
