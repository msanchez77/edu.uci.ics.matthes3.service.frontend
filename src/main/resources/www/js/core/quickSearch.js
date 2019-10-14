var qs_page = 1;
var qs_url = "";

$("#quick-search-form").on("submit", function(event) {
    event.preventDefault();

    if (Cookies.get("sessionID") === undefined) {
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
        return;
    }

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, quickSearchButtonCallback);
});

function quickSearchButtonCallback(email, data) {

    if (data.resultCode === SESSION_SUCCESS_CODE) {
        updateCookies(Cookies.get("email"), data.sessionID);

        qs_page = 1;
        qs_url = "";

        var $qs_param = $("#quick-search-param").val();
        var $qs_query = $("#quick-search-query").val();
        var $qs_orderby = $("#quick-search-orderby").val();
        var $qs_direction = $("#quick-search-direction").val();
        var $qs_limit = $("#quick-search-limit").val();

        if ($qs_param === "title")
            console.log("Searching for movie title: " + $qs_query);
        else
            console.log("Searching movies with genre: " + $qs_query);

        console.log("Orderby: " + $qs_orderby);
        console.log("Direction: " + $qs_direction);
        console.log("Limit: " + $qs_limit);

        qs_url = addQuickSearchParameter(movies_searchMovie, $qs_param, $qs_query);
        qs_url = addQuickSearchParameter(qs_url, "limit", $qs_limit);
        qs_url = addQuickSearchParameter(qs_url, "orderby", $qs_orderby);
        qs_url = addQuickSearchParameter(qs_url, "direction", $qs_direction);
        console.log("Constructed url: " + qs_url);

        console.log("User: " + Cookies.get("email"));
        console.log("Session ID: " + Cookies.get("sessionID"));

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

        $body_content.empty();
        $body_content.append("<p id='search-message'>Searching for movie...</p>")
    } else {
        console.log("User has inactive session. Redirecting to login page...");
        alert("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

$("#body-content").on('click', '.movieId-button', function(event) {
    event.preventDefault();

    var movieId = $(this).text();
    console.log("User clicked on movieId: " + movieId);

    var getMovieDetails_url = movies_getMovie + movieId;
    console.log("Constructed url: " + getMovieDetails_url);

    console.log("User: " + Cookies.get("email"));
    console.log("Session ID: " + Cookies.get("sessionID"));

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        getMovieDetails_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieGetCallback);

    $body_content.empty();
    $body_content.append("<p id='search-message'>Fetching movie details...</p>")
});

$("#body-content").on('click', '#qs-previous-button', function(event) {

    console.log("User clicked previous page button.");

    var new_offset = (qs_page-2)*($("#quick-search-limit").val());
    console.log("New previous offset: " + new_offset);

    qs_url = setParameter(qs_url, "offset", new_offset);
    console.log("Offset URL: " + qs_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

    qs_page--;

    $body_content.empty();
    $body_content.append("<p id='search-message'>Retrieving previous page...</p>")
});

$("#body-content").on('click', '#qs-next-button', function(event) {

    console.log("User clicked next page button.");

    var new_offset = qs_page*($("#quick-search-limit").val());
    console.log("New next offset: " + new_offset);

    qs_url = setParameter(qs_url, "offset", new_offset);
    console.log("Offset URL: " + qs_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

    qs_page++;

    $body_content.empty();
    $body_content.append("<p id='search-message'>Retrieving next page...</p>")
});

$("#quick-search-orderby").on("change", function(event) {
    console.log("User change orderby parameter to " + $(this).val());
    console.log("Current qs_url: " + qs_url);

    if (qs_url !== "") {
        qs_url = setParameter(qs_url, "orderby", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

        $body_content.empty();
        $body_content.append("<p id='search-message'>Reordering results by " + $(this).val() + "...</p>")
    }


});

$("#quick-search-direction").on("change", function(event) {
    console.log("User change direction parameter.");
    console.log("Current qs_url: " + qs_url);

    if (qs_url !== "") {
        qs_url = setParameter(qs_url, "direction", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

        $body_content.empty();
        $body_content.append("<p id='search-message'>Reordering results to " + $(this).val() + "...</p>")
    }


});

$("#quick-search-limit").on("change", function(event) {
    console.log("User change limit parameter.");
    console.log("Current qs_url: " + qs_url);

    if (qs_url !== "") {
        qs_url = setParameter(qs_url, "limit", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            qs_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieQuickSearchCallback);

        $body_content.empty();
        $body_content.append("<p id='search-message'>Adjusting number of results per page to " + $(this).val() + "...</p>")
    }
});


function movieQuickSearchCallback(email, data) {
    // console.trace();

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {

        $body_content.empty();

        var rowHTML = "<table><tr><th>Movie ID</th><th>Title</th><th>Director</th>" +
            "<th>Year</th><th>Rating</th><th># Votes</th><th>&nbsp;</th><th>&nbsp;</th>";

        var movieList = data.movies;

        for (var i = 0; i < movieList.length; ++i) {
            rowHTML += "<tr>";
            var m = movieList[i];

            rowHTML += "<td class='id-col'><button type='button' class='movieId-button'>" + m["movieId"] + "</button></td>";
            rowHTML += "<td class='str-col'>" + m["title"] + "</td>";
            rowHTML += "<td class='str-col'>" + m["director"] + "</td>";
            rowHTML += "<td class='int-col'>" + m["year"] + "</td>";
            rowHTML += "<td class='rating-col'>" + m["rating"] + "</td>";
            rowHTML += "<td class='int-col'>" + m["numVotes"] + "</td>";
            rowHTML += "<td class='id-col'><button type='button' id='qsPage-cart-button'>Add " + m["movieId"] + "!</button></td>";
            rowHTML += "<td class='int-col'><input size='1' max='9999' min='1' value='1' type='number' step='1' class='qsPage-cart-quantity'/></td>";

            rowHTML += "</tr>";
        }

        rowHTML += "</table>";

        $body_content.append(rowHTML);

        if (data.numResults > movieList.length) {
            // Pagination required

            var pagination = "<h3>" + qs_page + "</h3>";

            if (qs_page !== 1) {
                console.log("Adding previous button.");

                pagination += "<button type='button' id='qs-previous-button'>Previous Page</button>";
            }

            if ((qs_page*($("#quick-search-limit").val())) < data.numResults) {
                console.log("Adding next button.");

                pagination += "<button type='button' id='qs-next-button'>Next Page</button>";
            }

            $body_content.append(pagination);

        }

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }
}

$("#body-content").on('click', '#qsPage-cart-button', function(event) {
    event.preventDefault();

    var id = $(this).text().substring(4,13);
    var numOrder = $(this).parent().parent().find('input[type=number]').val();

    console.log("User wants to add " + numOrder + " " + id + " to their cart.");

    var requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: numOrder
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, qsCartPageInsertCallback);
});

function qsCartPageInsertCallback(email, data) {

    console.log("QS Page Cart Insert Callback");

    alert(data.message);
}

$("#body-content").on('click', '#qs-cart-button', function(event) {
    event.preventDefault();

    var id = $("#qs-movieId").text().substring(4);
    var numOrder = $("#qs-cart-quantity").val();

    console.log("User wants to add " + numOrder + " " + id + " to their cart.");

    var requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: numOrder
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, cartInsertCallback);
});

$("#body-content").on('click', '#qs-rating-button', function(event) {
    event.preventDefault();

    var movieId = $("#qs-movieId").text().substring(4);
    var user_score = $("#qs-rating-score").val();

    console.log("User wants to rate " + movieId + " " + user_score + "/10.");

    var requestModel = {
        id: movieId,
        rating: user_score
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        movies_getRating, requestModel, MOVIE_RATING_SUCCESS_CODE, ratingUpdateCallback);


});


function movieGetCallback(email, data) {

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {

        $body_content.empty();

        var movieInfo = data.movie;

        var newHtml = "<h2 id='movie-title'>" + movieInfo.title + "</h2>";

        newHtml += "<div class='movie-description'>" +
            "<button type='button' id='qs-cart-button'>Add to Cart!</button>" +
            "<input size='1' max='9999' min='1' value='1' type='number' step='1' id='qs-cart-quantity'>" +
            "<button type='button' id='qs-rating-button'>Submit Rating!</button>" +
            "<input size='1' max='10.0' min='0.0' value='5.0' type='number' step='0.1' id='qs-rating-score'>" +
            "<div id='qs-movie-info-message'>&nbsp;</div>" +
            "<ul class='movie-info'>" +
            "<li id='qs-movieId'><strong>Id</strong>: " + movieInfo.movieId + "</li>" +
            "<li><strong>Director</strong>: " + movieInfo.director + "</li>" +
            "<li><strong>Year</strong>: " + movieInfo.year + "</li>" +
            "<li><strong>Rating</strong>: " + movieInfo.rating + "</li>" +
            "<li><strong># Votes</strong>: " + movieInfo.numVotes + "</li>";

        if (movieInfo.budget !== undefined)
            newHtml +=      "<li><strong>Budget</strong>: " + movieInfo.budget + "</li>";
        if (movieInfo.revenue !== undefined)
            newHtml +=      "<li><strong>Revenue</strong>: " + movieInfo.revenue + "</li>";

        newHtml += addArrayToHtml("genres", movieInfo.genres);
        newHtml += addArrayToHtml("stars", movieInfo.stars);

        newHtml +=      "</ul>" +
            "</div>" +
            "<div class='movie-description'>";

        if (movieInfo.overview === undefined)
            newHtml += "<p id='qs-movie-overview'><em>No overview found.</em></p>";
        else
            newHtml += "<p id='qs-movie-overview'><strong>Summary</strong>: " + movieInfo.overview + "</p>";

        newHtml += "</div>";

        $body_content.append(newHtml);

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }

}


function addArrayToHtml(type, info) {

    if (info !== undefined) {
        var arrayHtml;

        if (type === "genres")
            arrayHtml = "<li><strong>Genres</strong>: ";
        else
            arrayHtml = "<li><strong>Stars</strong>: ";

        for (var i = 0; i < info.length; ++i) {
            arrayHtml += info[i].name;

            if (((i + 1) < info.length)) {
                arrayHtml += ", ";
            }
        }

        arrayHtml += "</li>";

        return arrayHtml;
    } else
        return "";
}


function cartInsertCallback(email, data) {

    console.log("Cart Insert Callback");

    var movie_info_message = document.getElementById("qs-movie-info-message");;

    if (data.resultCode === CART_INSERT_SUCCESS_CODE)
        movie_info_message.style.color = '#00E600';
    else
        movie_info_message.style.color = '#F90000';


    setMessage(movie_info_message, data.message);

}


function ratingUpdateCallback(email, data) {

    console.log("Rating Update Callback.");

    var movie_info_message = document.getElementById("qs-movie-info-message");;

    if (data.resultCode === MOVIE_RATING_SUCCESS_CODE)
        movie_info_message.style.color = '#00E600';
    else
        movie_info_message.style.color = '#F90000';


    setMessage(movie_info_message, data.message);
}