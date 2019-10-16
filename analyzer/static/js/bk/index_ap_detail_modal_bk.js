function setupApDetailModal(apGlobals) {

  var myChart;
  var ctx = apGlobals.specificApnChartTag;

  function getChartData() {
    $.ajax({
      type: "POST",
      processing: true,
      url: apGlobals.apDetailRoute,
      data: {
        'mac': function () {
          return apGlobals.specificApnMac;
        },
        'host': function () {
          return apGlobals.specificApnHost;
        },
      },
      dataSrc: "",
      success: function (data) {

        if (myChart !== undefined) {
          myChart.destroy();
        }

        var chartData = [];
        data.forEach(function (d) {
          chartData[chartData.length] = {x: Date.parse(d.time), y: parseFloat(d.rssi)}
        });

        // add new label and data point to chart's underlying data structures
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: [data[data.length - 1].ssid],
              showLine: false,
              data: chartData,
              backgroundColor: 'rgba(255, 255, 255, 0)',
              borderColor: ['rgba(255,99,132,1)']
            }]
          },
          options: {
            bezierCurve: false,
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'minute'
                }
              }],
              yAxes: [{
                ticks: {
                  suggestedMin: -90,
                  suggestedMax: -40,
                }
              }]

            }
          }
        });

      }
    });
  };

  apGlobals.viewDetails = function (hostname, mac, ssid) {

    apGlobals.apnModal.modal('show');

    apGlobals.specificApnMac = mac;
    apGlobals.specificApnHost = hostname;
    apGlobals.specificApnSsid = ssid;

    apGlobals.apnModalTitle.text(ssid);

    if (apGlobals.apnModalTableShown) {

      if ($.fn.dataTable.isDataTable('#specific_apn_table')) {
        apGlobals.specificApnTable = apGlobals.specificApnTableTag.dataTable();
        apGlobals.specificApnTable.fnClearTable(true);
        apGlobals.specificApnTable.api().ajax.reload(null, false);
      } else {
        apGlobals.specificApnTable = apGlobals.specificApnTableTag.dataTable({
          "processing": true,
          "dom": "Rlfrtip",
          "colReorder": true,
          "ajax": {
            "type": "POST",
            "processing": true,
            "url": apGlobals.apDetailRoute,
            "data": {
              'mac': function () {
                return apGlobals.specificApnMac;
              },
              'host': function () {
                return apGlobals.specificApnHost;
              },
            },
            "dataSrc": ""
          },
          "columns": [
            {"data": "ssid"},
            {"data": "channel"},
            {"data": "time"},
            {"data": "rssi"}
          ]
        });
      }

    } else {

      getChartData();

    }

  };

  apGlobals.modalTableViewButton.click(function () {
    apGlobals.apnModalTableShown = true;
    apGlobals.specificApnChartModal.hide();
    apGlobals.specificApnTableModal.show();
    apGlobals.viewDetails(apGlobals.specificApnHost, apGlobals.specificApnMac,
                          apGlobals.specificApnSsid)
  });
  apGlobals.modalChartViewButton.click(function () {
    apGlobals.apnModalTableShown = false;
    apGlobals.specificApnTableModal.hide();
    apGlobals.specificApnChartModal.show();
    apGlobals.viewDetails(apGlobals.specificApnHost, apGlobals.specificApnMac,
      apGlobals.specificApnSsid)
  });


  apGlobals.apnModalShown = false;

  apGlobals.apnModal
    .on('hidden.bs.modal', function () {
      apGlobals.specificApnTable = undefined;
      apGlobals.specificApnChart = undefined;
      apGlobals.apnModalShown = false;

    }).on('shown.bs.modal', function () {
    apGlobals.apnModalShown = true;
  });

  setInterval(function () {
    if (apGlobals.apnModalShown) {
      if (apGlobals.specificApnTable !== undefined) {
        apGlobals.specificApnTable.api().ajax.reload(null, false);
      } else if (apGlobals.specificApnChart !== undefined) {
        getChartData();
      }
    }
  }, 30000);

}
