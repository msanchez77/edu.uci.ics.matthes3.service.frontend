$("#cart-table").on('click', '.update-button', function(event) {
    event.preventDefault();

    var id = $(this).text().substring(7);
    var newQuantity = $(this).closest("tr").find("td:eq(1) input[type='number']").val();

    console.log("User wishes to update " + id + " to buy " + newQuantity);

    requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: newQuantity
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_update, requestModel, CART_UPDATE_SUCCESS_CODE, cartUpdateCallback);

});

$("#cart-table").on('click', '.remove-button', function(event) {
    event.preventDefault();

    var id = $(this).text().substring(7);

    console.log("User wishes to remove " + id);

    requestModel = {
        email: Cookies.get("email"),
        movieId: id
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_delete, requestModel, CART_DELETE_SUCCESS_CODE, cartDeleteCallback);

});

$("#clear-button").on('click', function(event) {
    console.log("User wishes to clear their cart.");

    requestModel = {
        email: Cookies.get("email")
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_clear, requestModel, CART_CLEAR_SUCCESS_CODE, cartClearCallback);

});

$("#checkout-button").on('click', function(event) {
    console.log("User wishes to checkout.");

    var userEmail = Cookies.get("email");
    console.log("Checking if " + userEmail + " is a customer...");

    customerRequestModel = {
        email: userEmail
    };

    sendHttpRequest(userEmail, Cookies.get("sessionID"), null, "POST",
        customer_retrieve, customerRequestModel, CUSTOMER_RETRIEVE_SUCCESS_CODE, customerRetrieveCallback);


});



function cartRetrieveCallback(email, data) {
    console.log("Cart Retrieve Callback");

    if (data.resultCode === CART_RETRIEVE_SUCCESS_CODE) {

        var $cart_table = $("#cart-table");
        $cart_table.empty();

        var rowHTML = "<tr><th>Movie Title</th><th>Quantity</th><th>&nbsp;</th><th>&nbsp;</th></tr>";

        var items = data.items;

        for (var i = 0; i < items.length; ++i) {
            rowHTML += "<tr>";

            var m = items[i];

            var q = m["quantity"];

            rowHTML += "<td class='cart-row'>" + m["title"] + "</td>";
            rowHTML += "<td class='cart-row quantity'>" +
                "<input size='1' max='9999' min='1' value=" + q + " type='number' step='1' class='quantity-button'>" +
                "</td>";
            rowHTML += "<td class='cart-row'>" +
                "<button type='button' class='update-button'>Update " + m["movieId"] + "</button>" +
                "</td>";
            rowHTML += "<td class='cart-row'>" +
                "<button type='button' class='remove-button'>Remove " + m["movieId"] + "</button>" +
                "</td>";

            rowHTML += "</tr>";
        }

        rowHTML += "</table>";

        $cart_table.append(rowHTML);


    } else {
        console.log("Sending alert to window.");

        var $cart_table = $("#cart-table");
        $cart_table.empty();

        // var cart_message = "<tr><th>Movie Title</th><th>Quantity</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
        var cart_message = "<p>" + data.message + "</p>";
        $cart_table.append(cart_message);

        // alert(data.message);
    }
}


function cartUpdateCallback(email, data) {

    console.log("Sending alert to window.");
    alert(data.message);

    if (data.resultCode === CART_UPDATE_SUCCESS_CODE) {
        var requestModel = {
            email: Cookies.get("email")
        };

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
            cart_retrieve, requestModel, CART_RETRIEVE_SUCCESS_CODE, cartRetrieveCallback);

        var $cart_table = $("#cart-table");
        $cart_table.empty();
        $cart_table.append("<p id='search-message'>Refreshing cart...</p>")
    }

}

function cartDeleteCallback(email, data) {

    console.log("Sending alert to window.");
    alert(data.message);

    if (data.resultCode === CART_DELETE_SUCCESS_CODE) {
        var requestModel = {
            email: Cookies.get("email")
        };

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
            cart_retrieve, requestModel, CART_RETRIEVE_SUCCESS_CODE, cartRetrieveCallback);

        var $cart_table = $("#cart-table");
        $cart_table.empty();
        $cart_table.append("<p id='search-message'>Refreshing cart...</p>")
    }

}

function cartClearCallback(email, data) {

    console.log("Sending alert to window.");
    alert(data.message);

    if (data.resultCode === CART_CLEAR_SUCCESS_CODE) {

        var $cart_table = $("#cart-table");
        $cart_table.empty();

    }
}