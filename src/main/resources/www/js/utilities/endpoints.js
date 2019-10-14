var idm_register = "http://andromeda-73.ics.uci.edu:8297/api/g/idm/register";
var idm_login = "http://andromeda-73.ics.uci.edu:8297/api/g/idm/login";
var idm_session = "http://andromeda-73.ics.uci.edu:8297/api/g/idm/session";
var idm_privilege = "http://andromeda-73.ics.uci.edu:8297/api/g/idm/privilege";


var movies_searchMovie = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/search?";      // Query Parameter
var movies_getMovie = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/get/";            // Path Parameter
var movies_addMovie = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/add";
var movies_deleteMovie = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/delete/";      // Path Parameter
var movies_getGenres = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/genre";
var movies_addGenre = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/genre/add";
var movies_getMovieGenre = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/genre/";     // Path Parameter
var movies_searchStar = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/star/search?";  // Query Parameter
var movies_getStar = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/star/";            // Path Parameter
var movies_addStar = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/star/add";
var movies_addStarToMovie = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/star/starsin";
var movies_getRating = "http://andromeda-73.ics.uci.edu:8297/api/g/movies/rating";


function addQuickSearchParameter(currentURL, type, query) {
    var url = new URL(currentURL);
    url.searchParams.append(type, query);

    return url;
}

function setParameter(currentURL, type, query) {
    var url = new URL(currentURL);
    url.searchParams.set(type, query);

    return url;
}


var cart_insert = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/cart/insert";
var cart_update = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/cart/update";
var cart_delete = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/cart/delete";
var cart_retrieve = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/cart/retrieve";
var cart_clear = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/cart/clear";

var creditCard_insert = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/creditcard/insert";
var creditCard_update = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/creditcard/update";
var creditCard_delete = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/creditcard/delete";
var creditCard_retrieve = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/creditcard/retrieve";

var customer_insert = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/customer/insert";
var customer_update = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/customer/update";
var customer_retrieve = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/customer/retrieve";

var order_place = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/order/place";
var order_retrieve = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/order/retrieve";
var order_complete = "http://andromeda-73.ics.uci.edu:8297/api/g/billing/order/complete";