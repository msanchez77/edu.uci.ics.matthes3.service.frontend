var browse_page = 1;
var browse_url = "";

$("#browse-form").on("submit", function(event) {
    event.preventDefault();

    var requestModel = {
        email: Cookies.get("email"),
        sessionID: Cookies.get("sessionID")
    };

    sendHttpRequest(requestModel.email, requestModel.sessionID, Cookies.get("transactionID"),
        "POST", idm_session, requestModel, SESSION_SUCCESS_CODE, browseButtonCallback);
});

function browseButtonCallback(email, data) {
    if (data.resultCode === SESSION_SUCCESS_CODE) {
        updateCookies(Cookies.get("email"), data.sessionID);

        browse_page = 1;
        browse_url = "";

        var $browse_genre = $("#genres-dropdown").val();
        var $browse_orderby = $("#browse-orderby").val();
        var $browse_direction = $("#browse-direction").val();
        var $browse_limit = $("#browse-limit").val();

        console.log("Genre: " + $browse_genre);
        console.log("Orderby: " + $browse_orderby);
        console.log("Direction: " + $browse_direction);
        console.log("Limit: " + $browse_limit);

        browse_url = addQuickSearchParameter(movies_searchMovie, "genre", $browse_genre);
        browse_url = addQuickSearchParameter(browse_url, "limit", $browse_limit);
        browse_url = addQuickSearchParameter(browse_url, "orderby", $browse_orderby);
        browse_url = addQuickSearchParameter(browse_url, "direction", $browse_direction);
        console.log("Constructed url: " + browse_url);

        console.log("User: " + Cookies.get("email"));
        console.log("Session ID: " + Cookies.get("sessionID"));

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

        $browse_body_content.empty();
        $browse_body_content.append("<p id='search-message'>Searching for movie genre...</p>")
    } else {
        console.log("User has inactive session. Redirecting to login page...");
        redirectToLogin();
    }
}

$("#browse-body-content").on('click', '.movieId-button', function(event) {
    event.preventDefault();

    var movieId = $(this).text();
    console.log("User clicked on movieId: " + movieId);

    var getMovieDetails_url = movies_getMovie + movieId;
    console.log("Constructed url: " + getMovieDetails_url);

    console.log("User: " + Cookies.get("email"));
    console.log("Session ID: " + Cookies.get("sessionID"));

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        getMovieDetails_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseMovieGetCallback);

    $browse_body_content.empty();
    $browse_body_content.append("<p id='search-message'>Fetching movie details...</p>")
});

$("#browse-body-content").on('click', '#browse-cart-button', function(event) {
    event.preventDefault();

    var id = $("#browse-movieId").text().substring(4);
    var numOrder = $(this).parent().parent().find('input[type=number]').val();

    console.log("User wants to add " + numOrder + " " + id + " to their cart.");

    var requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: numOrder
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, browseCartInsertCallback);


});

function browseCartInsertCallback(email, data) {

    console.log("Cart Insert Callback");

    var movie_info_message = document.getElementById("browse-movie-info-message");

    if (data.resultCode === CART_INSERT_SUCCESS_CODE)
        movie_info_message.style.color = '#00E600';
    else
        movie_info_message.style.color = '#F90000';


    setMessage(movie_info_message, data.message);

}

$("#browse-body-content").on('click', '#browse-rating-button', function(event) {
    event.preventDefault();

    var movieId = $("#browse-movieId").text().substring(4);
    var user_score = $("#browse-rating-score").val();

    console.log("User wants to rate " + movieId + " " + user_score + "/10.");

    var requestModel = {
        id: movieId,
        rating: user_score
    }

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        movies_getRating, requestModel, MOVIE_RATING_SUCCESS_CODE, cartInsertCallback);


});

$("#browse-body-content").on('click', '#browse-previous-button', function(event) {

    console.log("User clicked previous page button.");

    var new_offset = (browse_page-2)*($("#browse-limit").val());
    console.log("New previous offset: " + new_offset);

    browse_url = setParameter(browse_url, "offset", new_offset);
    console.log("Offset URL: " + browse_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

    browse_page--;

    $browse_body_content.empty();
    $browse_body_content.append("<p id='search-message'>Retrieving previous page...</p>")
});

$("#browse-body-content").on('click', '#browse-next-button', function(event) {

    console.log("User clicked next page button.");

    var new_offset = browse_page*($("#browse-limit").val());
    console.log("New next offset: " + new_offset);

    browse_url = setParameter(browse_url, "offset", new_offset);
    console.log("Offset URL: " + browse_url);

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
        browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

    browse_page++;

    $browse_body_content.empty();
    $browse_body_content.append("<p id='search-message'>Retrieving next page...</p>")
});

$("#browse-orderby").on("change", function(event) {
    console.log("User change orderby parameter to " + $(this).val());
    console.log("Current browse_url: " + browse_url);

    if (browse_url !== "") {
        browse_url = setParameter(browse_url, "orderby", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

        $browse_body_content.empty();
        $browse_body_content.append("<p id='search-message'>Reordering results by " + $(this).val() + "...</p>")
    }


});

$("#browse-direction").on("change", function(event) {
    console.log("User change direction parameter.");
    console.log("Current browse_url: " + browse_url);

    if (browse_url !== "") {
        browse_url = setParameter(browse_url, "direction", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

        $browse_body_content.empty();
        $browse_body_content.append("<p id='search-message'>Reordering results to " + $(this).val() + "...</p>")
    }


});

$("#browse-limit").on("change", function(event) {
    console.log("User change limit parameter.");
    console.log("Current browse_url: " + browse_url);

    if (browse_url !== "") {
        browse_url = setParameter(browse_url, "limit", $(this).val());

        sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "GET",
            browse_url, null, MOVIE_SEARCH_SUCCESS_CODE, browseGenreCallback);

        $browse_body_content.empty();
        $browse_body_content.append("<p id='search-message'>Adjusting number of results per page to " + $(this).val() + "...</p>")
    }
});

function retrieveGenresCallback(email, data) {

    console.log("Retrieve Genres Callback");

    if (data.resultCode === GET_GENRE_SUCCESS_CODE) {

        var $genre_dropdown = $("#genres-dropdown");
        $genre_dropdown.empty();

        var listHTML = "";

        var genresList = data.genres;

        for (var i = 0; i < genresList.length; ++i) {
            var g = genresList[i];
            console.log("Adding " + g["name"] + " to genres dropdown..");
            listHTML += "<option value=" + g["name"] + ">" + g["name"] + "</option>";
        }

        $genre_dropdown.append(listHTML);

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }
}

function browseGenreCallback(email, data) {
    // console.trace();

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {

        $browse_body_content.empty();

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
            rowHTML += "<td class='id-col'><button type='button' id='browsePage-cart-button'>Add " + m["movieId"] + "!</button></td>";
            rowHTML += "<td class='int-col'><input size='1' max='9999' min='1' value='1' type='number' step='1' class='browsePage-cart-quantity'/></td>";

            rowHTML += "</tr>";
        }

        rowHTML += "</table>";

        $browse_body_content.append(rowHTML);

        if (data.numResults > movieList.length) {
            // Pagination required

            var pagination = "<h3>" + browse_page + "</h3>";

            if (browse_page !== 1) {
                console.log("Adding previous button.");

                pagination += "<button type='button' id='browse-previous-button'>Previous Page</button>";
            }

            if ((browse_page*($("#browse-limit").val())) < data.numResults) {
                console.log("Adding next button.");

                pagination += "<button type='button' id='browse-next-button'>Next Page</button>";
            }

            $browse_body_content.append(pagination);

        }

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }
}

function browseMovieGetCallback(email, data) {

    if (data.resultCode === MOVIE_SEARCH_SUCCESS_CODE) {

        $browse_body_content.empty();

        var movieInfo = data.movie;

        var newHtml = "<h2 id='browse-movie-title'>" + movieInfo.title + "</h2>";

        newHtml += "<div class='movie-description'>" +
            "<button type='button' id='browse-cart-button'>Add to Cart!</button>" +
            "<input size='1' max='9999' min='1' value='1' type='number' step='1' id='browse-cart-quantity'>" +
            "<button type='button' id='browse-rating-button'>Submit Rating!</button>" +
            "<input size='1' max='10.0' min='0.0' value='5.0' type='number' step='0.1' id='browse-rating-score'>" +
            "<div id='browse-movie-info-message'>&nbsp;</div>" +
            "<ul class='movie-info'>" +
            "<li id='browse-movieId'><strong>Id</strong>: " + movieInfo.movieId + "</li>" +
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
            newHtml += "<p id='browse-movie-overview'><em>No overview found.</em></p>";
        else
            newHtml += "<p id='browse-movie-overview'><strong>Summary</strong>: " + movieInfo.overview + "</p>";

        newHtml += "</div>";

        $browse_body_content.append(newHtml);

    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }

}

$("#browse-body-content").on('click', '#browsePage-cart-button', function(event) {
    event.preventDefault();

    var id = $(this).text().substring(4,13);
    var numOrder = $("#browsePage-cart-quantity").val();

    console.log("User wants to add " + numOrder + " " + id + " to their cart.");

    var requestModel = {
        email: Cookies.get("email"),
        movieId: id,
        quantity: numOrder
    };

    sendHttpRequest(Cookies.get("email"), Cookies.get("sessionID"), null, "POST",
        cart_insert, requestModel, CART_INSERT_SUCCESS_CODE, browseCartPageInsertCallback);


});

function browseCartPageInsertCallback(email, data) {

    console.log("Browse Page Cart Insert Callback");

    alert(data.message);
}