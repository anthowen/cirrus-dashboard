// using jQuery
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

var csrfToken = getCookie('csrftoken');
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrfToken);
      }
  }
});


Chart.pluginService.register({
    afterUpdate: function (chart) {
        var xScale = chart.scales['x-axis-0'];
        if (xScale === undefined) {
            return;
        }
        if (xScale.options.ticks.maxTicksLimit) {
            // store the original maxTicksLimit
            xScale.options.ticks._maxTicksLimit = xScale.options.ticks.maxTicksLimit;
            // let chart.js draw the first and last label
            xScale.options.ticks.maxTicksLimit = (xScale.ticks.length % xScale.options.ticks._maxTicksLimit === 0) ? 1 : 2;

            var originalXScaleDraw = xScale.draw
            xScale.draw = function () {
                originalXScaleDraw.apply(this, arguments);

                var xScale = chart.scales['x-axis-0'];
                if (xScale.options.ticks.maxTicksLimit) {
                    var helpers = Chart.helpers;

                    var tickFontColor = helpers.getValueOrDefault(xScale.options.ticks.fontColor, Chart.defaults.global.defaultFontColor);
                    var tickFontSize = helpers.getValueOrDefault(xScale.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
                    var tickFontStyle = helpers.getValueOrDefault(xScale.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
                    var tickFontFamily = helpers.getValueOrDefault(xScale.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
                    var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
                    var tl = xScale.options.gridLines.tickMarkLength;

                    var isRotated = xScale.labelRotation !== 0;
                    var yTickStart = xScale.top;
                    var yTickEnd = xScale.top + tl;
                    var chartArea = chart.chartArea;

                    // use the saved ticks
                    var maxTicks = xScale.options.ticks._maxTicksLimit - 1;
                    var ticksPerVisibleTick = xScale.ticks.length / maxTicks;

                    // chart.js uses an integral skipRatio - this causes all the fractional ticks to be accounted for between the last 2 labels
                    // we use a fractional skipRatio
                    var ticksCovered = 0;
                    helpers.each(xScale.ticks, function (label, index) {
                        if (index < ticksCovered)
                            return;

                        ticksCovered += ticksPerVisibleTick;

                        // chart.js has already drawn these 2
                        if (index === 0 || index === (xScale.ticks.length - 1))
                            return;

                        // copy of chart.js code
                        var xLineValue = this.getPixelForTick(index);
                        var xLabelValue = this.getPixelForTick(index, this.options.gridLines.offsetGridLines);

                        if (this.options.gridLines.display) {
                            this.ctx.lineWidth = this.options.gridLines.lineWidth;
                            this.ctx.strokeStyle = this.options.gridLines.color;

                            xLineValue += helpers.aliasPixel(this.ctx.lineWidth);

                            // Draw the label area
                            this.ctx.beginPath();

                            if (this.options.gridLines.drawTicks) {
                                this.ctx.moveTo(xLineValue, yTickStart);
                                this.ctx.lineTo(xLineValue, yTickEnd);
                            }

                            // Draw the chart area
                            if (this.options.gridLines.drawOnChartArea) {
                                this.ctx.moveTo(xLineValue, chartArea.top);
                                this.ctx.lineTo(xLineValue, chartArea.bottom);
                            }

                            // Need to stroke in the loop because we are potentially changing line widths & colours
                            this.ctx.stroke();
                        }

                        if (this.options.ticks.display) {
                            this.ctx.save();
                            this.ctx.translate(xLabelValue + this.options.ticks.labelOffset, (isRotated) ? this.top + 12 : this.options.position === "top" ? this.bottom - tl : this.top + tl);
                            this.ctx.rotate(helpers.toRadians(this.labelRotation) * -1);
                            this.ctx.font = tickLabelFont;
                            this.ctx.textAlign = (isRotated) ? "right" : "center";
                            this.ctx.textBaseline = (isRotated) ? "middle" : this.options.position === "top" ? "bottom" : "top";
                            this.ctx.fillText(label, 0, 0);
                            this.ctx.restore();
                        }
                    }, xScale);
                }
            };
        }
    },
});


// Copy the bounds/ticks from one ChartJS object to another one.
function copyChartJsBounds(sourceChart, targetChart) {
  var sourceAxis = sourceChart.scales['x-axis-0'];
  var chartMin = sourceAxis.options.ticks.min;
  var chartMax = sourceAxis.options.ticks.max;

  var targetAxis = targetChart.scales['x-axis-0'];

  targetAxis.options.time.min = chartMin;
  targetAxis.options.time.max = chartMax;
  targetAxis.options.ticks.min = chartMin;
  targetAxis.options.ticks.max = chartMax;

  targetChart.update(0);
}


// Display error message
function showErrorMessage(successDiv, errorDiv, errorMessage) {
  successDiv.text('').hide();
  errorDiv.text(errorMessage).show();
}

function hideErrorMessage(errorDiv) {
  errorDiv.text('').hide();
}


function postProcessTimeRange(range, timeScale) {
  switch(range) {
    case '2h':
    case '6h':
    timeScale.unit = 'minute';
      break;
    case '12h':
    case '1d':
    case '2d':
      timeScale.unit = 'hour';
      break;
    case '1w':
    case '1m':
      timeScale.unit = 'day';
      break;
  }
}


function processErrorMessage(xhr, error, code) {
  var errorMessage = "";
  if (error == 'error' && code == '') {
    errorMessage = "Connection to the server failed."
  } else if (xhr.responseJSON !== undefined ) {
    errorMessage = "Error received from server: " + xhr.responseJSON['error'];
  }
  showErrorMessage(apGlobals.successDiv, apGlobals.dangerDiv, errorMessage);
}


function setupThresholdAnnotations(valueThresholdInfos) {
  return valueThresholdInfos
    .filter(function (d) {
      return !d[0][1];
    })
    .map(function (d) {
      return {
        type: 'line',
        mode: 'horizontal',
        scaleID: d[2],
        value: d[0][0],
        borderColor: d[1],
        borderWidth: 3,
      };
    });
}

function formatDate(dateObject) {

    var year = dateObject.getFullYear();
    var month = '' + (dateObject.getMonth() + 1);
    var day = '' + dateObject.getDate();
    var hour = '' + dateObject.getHours();
    var minute = '' + dateObject.getMinutes();
    var second = '' + dateObject.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;

    return year+ "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
}