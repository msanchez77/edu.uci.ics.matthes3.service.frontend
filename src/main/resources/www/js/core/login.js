$("#login-form").on("submit",function(event) {
    event.preventDefault();
    resetMessage($login_message);

    var email_login = $(".email-login").val();
    var password_login = $(".password-login").val();
    var password_login_array = password_login.split('');
    console.log("Email login: " + email_login);
    console.log("Password login: " + password_login);

    var requestModel = {
        email: email_login,
        password: password_login_array
    };

    sendHttpRequest(null, null, null, "POST",
        idm_login, requestModel, LOGIN_SUCCESS_CODE, loginCallback);

});

$('#login-register-page').on('click', function(event) {
    event.preventDefault();
    clearHtml(login);
    loadHtml(register);
});

$('#login-home-page').on('click', function(event) {
    event.preventDefault();
    clearHtml(login);
    loadHtml(index);
});

function loginCallback(email, data) {
    // console.trace();

    if (data.resultCode === LOGIN_SUCCESS_CODE) {
        clearHtml(login);
        loadHtml(index);

        var $login_link = document.getElementById("login-page-link");
        $login_link.innerHTML = "Logout";

        console.log("Response Model: " + JSON.stringify(data));

        var email_login = $(".email-login").val();

        updateCookies(email_login, data.sessionID);
    } else {
        setMessage($login_message, data.message);
    }

}