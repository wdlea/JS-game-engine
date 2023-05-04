import $ from "jquery"

export const BASE_RESOURCE_PATH = "http://127.0.0.1:5500/"

export default function SetupAJAX() {
    $.ajaxSetup({
        type: "GET",
        data: {
            'api-key': "a key"
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: false
    })
}