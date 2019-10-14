function sendHttpRequest(email, sessionID, transactionID, http_method, uri, request, success_code, callback) {

    console.log("Preparing to send " + http_method + " request to " + uri + "...");

    var async_g_endpoint = {
        method: http_method,
        url: uri,
        headers: {
            'email': email,
            'sessionID': sessionID,
            'transactionID': transactionID
        },
        success: function (data, status, xhr) {
            console.log("SUCCESS");

            // Forwarding endpoint didn't return an active session
            // User must log back in
            if (xhr.status !== NO_CONTENT) {
                console.log("Forwarding endpoint didn't return an active session...");

                redirectToLogin();
                return;

            }

            var returned_transactionID = xhr.getResponseHeader("transactionID");
            var responseModel = xhr.getResponseHeader("responseModel");
            var requestDelay = JSON.parse(responseModel).delay;

            if ((uri !== idm_register) || (uri !== idm_login)) {
                updateCookies(xhr.getResponseHeader("email"), xhr.getResponseHeader("sessionID"));
                Cookies.set("transactionID", returned_transactionID);
            }

            console.log("Querying report endpoint to see if response is ready.");
            probeReport(email, sessionID, returned_transactionID, requestDelay, success_code, callback);
        },
        error: function(data) {
            console.log("HTTP Request Error: " + data);
        }
    };

    if (http_method === "POST") {
        async_g_endpoint.headers['Content-Type'] = 'application/json';
        async_g_endpoint.dataType = 'json';
        async_g_endpoint.data = JSON.stringify(request);
    }

    console.log("Sending request...");

    $.ajax(async_g_endpoint);
}

function probeReport(email, sessionID, transactionID, delay, success_code, callback) {

    console.log("Preparing to request the report with transactionID: " + transactionID + "...");

    $.ajax({
        method: "GET",
        url: "http://andromeda-73.ics.uci.edu:8297/api/g/report",
        headers: {
            'email': email,
            'sessionID': sessionID,
            "transactionID": transactionID
        },
        success: function(data, status, xhr) {
            var statusCode = xhr.status;
            console.log("Report returned a " + statusCode + " response.");


            if (statusCode === NO_CONTENT) {
                console.log("204 caught.");
                setTimeout(function () {
                    probeReport(email, sessionID, transactionID, delay, success_code, callback)
                }, delay);
            } else {
                console.log("Retrieved response from /report!");
                console.log(data);

                // Store the JSON ResponseModel from the database into a global variable
                responseModel = data;

                var result_code = data.resultCode;
                console.log("Received: " + result_code);
                console.log("Success code: " + success_code);

                callback(email, data);
            }
        },

        error: function(data, status, xhr) {
            console.log(data);
            callback(email, data.responseJSON)
        }
    });
}