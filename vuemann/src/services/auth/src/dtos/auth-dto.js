const groups = (groups) => {
    return groups.map(group => ({
        id: group.id,
        name: group.name,
        level: group.level?.level ?? undefined
    }))
}

export const AuthDto = { groups }
