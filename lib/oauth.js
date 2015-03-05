var client_id;
var type;
var callback_function;

function init(object) {
    client_id         = object['client_id'];
    type              = object['type'];
    callback_function = object['callback_function'];
}

function login() {
    login_window = window.open('https://api.imgur.com/oauth2/authorize?client_id=' +
        client_id + '&response_type=' + type);
    login_window.addEventListener('callback', callback_function, false);
}
