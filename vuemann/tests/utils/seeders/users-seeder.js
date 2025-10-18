export const getUsers = (count, relations = {}) => {
    const users = []
    for(let index = 1; index <= count; index++) {
        const user = {
            id: index,
            username: "USER" + index,
            lastname: "user" + index,
            firstname: "user" + index,
            email: `user${index}@chu-brugmann.be`,
            groups: []
        }

        if(relations.groups !== undefined) {
            user.groups = relations.groups
        }

        users.push(user)
    }
    return users
}

export const getUser = (relations = {}) => {
    const userInstance = Object.assign({}, getUsers(1, relations)[0])

    if(relations.groups !== undefined) {
        userInstance.groups = relations.groups
    }
        
    return userInstance
}
