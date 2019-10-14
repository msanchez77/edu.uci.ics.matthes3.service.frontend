$("#creditCard-form").on("submit", function(event) {
    event.preventDefault();
    resetMessage($creditCard_message);

    var cc_id = $(".cc-id").val();
    var cc_firstName = $(".cc-firstName").val();
    var cc_lastName= $(".cc-lastName").val();
    var cc_expiration = $(".cc-expiration").val();

    console.log("Credit Card ID: " + cc_id);
    console.log("Credit Card First Name: " + cc_firstName);
    console.log("Credit Card Last Name: " + cc_lastName);
    console.log("Credit Card Expiration: " + cc_expiration);

    var requestModel = {
        id: cc_id,
        firstName: cc_firstName,
        lastName: cc_lastName,
        expiration: cc_expiration
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        creditCard_insert, requestModel, CREDITCARD_INSERT_SUCCESS_CODE, ccInsertCallback);
});


function ccInsertCallback(email, data) {

    if (data.resultCode === CREDITCARD_INSERT_SUCCESS_CODE) {
        // Redirect to add customer info

        console.log("User successfully inserted credit card. Redirecting to customer registration form...");
        clearHtml(creditCard);
        loadHtml(customer)

    } else {
        setMessage($creditCard_message, data.message);
    }
}