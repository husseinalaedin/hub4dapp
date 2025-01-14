import axios from "axios";
import React, { useEffect, useState } from "react";
import { IP } from "../global/G";
import { initLang } from "../global/Misc";

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt');
        if (token && config.headers && config.headers) {
            config.headers['Authorization'] = token;
        }
        if (config.headers && config.headers) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

axios.interceptors.response.use(
    (response) => {
        // block to handle success case
        return response
    },
    (error) => { // block to handle error case
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && originalRequest.url.indexOf('auth/token') >= 0) {
            // Added this condition to avoid infinite loop 
            // Redirect to any unauthorised route to avoid infinite loop...
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Code inside this block will refresh the auth token

            originalRequest._retry = true;
            const refreshToken = 'xxxxxxxxxx'; // Write the  logic  or call here the function which is having the login to refresh the token.
            return axios.post('/auth/token',
                {
                    "refresh_token": refreshToken
                })
                .then(res => {
                    if (res.status === 201) {
                        localStorage.setItem('jwt', res.data);
                        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwt');
                        return axios(originalRequest);
                    }
                })
        }
        return Promise.reject(error);
    });

export const useAxiosGet = (url2, params) => {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [getError, setGetError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOut, setIsLoadingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);
    const [errorCode, setErroCode] = useState<any>(null);
    const [getStamp, setGetStamp] = useState<any>(null);
    const [canceled, setCanceled] = useState<any>(false);
    // const [paramsData, setParamsData] = useState<any>(params);
    const [url, setUrl] = useState(url2)
    useEffect(() => {
        if (!getStamp) {
            return
        }
        let isMounted = true;

        // const signal = abortController.signal;
        // const abortController = new AbortController();

        const source = axios.CancelToken.source();
        let errorMsg: any = null
        const getData = async (url, paramsData) => {
            setIsLoading(true);
            setIsLoadingOut(true)
            setErrorMessage(null)
            setErroCode(null)
            setSucceeded(false);
            setData([])
            const abortController = new AbortController();
            // const signal = abortController.signal;
            try {
                let headers = await headers_out()

                const response = await axios.get(url, {
                    cancelToken: source.token,
                    // cancelToken: signal.,
                    headers,
                    params: paramsData 
                });
                if (isMounted) {
                    setData(response.data);
                    setGetError(null);
                    setSucceeded(true)
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err && err.response && err.response.data && err.response.data.errordetected) {
                        setGetError(err.response.data);
                        if (err.response.data.error_code && err.response.data.error_code != '')
                            setErroCode(err.response.data.error_code)
                        errorMsg = err.response.data.message
                        console.log("errorMsg:",errorMsg);
                    }

                    else {
                        errorMsg = (err && err.message ? err.message : 'Unknown error,something went wrong!...') + `[${url}]`
                        setGetError({ message: errorMsg });
                    }
                    setData([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                    if (errorMessage || errorMsg)
                        setIsLoadingOut(false)
                }
            }
            if (!errorMessage)
                setErrorMessage(errorMsg)
        }
        if (!canceled)
            getData(url, params);
        else {
            source.cancel();
            setIsLoading(false)
            setIsLoadingOut(false)
        }
        const cleanUp = () => {
            isMounted = false;
            source.cancel();
        }

        return cleanUp;
    }, [getStamp, canceled]);
    const executeGet = ({ url_e = null, fwhenCompleted = null }: { url_e?: any, fwhenCompleted?: any } = {}) => {
        if (url_e && url_e != undefined)
            setUrl(url_e)

        setCanceled(false)
        setGetStamp((new Date()).getTime())
    }
    const getData2 = () => {
        return data
    }
    const cancel = () => {
        setCanceled(true)
    }
    return { data, setData, getData2, getError, isLoading, succeeded, errorMessage, errorCode, executeGet, cancel, canceled, isLoadingOut, setIsLoadingOut};
}

export const useAxiosPost = (url2, values) => {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [postError, setPostError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);
    const [errorCode, setErroCode] = useState<any>(null);
    const [postStamp, setPostStamp] = useState<any>(null);
    const [url, setUrl] = useState(url2)
    const [canceled, setCanceled] = useState<any>(false);
    const [age, setAge] = useState<any>(-1);
    const [ageTick, setAgeTick] = useState<any>(-1);
    // let body = values?values[0]:null;
    let whenCompleted: any = null

    useEffect(() => {
        if (!postStamp) {
            return
        }

        let isMounted = true;
        const source = axios.CancelToken.source();
        let errorMsg: any = null
        const postData = async (url:string, body) => {
            setIsLoading(true);
            setErrorMessage(null)
            setErroCode(null)
            setSucceeded(false);
            setData([])

            try {
                let headers = await headers_out()
                const response = await axios.post(url, body,
                    {
                        cancelToken: source.token,
                        headers: headers,
                        withCredentials: url.toLocaleLowerCase().indexOf('sign_in') >= 0 || url.toLocaleLowerCase().indexOf('sign_out') >= 0 || url.toLocaleLowerCase().indexOf('refresh_token') >= 0

                    });
                if (isMounted) {
                    headers_in(response.headers)
                    setData(response.data);
                    setPostError(null);
                    setSucceeded(true);
                    if (whenCompleted) {
                        whenCompleted({ data, postError, isLoading, succeeded, errorMessage, errorCode })
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err && err.response && err.response.data && err.response.data.errordetected) {
                        setPostError(err.response.data);
                        if (err.response.data.error_code && err.response.data.error_code != '') {
                            setErroCode(err.response.data.error_code)
                        }
                        errorMsg = err.response.data.message
                    }

                    else {
                        errorMsg = 'Unknown error,something went wrong!...'
                        setPostError({ message: err && err.message ? err.message : errorMsg });
                    }
                    setData([]);
                    if (whenCompleted) {
                        whenCompleted({ data, postError, isLoading, succeeded, errorMessage, errorCode })
                    }
                }
            } finally {
                isMounted && setIsLoading(false);
            }
            setErrorMessage(errorMsg)
        }

        const cleanUp = () => {
            isMounted = false;
            source.cancel();
        }
        try {
            if (!canceled)
                postData(url, values);
            else {
                source.cancel();
                setIsLoading(false)
                setAgeTick(-1)
                setAge(-1)
            }

        } catch (error) {
            errorMsg = 'Unknown error,something went wrong!.'
            setPostError({ message: errorMsg });
        }
        return cleanUp;
    }, [postStamp, canceled]);
    useEffect(() => {
        if (ageTick > 0 && isLoading) {
            const timer = setTimeout(() => {
                setAge((new Date()).getTime() - postStamp)
            }, ageTick);
            return () => clearTimeout(timer);
        }
    }, [ageTick, age, canceled, isLoading])
    const executePost = ({ url_e = null, fwhenCompleted = null, ageTick = -1 }: { url_e?: any, fwhenCompleted?: any, ageTick?: number } = {}) => {
        // const { url_e, fwhenCompleted } = extended_param
        if (url_e && url_e != undefined)
            setUrl(url_e)
        whenCompleted = fwhenCompleted;
        setCanceled(false)
        setAge(-1)
        setAgeTick(ageTick)
        setPostStamp((new Date()).getTime())

    }
    const cancel = () => {
        setCanceled(true)
    }
    return { data, setData,postError, isLoading, succeeded, errorMessage, errorCode, executePost, cancel, canceled, age };
}
export const useAxiosPut = (url2, values) => {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [putError, setPutError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);
    const [errorCode, setErroCode] = useState<any>(null);
    const [putStamp, setPutStamp] = useState<any>(null);
    const [whenCompleted, setWhenCompleted] = useState<any>(null);
    const [url, setUrl] = useState(url2)
    const [canceled, setCanceled] = useState<any>(false);
    // let body = values?values[0]:null;
    // let whenCompleted: any = null

    useEffect(() => {
        if (!putStamp) {
            return
        }

        let isMounted = true;
        const source = axios.CancelToken.source();
        let errorMsg: any = null
        const putData = async (url, body) => {
            setIsLoading(true);
            setErrorMessage(null)
            setErroCode(null)
            setSucceeded(false);
            setData([])
            try {
                let headers = await headers_out()
                const response = await axios.put(url, body,
                    {
                        cancelToken: source.token,
                        headers: headers

                    });
                if (isMounted) {

                    headers_in(response.headers)
                    setData(response.data);
                    setPutError(null);
                    setSucceeded(true);
                    if (whenCompleted) {
                        whenCompleted({ data: response.data, putError, isLoading, succeeded: true, errorMessage, errorCode })
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err && err.response && err.response.data && err.response.data.errordetected) {
                        setPutError(err.response.data);
                        if (err.response.data.error_code && err.response.data.error_code != '') {
                            setErroCode(err.response.data.error_code)
                        }
                        errorMsg = err.response.data.message
                    }

                    else {
                        errorMsg = 'Unknown error,something went wrong!...'
                        setPutError({ message: err && err.message ? err.message : errorMsg });
                    }
                    setData([]);
                    if (whenCompleted) {
                        whenCompleted({ data, putError, isLoading, succeeded, errorMessage, errorCode })
                    }
                }
            } finally {
                isMounted && setIsLoading(false);
            }
            setErrorMessage(errorMsg)
        }

        const cleanUp = () => {
            isMounted = false;
            source.cancel();
        }
        try {

            if (!canceled)
                putData(url, values);
            else {
                source.cancel();
                setIsLoading(false)
            }
        } catch (error) {
            errorMsg = 'Unknown error,something went wrong!.'
            setPutError({ message: errorMsg });
        }
        return cleanUp;
    }, [putStamp, canceled]);
    const executePut = (url_e?, fwhenCompleted?) => {
        if (url_e && url_e != undefined)
            setUrl(url_e)
        setWhenCompleted(() => {
            return fwhenCompleted
        });
        setCanceled(false)
        setPutStamp((new Date()).getTime())

    }
    const cancel = () => {
        setCanceled(true)
    }
    return { data, setData, putError, isLoading, succeeded, errorMessage, errorCode, executePut, cancel, canceled };
}
export const axios_get = async (url, params , whenCompleted, whenError) => {
    const source = axios.CancelToken.source();
    let headers = await headers_out()
    const response = await axios.get(url,
        {
            cancelToken: source.token,
            headers: headers,
            params: params

        }).then((response: any) => {
            if (whenCompleted)
                whenCompleted({ data: response.data })
        }).catch((err) => {
            if (!whenError)
                return
            if (err && err.response && err.response.data && err.response.data.errordetected) {
                whenError(err.response.data);
            }
            else {
                let errorMsg = 'Unknown error,something went wrong!...'
                whenError({ message: errorMsg })
            }
        });
}
export const axios_put = async (url, data, whenCompleted, whenError) => {
    const source = axios.CancelToken.source();
    let headers = await headers_out()
    const response = await axios.put(url, data,
        {
            cancelToken: source.token,
            headers: headers

        }).then((response: any) => {
            if (whenCompleted)
                whenCompleted({ data: response.data })
        }).catch((err) => {
            if (!whenError)
                return
            if (err && err.response && err.response.data && err.response.data.errordetected) {
                whenError(err.response.data);
            }
            else {
                let errorMsg = 'Unknown error,something went wrong!...'
                whenError({ message: errorMsg })
            }
        });
}

const headers_out = async () => {
    let headers = {
        lang: initLang()// localStorage.getItem("i18nextLng") || "en"
    }
    let dcb = localStorage.getItem("d-c-b-etag")
    if (dcb && dcb !== '')
        headers['d-c-b-etag'] = dcb;
    let ip = await IP.get_ip()
    if (ip && ip !== '')
        headers['agent_ip'] = ip;
    return headers
}
const headers_in = (headers) => {
    if (!headers)
        return
    let dcb = headers['d-c-b-etag'];
    if (dcb && dcb != '') {
        localStorage.setItem("d-c-b-etag", dcb)
    }
}
const handleError = (error_code) => {
    switch (error_code) {
        case 'TOKEN_EXPIRED_RENEW':
            break;
        default: ;
    }
}
export const useAxiosPost_deleted = (url, values, postStamp) => {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const [postError, setPostError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);
    const [errorCode, setErroCode] = useState<any>(null);
    // const [postStamp, setPostStamp] = useState<any>(null);
    // let body = values?values[0]:null;

    useEffect(() => {
        if (!postStamp) {
            return
        }

        let isMounted = true;
        const source = axios.CancelToken.source();
        let errorMsg: any = null
        const postData = async (url, body) => {
            setIsLoading(true);
            setErrorMessage(null)
            setErroCode(null)
            setSucceeded(false);
            setData([])
            try {
                const response = await axios.post(url, body,
                    {
                        cancelToken: source.token,
                        headers: { lang: localStorage.getItem("i18nextLng") || "en" }
                    });
                if (isMounted) {
                    setData(response.data);
                    setPostError(null);
                    setSucceeded(true)
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err && err.response && err.response.data && err.response.data.errordetected) {
                        setPostError(err.response.data);
                        if (err.response.data.code && err.response.data.code != '')
                            setErroCode(err.response.data.code)
                        errorMsg = err.response.data.message
                    }

                    else {
                        errorMsg = 'Unknown error,something went wrong!.'
                        setPostError({ message: err && err.message ? err.message : errorMsg });
                    }
                    setData([]);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
            setErrorMessage(errorMsg)
        }

        const cleanUp = () => {
            isMounted = false;
            source.cancel();
        }
        try {
            postData(url, values);
        } catch (error) {
            errorMsg = 'Unknown error,something went wrong!.'
            setPostError({ message: errorMsg });
        }
        return cleanUp;
    }, [postStamp]);

    return { data, postError, isLoading, succeeded, errorMessage, errorCode };
}
