var as_page = 1;
var as_url = "";

$("adv-search-form").on("submit", function(event) {
    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, advSearchButtonCallback);
});

function advSearchButtonCallback(email, data) {

    if (data.resultCode === SESSION_SUCCESS_CODE) {
        as_page = 1;
        as_url = movies_searchMovie;

        var $as_title = $("#adv-search-title").val();
        var $as_genre = $("#adv-search-genre").val();
        var $as_year = $("#adv-search-year").val();
        var $as_director = $("#adv-search-director").val();

        var $as_orderby = $("#adv-search-orderby").val();
        var $as_direction = $("#adv-search-direction").val();
        var $as_limit = $("#adv-search-limit").val();

        console.log("Title: " + $as_title);
        console.log("Genre: " + $as_genre);
        console.log("Year: " + $as_year);
        console.log("Director: " + $as_director);

        console.log("Orderby: " + $as_orderby);
        console.log("Direction: " + $as_direction);
        console.log("Limit: " + $as_limit);

        if (($as_title === undefined) && ($as_genre === undefined) && ($as_year === undefined) && ($as_director === undefined)) {
            alert("Please search by at least title, genre, year, or director");
            return;
        }

        if ($as_title !== undefined)
            as_url = addQuickSearchParameter(as_url, "title", $as_title);
        if ($as_genre !== undefined)
            as_url = addQuickSearchParameter(as_url, "genre", $as_genre);
        if ($as_year !== undefined)
            as_url = addQuickSearchParameter(as_url, "year", $as_year);
        if ($as_director !== undefined)
            as_url = addQuickSearchParameter(as_url, "director", $as_director);

        as_url = addQuickSearchParameter(as_url, "limit", $as_limit);
        as_url = addQuickSearchParameter(as_url, "orderby", $as_orderby);
        as_url = addQuickSearchParameter(as_url, "direction", $as_direction);
        console.log("Constructed url: " + as_url);

        console.log("User: " + Cookies.get("email"));
        console.log("Session ID: " + Cookies.get("sessionID"));

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

        $adv_body_content.empty();
        $adv_body_content.append("<p id='search-message'>Searching for movie...</p>")
    } else {
        console.log("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }


};

$("#adv-body-content").on('click', '.movieId-button', function(event) {
    event.preventDefault();

    var movieId = $(this).text();
    console.log("User clicked on movieId: " + movieId);

    var getMovieDetails_url = movies_getMovie + movieId;
    console.log("Constructed url: " + getMovieDetails_url);

    console.log("User: " + Cookies.get("email"));
    console.log("Session ID: " + Cookies.get("sessionID"));

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        getMovieDetails_url, null, MOVIE_SEARCH_SUCCESS_CODE, advMovieGetCallback);

    $adv_body_content.empty();
    $adv_body_content.append("<p id='search-message'>Fetching movie details...</p>")
});

$("#adv-body-content").on('click', '#adv-cart-button', function(event) {
    event.preventDefault();

    var id = $("#adv-movieId").text().substring(4);
    var numOrder = $("#adv-cart-quantity").val();

    console.log("User wants to add " + numOrder + " " + id + " to their cart.");

    var requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: numOrder
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, advCartInsertCallback);


});

function advCartInsertCallback(email, data) {

    console.log("Cart Insert Callback");

    var movie_info_message = document.getElementById("adv-movie-info-message");

    if (data.resultCode === CART_INSERT_SUCCESS_CODE)
        movie_info_message.style.color = '#00E600';
    else
        movie_info_message.style.color = '#F90000';


    setMessage(movie_info_message, data.message);

}

$("#adv-body-content").on('click', '#adv-rating-button', function(event) {
    event.preventDefault();

    var movieId = $("#adv-movieId").text().substring(4);
    var user_score = $("#adv-rating-score").val();

    console.log("User wants to rate " + movieId + " " + user_score + "/10.");

    var requestModel = {
        id: movieId,
        rating: user_score
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        movies_getRating, requestModel, MOVIE_RATING_SUCCESS_CODE, advRatingUpdateCallback);


});

function advRatingUpdateCallback(email, data) {

    console.log("Rating Update Callback.");

    var movie_info_message = document.getElementById("adv-movie-info-message");;

    if (data.resultCode === MOVIE_RATING_SUCCESS_CODE)
        movie_info_message.style.color = '#00E600';
    else
        movie_info_message.style.color = '#F90000';


    setMessage(movie_info_message, data.message);
}

$("#adv-body-content").on('click', '#adv-previous-button', function(event) {

    console.log("User clicked previous page button.");

    var new_offset = (as_page-2)*($("#adv-search-limit").val());
    console.log("New previous offset: " + new_offset);

    as_url = setParameter(as_url, "offset", new_offset);
    console.log("Offset URL: " + as_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

    as_page--;

    $adv_body_content.empty();
    $adv_body_content.append("<p id='search-message'>Retrieving previous page...</p>")

});

$("#adv-body-content").on('click', '#next-button', function(event) {

    console.log("User clicked next page button.");

    var new_offset = as_page*($("#adv-search-limit").val());
    console.log("New next offset: " + new_offset);

    as_url = setParameter(as_url, "offset", new_offset);
    console.log("Offset URL: " + as_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

    as_page++;

    $adv_body_content.empty();
    $adv_body_content.append("<p id='search-message'>Retrieving next page...</p>")
});

$("#adv-search-orderby").on("change", function(event) {
    console.log("User change orderby parameter to " + $(this).val());
    console.log("Current as_url: " + as_url);

    if (as_url !== "") {
        as_url = setParameter(as_url, "orderby", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

        $adv_body_content.empty();
        $adv_body_content.append("<p id='search-message'>Reordering results by " + $(this).val() + "...</p>")
    }

});

$("#adv-search-direction").on("change", function(event) {
    console.log("User change direction parameter.");
    console.log("Current as_url: " + as_url);

    if (as_url !== "") {
        as_url = setParameter(as_url, "direction", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

        $adv_body_content.empty();
        $adv_body_content.append("<p id='search-message'>Reordering results to " + $(this).val() + "...</p>")
    }
});

$("#adv-search-limit").on("change", function(event) {
    console.log("User change limit parameter.");
    console.log("Current as_url: " + as_url);

    if (as_url !== "") {
        as_url = setParameter(as_url, "limit", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            as_url, null, MOVIE_SEARCH_SUCCESS_CODE, movieAdvSearchCallback);

        $adv_body_content.empty();
        $adv_body_content.append("<p id='search-message'>Adjusting number of results per page to " + $(this).val() + "...</p>")
    }


});


function movieAdvSearchCallback(email, data) {
    // console.trace();

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {
        $adv_body_content.empty();

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
            rowHTML += "<td class='id-col'><button type='button' id='advPage-cart-button'>Add " + m["movieId"] + "!</button></td>";
            rowHTML += "<td class='int-col'><input size='1' max='9999' min='1' value='1' type='number' step='1' class='advPage-cart-quantity'/></td>";

            rowHTML += "</tr>";
        }

        rowHTML += "</table>";

        $adv_body_content.append(rowHTML);

        if (data.numResults > movieList.length) {
            // Pagination required

            var pagination = "<h3>" + as_page + "</h3>";

            if (as_page !== 1) {
                console.log("Adding previous button.");

                pagination += "<button type='button' id='adv-previous-button'>Previous Page</button>";
            }

            if ((as_page*($("#adv-search-limit").val())) < data.numResults) {
                console.log("Adding next button.");

                pagination += "<button type='button' id='adv-next-button'>Next Page</button>";
            }

            $adv_body_content.append(pagination);

        }

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }
}

function advMovieGetCallback(email, data) {

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {

        $adv_body_content.empty();

        var movieInfo = data.movie;

        var newHtml = "<h2 id='adv-movie-title'>" + movieInfo.title + "</h2>";

        newHtml += "<div class='movie-description'>" +
            "<button type='button' id='adv-cart-button'>Add to Cart!</button>" +
            "<input size='1' max='9999' min='1' value='1' type='number' step='1' id='adv-cart-quantity'>" +
            "<button type='button' id='adv-rating-button'>Submit Rating!</button>" +
            "<input size='1' max='10.0' min='0.0' value='5.0' type='number' step='0.1' id='adv-rating-score'>" +
            "<div id='adv-movie-info-message'>&nbsp;</div>" +
            "<ul class='movie-info'>" +
            "<li id='adv-movieId'><strong>Id</strong>: " + movieInfo.movieId + "</li>" +
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
            newHtml += "<p id='adv-movie-overview'><em>No overview found.</em></p>";
        else
            newHtml += "<p id='adv-movie-overview'><strong>Summary</strong>: " + movieInfo.overview + "</p>";

        newHtml += "</div>";

        $adv_body_content.append(newHtml);

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }

}

$("#adv-body-content").on('click', '#advPage-cart-button', function(event) {
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
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, advCartPageInsertCallback);


});

function advCartPageInsertCallback(email, data) {

    console.log("Adv Page Cart Insert Callback");

    alert(data.message);
}