import { User } from './user';
const baseUrl = 'http://localhost:3000';
//const baseUrl = 'http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com';
const url = `${baseUrl}/auth`;
import * as Utils from './Utils'

function translateStatusToErrorMessage(status: number) {
    let result = { status, message: '' }
    switch (status) {
        case 401:
            result.message = 'Please login again.';
        case 403:
            result.message = 'You do not have permission to view the user(s).';
        default:
            result.message = 'There was an error retrieving the user(s). Please try again.'
    }
    return result;
}

async function checkStatus(response: any) {
    if (response.ok) {
        return response.json();
    } 

		const httpErrorInfo = {
				status: response.status,
				statusText: response.statusText,
				url: response.url,
		};
		console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

		let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
		return Promise.reject(await response.json());
}

// eslint-disable-next-line
function delay(ms: number) {
    return function (x: any): Promise<any> {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
    };
}

function convertToUserModels(data: any[]): User[] {
    let movies: User[] = data.map(convertToUserModel);
    return movies;
}

function convertToUserModel(item: any): User {
    return new User(item);
}

const userAPI = {
    logOut() {
        return fetch(url + '/logout', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Utils.getToken()
            }
        })
            // .then(delay(2000))
            .then(Utils.parseJSON)
    },
    sigIn(user: User) {
        return fetch(`${url}/signin`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // .then(delay(2000))
				.then(Utils.parseJSON)
				.catch(Utils.formatError(user))
    },
    signUp(user: User) {
        return fetch(`${url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(Utils.parseJSON)
				.catch(Utils.formatError(user));
    },

};

export { userAPI };
