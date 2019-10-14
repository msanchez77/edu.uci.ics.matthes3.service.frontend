$("#register-form").on("submit", function(event) {
    event.preventDefault();
    resetMessage($register_message);

    var email_register = $(".email-register").val();
    var password_register = $(".password-register").val();
    var password_register_array = password_register.split('');
    console.log("Email register: " + email_register);
    console.log("Password register: " + password_register);

    var requestModel = {
        email: email_register,
        password: password_register_array
    };

    sendHttpRequest(null, null, null, "POST",
        idm_register, requestModel, REGISTER_SUCCESS_CODE, registerCallback);
});

$('#register-login-page').on('click', function(event) {
    event.preventDefault();
    clearHtml(register);
    loadHtml(login);
});

$('#register-home-page').on('click', function(event) {
    event.preventDefault();
    clearHtml(register);
    loadHtml(index);
});

function registerCallback(email, data) {
    // console.trace();

    if (data.resultCode === REGISTER_SUCCESS_CODE) {
        clearHtml(register);

        resetMessage($login_message);
        loadHtml(login)
    } else {
        setMessage($register_message, data.message);
    }
}

