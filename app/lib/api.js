class Api {
    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
        }
    }

    // static BASE_URL = 'http://192.168.1.102:3000';
    static BASE_URL = 'http://159.89.161.117';

    static get(route) {
        return this.xhr(route, null, 'GET');
    }

    static put(route, params) {
        return this.xhr(route, params, 'PUT')
    }

    static patch(route, params) {
        return this.xhr(route, params, 'PATCH')
    }

    static post(route, params) {
        return this.xhr(route, params, 'POST')
    }

    static delete(route, params) {
        return this.xhr(route, params, 'DELETE')
    }

    static xhr(route, params, verb) {
        const host = `${Api.BASE_URL}/api/v1`;
        const url = `${host}${route}`;
        let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null );
        options.headers = Api.headers();
        return fetch(url, options).then( resp => {
            let json = resp.json();
            if (resp.ok) {
                return json
            }
            return json.then(err => {throw err});
        }).then( json => json );
    }
}

export default Api;