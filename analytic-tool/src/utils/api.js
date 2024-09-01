
import axios from 'axios';
import { UiContext } from '../store/context/store';
import { Endpoint } from './endpoint';
import { services } from '../config/services';


const createReport = async () => {
    try {

    } catch {

    } finally {

    }
}

export const folderListFetch = async () => {
    console.log(Endpoint.get(services.folder_list))
    const request = await axios.get(Endpoint.get(services.folder_list).url)
    return request?.data?.data
}

export const dbListFetch = async () => {
    const request = await axios.get(Endpoint.get(services.db_list).url)
    return request?.data?.data
}

export const cronListFetch = async () => {
    const request = await axios.get(Endpoint.get(services.cron_list).url)
    return request?.data?.data
}

export const reportListFetch = async () => {
    console.log(Endpoint.get(services.report_list).url)
    const request = await axios.get(Endpoint.get(services.report_list).url)
    return request?.data?.data
}

export const pageListFetch = async () => {
    const request = await axios.get(Endpoint.get(services.page_list).url)
    return request?.data?.data
}

export const catchAsync = async  ({
    endpoint,
    params,
    headers,
    data,
    method,
    uiContext,
    onSuccess,
    onError,
    onFinally
}) => {
    const [ui, setUi] = uiContext;
    try {
        console.log(data)
        method = String(method).toLowerCase()
        if(!["post", "put", "patch", "delete", "get"].includes(method)) {
            throw new Error("Method doesn't allowed")
        }
        setUi({...ui, loading: true})
        const request = await axios[method](endpoint, (data instanceof Function) ? data() : data, {
            headers
        })
        setUi({...ui, success: 'Əməliyyat yerinə yetirildi'})
        onSuccess instanceof Function && onSuccess();
        return request.data

    } catch(e) {

        setUi({...ui, error: e.message})
        onError instanceof Function && onError();
    } finally {
        setUi(prev => ({...prev, loading: false}))
        onFinally instanceof Function && onFinally();
    }
}