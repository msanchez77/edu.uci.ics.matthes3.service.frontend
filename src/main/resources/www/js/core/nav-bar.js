$('#home-page-link').on('click', function() {
    console.log("Loading home page");

    event.preventDefault();

    redirectToQS();

});

// ------------------------------------------------------------------------------------------------------

$('#login-page-link').on('click', function() {
    console.log("Loading login page");

    event.preventDefault();

    redirectToLogin();
});

// ------------------------------------------------------------------------------------------------------

$('#register-page-link').on('click', function() {
    console.log("Loading register page");

    event.preventDefault();

    redirectToRegister();
});

// ------------------------------------------------------------------------------------------------------

$('#browse-page-link').on('click', function() {
    console.log("Loading browse page");

    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, browsePageCallback);
});

function browsePageCallback(email, data) {
    if (data.resultCode  === SESSION_SUCCESS_CODE) {
        console.log("User has active session!");

        updateCookies(email, data.sessionID);

        redirectToBrowse();
    } else {
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

// ------------------------------------------------------------------------------------------------------

$('#adv-search-page-link').on('click', function() {
    console.log("Loading adv search page");

    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, advSearchPageCallback);
});

function advSearchPageCallback(email, data) {
    if (data.resultCode  === SESSION_SUCCESS_CODE) {
        console.log("User has active session!");

        updateCookies(email, data.sessionID);

        redirectToAS();
    } else {
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

// ------------------------------------------------------------------------------------------------------

$('#cart-page-link').on('click', function() {
    console.log("Loading cart page for user: " + Cookies.get("email"));

    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, cartPageCallback);
});

function cartPageCallback(email, data) {
    if (data.resultCode  === SESSION_SUCCESS_CODE) {
        console.log("User has active session!");

        updateCookies(email, data.sessionID);

        redirectToCart();
    } else {
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

// ------------------------------------------------------------------------------------------------------

$('#order-page-link').on('click', function() {
    console.log("Loading orders page for user: " + Cookies.get("email"));

    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, orderPageCallback);


});

function orderPageCallback(email, data) {
    if (data.resultCode  === SESSION_SUCCESS_CODE) {
        console.log("User has active session!");

        updateCookies(email, data.sessionID);

        redirectToOrder();
    } else {
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}