$("#customer-form").on("submit", function(event) {
    event.preventDefault();
    resetMessage($customer_message);

    var c_firstName = $(".customer-firstName").val();
    var c_lastName= $(".customer-lastName").val();
    var c_id = $(".customer-cc-id").val();
    var c_address = $(".customer-address").val();

    console.log("Customer First Name: " + c_firstName);
    console.log("Customer Last Name: " + c_lastName);
    console.log("Customer ID: " + c_id);
    console.log("Customer Address: " + c_address);

    var requestModel = {
        email: Cookies.get("email"),
        firstName: c_firstName,
        lastName: c_lastName,
        ccId: c_id,
        address: c_address
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        customer_insert, requestModel, CUSTOMER_INSERT_SUCCESS_CODE, customerInsertCallback);
});


function customerRetrieveCallback(email, data) {

    console.log("Customer Retrieve Callback");

    if (data.resultCode === CUSTOMER_RETRIEVE_SUCCESS_CODE) {
        // Redirect to checkout page
        clearHtml(cart);
        loadHtml(checkout);

    } else {
        // Redirect to create new customer page
        // ---- First page is to add a credit card
        // ---- Second page is to add your customer info (Handled by the credit card form)
        // Redirect to checkout page (Handled by customer form)

        clearHtml(cart);
        loadHtml(creditCard);
    }
}

function customerInsertCallback(email, data) {
    console.log("Customer Insert Callback");

    if (data.resultCode === CUSTOMER_INSERT_SUCCESS_CODE) {
        // Redirect to checkout page
        clearHtml(customer);
        loadHtml(checkout);


    } else
        setMessage($creditCard_message, data.message);

}

