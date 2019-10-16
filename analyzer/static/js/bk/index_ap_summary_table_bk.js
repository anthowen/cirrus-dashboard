function setupApSummaryTable(apGlobals) {

    let ssid;
    let button;

    function openApDetailModalButtonHtml(data) {
        ssid = data.ssid;
        if (ssid === "") {
            ssid = "UNDEFINED";
        }
        button = '<button class="btn btn-link" type="button" value="" '
            + 'onclick="apGlobals.viewDetails(\'' + data.hostname + '\', \'' + data.mac + '\', \'' + ssid + '\')">'
            + ssid + '</button>';
        return button;
    }

    apGlobals.allApnTable = $("#all_apn_table").DataTable({
        "dom": "Rlfrtip",
        "processing": true,
        "info": false,
        "paging": false,
        "scrollY": 200,
        "ajax": {
            "processing": true,
            "url": apGlobals.apSummaryRoute,
            "dataSrc": "",
            "data": {
              'host': function () {
                return apGlobals.hostSelect.val();
              }
            }
        },
        "columns": [
            { "data": "hostname", "visible": false },
            { "data": openApDetailModalButtonHtml},
            {"data": "mac"},
            {"data": "last_seen"},
            {"data": "channel"},
            {"data": "min_rssi"},
            {"data": "max_rssi"},
        ]
    });

    apGlobals.hostSelect.change(function() {
        apGlobals.allApnTable.ajax.reload(null, false);
    });

    $.fn.dataTable.ext.search.push(function hostNameFilter(settings, data ) {
        let hostSelectVal;
        if (settings.sTableId === "all_apn_table") {
            hostSelectVal = apGlobals.hostSelect.val();
            if (hostSelectVal === "") {
                return true;
            }
            return data[0] === hostSelectVal;
        }
        // Return OK for all other tables
        return true;
    });

    setInterval( function () {
        apGlobals.allApnTable.ajax.reload(null, false);
    }, 30000 );


}