export const getGroups = (count, relations = {}) => {
    const groups = []
    for(let index = 1; index <= count; index++) {
        const group = {
            id: index,
            name: "Group " + index,
            level : undefined,
            description: "Description group " + index,
            levels: [],
            users: []
        }
        
        if(relations.levels !== undefined) {
            group.levels = relations.levels.map(level => {
                level.group_id = group.id
                return level
            })
        }

        groups.push(group)
    }
    return groups
}

export const getGroup = (relations = {}) => { 
    const groupInstance = Object.assign({}, getGroups(1, relations)[0])
    
    if(relations.users !== undefined) {
        groupInstance.users = relations.users
        for(const user of groupInstance.users) { user.groups.push({group: groupInstance}) }

        groupInstance.usersPaginator = { total: groupInstance.users.length, skip: 0, limit: 10 }
    }

    return groupInstance
}
