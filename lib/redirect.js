function redirect_init() {
    var params = {};
    var queryString = location.hash.substring(1);
    var regex = /([^&=]+)=([^&]*)/g;
    var m;

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    // Store access_token in localStorage
    if (typeof(Stroage) !== 'undefined') {
        if (params['access_token']) {
            localStorage['access_token'] = params['access_token'];
        }
        else {
            console.log("ERROR: no access_token");
        }

        if (params['callback_function']) {
            params['callback_function']();
        }
        else {
            console.log("ERROR: no callback_function");
        }
    }
    else {
        console.log("ERROR: localStorage not supported");
    }

    window.close();
}
