var index = document.getElementById("index");
var register = document.getElementById("register");
var login = document.getElementById("login");
var browse = document.getElementById("browse");
var advSearch = document.getElementById("adv-search");
var cart = document.getElementById("cart");
var creditCard = document.getElementById("creditCard-register");
var customer = document.getElementById("customer-register");
var checkout = document.getElementById("checkout");
var order_history = document.getElementById("order-history");

function clearHtml(html_id) {

    // for (var i = 0; i < html_id.length; ++i) {
    //     html_id[i].style.display = "none";
    // }
    html_id.style.display = "none";
}

function loadHtml(html_id) {

    // for (var i = 0; i < html_id.length; ++i) {
    //     html_id[i].style.display = "block";
    // }

    html_id.style.display = "block";
}

function clearLoginAndPassword() {
    $(".email-register").val("");
    $(".password-register").val("");

    $(".email-login").val("");
    $(".password-login").val("");
}

function clearSearchBar() {
    $("#quick-search-query").val("");

    $("#adv-search-title").val("");
    $("#adv-search-genre").val("");
    $("#adv-search-year").val("");
    $("#adv-search-director").val("");

}

function setMessage(element, message) {
    element.innerHTML = (message);
}

function resetMessage(element) {
    element.innerHTML = "<p></p>";
}

function redirectToRegister() {

    clearHtml(index);
    clearHtml(login);


    clearHtml(browse);
    clearHtml(advSearch);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();
    resetMessage($register_message);
    loadHtml(register);
    // setMessage($login_message, "Please log in.");
}

function redirectToLogin() {

    clearHtml(index);
    clearHtml(register);
    clearHtml(browse);
    clearHtml(advSearch);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();
    resetMessage($login_message);
    loadHtml(login);
    // setMessage($login_message, "Please log in.");
}

function redirectToQS() {

    clearHtml(login);
    clearHtml(register);
    clearHtml(browse);
    clearHtml(advSearch);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();

    // var $body_content = $("#body-content");
    // $body_content.empty();
    loadHtml(index);
    // setMessage($login_message, "Please log in.");
}

function redirectToBrowse() {

    clearHtml(index);
    clearHtml(login);
    clearHtml(register);
    clearHtml(advSearch);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();

    // var $body_content = $("#body-content");
    // $body_content.empty();

    loadHtml(browse);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        movies_getGenres, null, GET_GENRE_SUCCESS_CODE, retrieveGenresCallback);

    $browse_body_content.empty();
    $browse_body_content.append("<p id='search-message'>Fetching genres...</p>")
}

function redirectToAS() {

    clearHtml(index);
    clearHtml(register);
    clearHtml(login);
    clearHtml(browse);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();
    loadHtml(advSearch);
    // setMessage($login_message, "Please log in.");
}

function redirectToCart() {

    clearHtml(index);
    clearHtml(register);
    clearHtml(login);
    clearHtml(browse);
    clearHtml(advSearch);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);
    clearHtml(order_history);

    clearSearchBar();
    clearLoginAndPassword();
    loadHtml(cart);

    var requestModel = {
        email: Cookies.get("email")
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_retrieve, requestModel, CART_RETRIEVE_SUCCESS_CODE, cartRetrieveCallback);

    var $cart_table = $("#cart-table");
    $cart_table.empty();
    $cart_table.append("<p id='search-message'>Fetching cart...</p>")
}

function redirectToOrder() {

    clearHtml(index);
    clearHtml(register);
    clearHtml(login);
    clearHtml(browse);
    clearHtml(advSearch);
    clearHtml(cart);
    clearHtml(customer);
    clearHtml(creditCard);
    clearHtml(checkout);

    clearSearchBar();
    clearLoginAndPassword();
    loadHtml(order_history);

    var requestModel = {
        email: Cookies.get("email")
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        order_retrieve, requestModel, ORDER_RETRIEVE_SUCCESS_CODE, orderRetrieveCallback);

    var $order_table = $("#order-table");
    $order_table.empty();
    $order_table.append("<p id='search-message'>Fetching orders...</p>")
}