'use strict';

var createPollChart = function(dataArr) {
    var createData = function(data, type) {
        return data.reduce(function(acc, val) {
            return acc.concat(val[type]);
        }, []);
    };
    var data2bgc = function(data) {
        return data.map(function(val, i, arr) {
            // hsl representation
            return 'hsl(' + (i / (arr.length - 1) * 240) + ', 80%, 70%)';
        });
    };
    var ctx = document.getElementById('poll-chart').getContext('2d');
    var pollChart = new Chart(ctx, {
        "type": "doughnut",
        "data": {
            "labels": createData(dataArr, 'name'),
            "datasets": [{
                "label": "Poll Chart",
                "data": createData(dataArr, 'votes'),
                "backgroundColor": data2bgc(dataArr),
                "borderColor": '#e7e7e7',
            }]
        },
        "options": pollChartConfig
    });
};