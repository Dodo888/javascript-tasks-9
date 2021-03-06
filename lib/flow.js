'use strict';

module.exports.serial = function (funcs, callback) {
    if (funcs.length != 0) {
        var i = 0;
        var innerCallback = function (error, data) {
            if (error || i === funcs.length - 1) {
                callback(error, data);
            }
            i++;
            if (!error && i < funcs.length) {
                funcs[i](data, innerCallback);
            }
        };
        funcs[0](innerCallback);
    } else {
        callback(null, '');
    }
};

module.exports.parallel = function (funcs, callback) {
    var counter = funcs.length;
    var allData = [];
    var methodError = null;
    var innerCallback = function (index) {
        return function (error, data) {
            if (error) {
                methodError = error;
            }
            allData[index] = data;
            counter--;
            if (counter == 0) {
                callback(methodError, allData);
            }
        };
    };
    for (var i = 0; i < funcs.length; i++) {
        funcs[i](innerCallback(i));
    }
    if (funcs.length == 0) {
        callback(null, []);
    }
};

module.exports.map = function (values, func, callback) {
    var counter = values.length;
    var allData = [];
    var methodError = null;
    var innerCallback = function (index) {
        return function (error, data) {
            if (error) {
                methodError = error;
            }
            allData[index] = data;
            counter--;
            if (counter == 0) {
                callback(methodError, allData);
            }
        };
    };
    for (var i = 0; i < values.length; i++) {
        func(values[i], innerCallback(i));
    }
    if (values.length == 0) {
        callback(null, []);
    }
};
