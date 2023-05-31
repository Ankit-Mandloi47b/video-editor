import axios from "axios";

const BASE_URL = "http://localhost:3030/";

const Text_Content_EndPoint = "text-content"

const url = BASE_URL+ Text_Content_EndPoint
export async function postTextContent(obj) {
    console.log('api piostt', obj)
    try {
        return await axios.post(url, obj)
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
}

export async function getTextContent(id) {
    try {
        return await axios.get(url, {params:{id}})
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }   
}

const Upload_File = "/upload"

export async function uploadFile(file) {
    const url = BASE_URL + Upload_File
    try {
        return await axios.post(url, file)
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }   
}