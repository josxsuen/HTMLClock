function redirect_init() {
    var params = {};
    var queryString = location.hash.substring(1);
    var regex = /([^&=]+)=([^&]*)/g;
    var m;

    console.log(queryString);

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    console.log(params);

    // Store access_token in localStorage
    if (typeof(Storage) !== 'undefined') {
        localStorage['access_token'] = params['access_token'];
        params['callback_function']();
    }
    else {
        console.log("ERROR: localStorage not supported");
    }

    // window.close();
}
