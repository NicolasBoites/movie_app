import { User } from './user';
//const baseUrl = 'http://localhost:3000';
const baseUrl = 'http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com';
const url = `${baseUrl}/auth`;
import * as Utils from './Utils'

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
