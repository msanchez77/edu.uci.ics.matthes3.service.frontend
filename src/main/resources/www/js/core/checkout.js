$("#checkout-confirmation-button").on('click', function(event) {

    event.preventDefault();

    console.log("User confirmed checkout!");

    requestModel = {
        email: Cookies.get("email")
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        order_place, requestModel, ORDER_PLACE_SUCCESS_CODE, orderPlaceCallback);

    var $checkout_message = $("#checkout-message");
    $checkout_message.empty();

    $checkout_message.append("Processing order...");

});

$("#checkout-body").on('click', '#paypal-link', function(event) {

    console.log("User has redirected to PayPal");

    var $checkout_message = $("#checkout-message");
    $checkout_message.empty();

    var messageHTML = "Thank you! Order complete!";

    $checkout_message.append(messageHTML);

});


function orderPlaceCallback(email, data) {

    if (data.resultCode === ORDER_PLACE_SUCCESS_CODE) {
        console.log(data.message);

        console.log("Redirect URL: " + data.redirectURL);

        var $checkout_message = $("#checkout-message");
        $checkout_message.empty();

        var messageHTML = "Congratulations, order placed! Please complete payment at <a href=" + data.redirectURL +
            " id='paypal-link' target='_blank'>PayPal</a>";
        $checkout_message.append(messageHTML);

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }
}