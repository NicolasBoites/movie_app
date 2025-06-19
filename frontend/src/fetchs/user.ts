interface IUser  {
    id?: string;
    username: string;
    email: string;
    password?: string;
}

class User {
	id?:string='';
	username: string='';
	email: string='';
	password?: string='';
	accessToken?: string='';
	refreshToken?: string='';

	get isNew(): boolean {
    return this.id === undefined;
  }

	constructor(initializer?: any) {
			if (!initializer) return;
			if (initializer.id) this.id = initializer.id;
			if (initializer.username) this.username = initializer.username;
			if (initializer.email) this.email = initializer.email;
			if (initializer.password) this.password = initializer.password;
			if (initializer.accessToken) this.accessToken = initializer.accessToken;
			if (initializer.refreshToken) this.refreshToken = initializer.refreshToken;

		}
	}

export {type IUser, User}
