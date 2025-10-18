export const auth = {
    roles : {
        admin : [
            {
                "group" : "RdvManager",
                "level" : 10
            }
        ],
        manager : [
            {
                "group" : "RdvManager", 
                "level" : 5
            }
        ],
        user : [
            {
                "group" : "RdvManagement",
                "level" : 1
            }
        ],
        superadmin : [
            {
                "group" : "RdvManager",
                "level" : 15
            },
            {
                "group" : "SystemAdmin",
                "level" : 10
            }
        ]
    }
}
