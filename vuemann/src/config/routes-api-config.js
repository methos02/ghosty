export const routesApi = {
    global: {
        "api.status": {url: "", method : "get"},
        "auth.token": {url:"v1/auth/token", method : "post"},
        "auth.verify" : {url:"v1/auth/token/verify", method : "get"},
        "auth.refresh" : {url:"v1/auth/token/refresh", method : "post"},
    },

    "user.show.username" : {url: "v1/users/username/{username}", method: "get", api: "gums"},
    "user.groups": {url: "v1/users/id/{id}/groups_levels", method: "get", api: "gums"},

    "getRoute" : { url: 'test/{id}', method: 'get', api: 'testApi'},
    "postRoute" : { url: 'test', method: 'post', api: 'testApi'},
    "patchRoute" : { url: 'test', method: 'patch', api: 'testApi'},
    "deleteRoute" : { url: 'test', method: 'delete', api: 'testApi'},
    "testApi.auth.token" : { url:"v1/testApi/auth/token", method : "post", api: "testApi" },
    "wsRoute" : { url: "testRoute", api: "testApi"}
}
