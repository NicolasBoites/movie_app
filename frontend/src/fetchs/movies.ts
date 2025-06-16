
const getToken = () => window.localStorage.key
const localUrl = 'http://localhost:3000/movies'

export default (data) => {
	post: fetch(localUrl, {
		headers: {
			'Content-type': 'aplication/json',
			'Authorization': getToken()
		},
		method: 'POST',
		data: JSON.stringify(data)
	}).then(res => {
		if (res.status)
			return res.json()
		else if (res.status<500)
			return Promise.reject(res.json())
		throw new Error(res.status)
	})
}
