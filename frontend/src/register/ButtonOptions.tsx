import { PlusIcon } from '@radix-ui/react-icons'
import { Button, Grid } from '@radix-ui/themes'

export default function ButtonOptions({onCancel, onAccept, isLoading, children}: any) {

	return <Grid columns="2" gap="3" justify="center" m="4" mt="6">
		<Button disabled={isLoading} onClick={onCancel} radius="none" size="4" variant="outline" color='gray' highContrast>
			Cancel
		</Button>
		<Button loading={isLoading} onClick={onAccept} radius="none" size="4" color='gray' highContrast>
			{ children || <PlusIcon />}
		</Button>
	</Grid>
}
