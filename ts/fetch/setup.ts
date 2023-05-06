import $ from "jquery"

export const BASE_RESOURCE_PATH = "http://127.0.0.1:5500/dist/static/game/"
/**
 * Sets up AJAX
 * @category Internal
 */
export default function SetupAJAX() {
    $.ajaxSetup({
        type: "GET",
        data: {
            'api-key': "a key that is very secure and 100% hidden from the user and anyone that wants to use my resources"
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: false
    })
}