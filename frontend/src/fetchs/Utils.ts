const parseJSON = async (response: Response) => {
	 if(response.ok)
			return response.json();
		
		return Promise.reject(await response.json())
}

const formatError = (format:any) => (res:any) => {
	let keys = Object.keys(format);
	let errors = res.message;

	res.message = keys.reduce((acc:any, el:string) => {
		if(typeof errors ==='string' ){
			if(errors.toLowerCase().includes(el))
				acc[el] = errors;
			return acc;
		}

		acc[el] = errors.find((er:string) => er.toLowerCase().includes(el));
		return acc;
	}, {});

	return Promise.reject(res);
};

function getToken() {
    return 'Bearer '+JSON.parse(window.localStorage.user).accessToken
}

export {
	parseJSON,
	formatError,
	getToken
}
