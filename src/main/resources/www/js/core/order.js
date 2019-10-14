function orderRetrieveCallback(email, data) {
    console.log("Order Retrieve Callback");

    if (data.resultCode === ORDER_RETRIEVE_SUCCESS_CODE) {

        var $order_table = $("#order-table");
        $order_table.empty();

        var rowHTML = "<tr><th>Movie Title</th><th>Quantity</th>"

        var transactions = data.transactions;

        for (var i = 0; i < transactions.length; ++i) {
            var t = transactions[i];
            var items = t["items"];

            for (var j = 0; j < items.length; ++j) {

                rowHTML += "<tr>";
                rowHTML += "<td class='order-row'>" + items[j]["title"] + "</td>";
                rowHTML += "<td class='order-row'>" + items[j]["quantity"] + "</td>";
                rowHTML += "</tr>";
            }
        }

        rowHTML += "</table>";

        $order_table.append(rowHTML);


    } else {
        console.log("Sending alert to window.");
        alert(data.message);
    }


}