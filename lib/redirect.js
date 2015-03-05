function redirect_init() {
    var params = {};
    var queryString = location.hash.substring(1);
    var regex = /([^&=]+)=([^&]*)/g;
    var m;

    if (queryString !== '') {
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        if (typeof(Storage) !== 'undefined') {
            localStorage['access_token'] = params['access_token'];
        }
        else {
            console.log("ERROR: localStorage not supported");
        }
    }
    else {
        console.log("ERROR: access denied");
    }

    // window.close();
}
