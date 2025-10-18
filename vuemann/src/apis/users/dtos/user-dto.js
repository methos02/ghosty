import { capitalize } from "vue"

export const userDto = (user, groups = false) => {
    const userDto = { 
        id: user.id,
        username : user.username,
        lastname: user.lastname, 
        firstname: user.firstname,
        fullname: formatFullname(user.lastname, user.firstname),
        email: user.email,
    }

    if(groups) {
        userDto.groups = (user.groups ?? []).map(relation => { 
            return { 
                id: relation.group.id, 
                name: relation.group.name, 
                description: relation.group.description,
                levels : relation.group.level ?? []
            }
        })
    }   

    return userDto
}

const formatFullname = (lastname, firstname) => {
    return lastname.toUpperCase() + ' ' + capitalize(firstname) 
}
