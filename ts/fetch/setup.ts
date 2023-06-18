import $ from "jquery"

export const BASE_RESOURCE_PATH = "./static/game/"
/**
 * Sets up AJAX
 * @category Internal
 */
export function SetupAJAX() {
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