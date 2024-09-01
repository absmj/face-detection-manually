import { API } from "../config/services";

export class Endpoint {
    static instance;
    services;
    endpoint;

    constructor() {}

    set currentEndpoint(url) {
        this.endpoint = url
    }

    get currentEndpoint() {
        return `${API}/${this.endpoint}`
    }

    static get(endpoint) {
        if(!this.instance) {
            this.instance = new this;
        }
        this.instance.currentEndpoint = endpoint
        return this.instance;
    }

    get url() {
        return this.currentEndpoint;
    }

    params(params) {
        let url = this.currentEndpoint

        for(let [key, value] in params) {
            const injectParamsValue = new RegExp(`:${key}`, 'gm')
            url.replace(injectParamsValue, value)
        }
    
        return url
    } 
}