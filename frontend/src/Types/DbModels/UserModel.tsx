type UserModel = {
    id: number,
    username: string,
    password?: string,
    email: string,
    active: boolean,
    scope: string,
    about: string,
}

export default UserModel;