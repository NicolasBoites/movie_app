
const getToken = () => window.localStorage.key
const localUrl = 'http://localhost:3000/movies';

export default (data) => ({
	post: fetch(localUrl, {
		headers: {
			'Content-type': 'aplication/json',
			'Authorization': getToken()
		},
		method: 'POST',
		data: JSON.stringify(data)
	}).then((res:Response) => {
		if (res.ok)
			return res.json();
		else if (res.status<500)
			return Promise.reject(res.json());
		throw new Error('error server')
	}),
	getMovie: fetch (localUrl+`/${data}`, {
		headers: {
			'Content-type': 'aplication/json',
			'Authorization': getToken()
		},
	}).then(res => res.json()),
	put: fetch (localUrl+`${data.id}`, {
		headers: {
			'Content-type': 'aplication/json',
			'Authorization': getToken()
		},
		method: 'PUT',
		body: JSON.stringify(data)
	}).then(res => res.json())
})
