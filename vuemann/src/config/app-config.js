export const app = {
    homepage_url : "/",
    name: 'Vuemann',
    ws: true,
    auth : import.meta.env[`VITE_AUTH`] !== 'false',
    apis : {
        api : {
            url : "www.api.fr/",
            auth : true,
            status : false
        },
        api2 : {
            url : "www.api2.fr/",
            status : false
        },
        testApi : {
            url : "www.testApi.fr/",
            status : false
        }
    }
}
