import { User } from './user';
const baseUrl = "http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com";
// const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/auth`;

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

function checkStatus(response: any) {
    if (response.ok) {
        return response;
    } else {
        const httpErrorInfo = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
        };
        console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

        let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
        Promise.reject(errorMessage);
    }
}

async function parseJSON(response: Response) {

    return response.json();
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

function getToken() {
    return JSON.parse(window.localStorage.user).accessToken
}

const userAPI = {
    logOut() {
        return fetch(url + '/logout', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        })
            // .then(delay(2000))
            .then(checkStatus)
            .then(parseJSON)
            .catch((error: TypeError) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error retrieving the user. Please try again.'
                );
            });
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
            .then(checkStatus)
            .then(parseJSON)
            .catch((error: TypeError) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error updating the user. Please try again.'
                );
            });
    },
    signUp(user: User) {
        return fetch(`${url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(checkStatus)
            .then(parseJSON);
    },

};

export { userAPI };
