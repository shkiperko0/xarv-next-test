import { MetaEditor, IMetaScheme } from 'src/components/MetaEditor'
import { useState } from 'react'
import Page from 'src/components/Page'

const test_scheme: IMetaScheme = {
	title: 'string',
	rows: 'string[]',
	age: 'number',
	weapons: 'number[]',
	data1: {
		num1337: 'number',
		some_text: 'string'
	},

	min_max: 'string[]',
	sz: 'string[]',
	ext: 'string[]',
}

let test_data = {
	title: 'Some title',
	rows: ['Row1', 'Row2'],
	age: 2,
	weapons: [24, 32],
	data1: {
		num1337: 1337,
		some_text: 'some cool text'
	},

	min_max: [],
	sz: ['sz'],
	ext: ['ext'],
}

export default () => {
	const [data, setData] = useState(test_data)
	return <>
		<Page>
			<MetaEditor
				data={data}
				setData={setData}
				scheme={test_scheme}
			/>

			{JSON.stringify(data)}
		</Page>
	</>
}