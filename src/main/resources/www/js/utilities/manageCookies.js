// Wanted to check if the user has an active session on their first load of the website.
// However, when clicking on movieid in quick search, that is considered a window.onload,
// so the else clause would be triggered and send an http request.

// Does this work on only the first page load, but then it will
window.onload = function() {

    redirectToQS();
    // if (localStorage.getItem("userFirstSession") === null) {
    //
    //     if (Cookies.get("email") === undefined) {
    //         console.log("No email found in cookies. New user.");
    //
    //         clearHtml(index);
    //         clearHtml(login);
    //         clearHtml(advSearch);
    //         clearHtml(cart);
    //         clearHtml(creditCard);
    //         clearHtml(customer);
    //         clearHtml(order_history);
    //         clearHtml(checkout);
    //
    //     } else {
    //         revalidateUserSession();
    //     }
    //
    //     localStorage.setItem("userFirstSession", "true");
    // } else {
    //     revalidateUserSession();
    // }

};

function revalidateUserSession() {
    console.log("Welcome back, " + Cookies.get("email") + "!");
    console.log("Checking if your current session is active...");

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, checkSessionCallback)
}

function checkSessionCallback(email, data) {
    if (data.resultCode  === SESSION_SUCCESS_CODE) {
        console.log("User has active session!");

        updateCookies(email, data.sessionID);
        clearHtml(login);
        clearHtml(register);
        clearHtml(advSearch);
        clearHtml(cart);
        clearHtml(customer);
        clearHtml(checkout);
        clearHtml(order_history)
        clearHtml(creditCard);


    } else {
        console.log("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

function updateCookies(email, sessionID) {
    Cookies.set("email", email);
    Cookies.set("sessionID", sessionID);

    console.log("Set email cookie to: " + email);
    console.log("Set sessionID cookie to: " + sessionID);
}