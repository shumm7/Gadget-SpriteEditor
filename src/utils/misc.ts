namespace Misc {
    export function deepClone<T = Object>(obj: T): T {
        try {
            return window.structuredClone(obj)
        } catch (e) {
            console.warn(e)
            return obj
        }
    }

    export function retryableRequest(request: any, delay: number = 1000, retries: number = 1) {
        var deferred = $.Deferred()
        var curRequest: any
        var timeout: NodeJS.Timeout
        var attemptRequest = function (attempt: number) {
            ;(curRequest = request()).then(deferred.resolve, function (code: any, data: any) {
                if (attempt <= retries) {
                    timeout = setTimeout(function () {
                        attemptRequest(++attempt)
                    }, delay)
                } else {
                    deferred.reject(code, data)
                }
            })
        }
        attemptRequest(1)

        return deferred.promise({
            abort: function () {
                if (curRequest.abort) {
                    curRequest.abort()
                }
                clearTimeout(timeout)
            },
        })
    }
}

export default Misc
