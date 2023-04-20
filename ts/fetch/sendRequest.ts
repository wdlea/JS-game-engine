/**
 * Contains the send request method
 */

import $ from "jquery"


export function GetData(path: string, method: string = "GET"): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            $.ajax({
                url: path,
                method: method,
                success: resolve,
                error: reject
            })
        }
    )
}