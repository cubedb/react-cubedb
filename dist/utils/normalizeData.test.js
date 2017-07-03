"use strict";

var _normalizeData = require("./normalizeData");

var _normalizeData2 = _interopRequireDefault(_normalizeData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyValueData = {
    "1": {
        "c": 16254
    },
    "2": {
        "c": 37038
    }
};

var simpleData = {
    "1": {
        "c": 16254
    },
    "2": {
        "c": 37038
    }
};

var simpleDataReturn = {
    "max": 37038,
    "serie": {
        "1": {
            "c": 16254,
            "key": "1",
            "name": "1"
        },
        "2": {
            "c": 37038,
            "key": "2",
            "name": "2"
        }
    },
    "total": 53292
};

var groupedData = {
    "a": {
        "1": {
            "c": 16254
        },
        "2": {
            "c": 37038
        }
    },
    "b": {
        "1": {
            "c": 16254
        },
        "2": {
            "c": 0
        }
    }
};

var groupedDataReturn = {
    "max": 53292,
    "serie": {
        "a": {
            "c": 53292,
            "key": "a",
            "name": "a",
            "stack": {
                "1": {
                    "c": 16254,
                    "key": "1",
                    "name": "1"
                },
                "2": {
                    "c": 37038,
                    "key": "2",
                    "name": "2"
                }
            }
        },
        "b": {
            "c": 16254,
            "key": "b",
            "name": "b",
            "stack": {
                "1": {
                    "c": 16254,
                    "key": "1",
                    "name": "1"
                },
                "2": {
                    "c": 0,
                    "key": "2",
                    "name": "2"
                }
            }
        }
    },
    "total": 69546
};

var datedData = {
    "2017-06-13": {
        "c": 16254
    },
    "2017-06-13 14": {
        "c": 37038
    }
};

var datedDataReturn = {
    "max": 37038,
    "serie": {
        "Tue Jun 13 2017 01:00:00 GMT+0100 (BST)": {
            "c": 16254,
            "key": "2017-06-13",
            "name": new Date('2017-06-13T00:00:00.000Z')
        },
        "Tue Jun 13 2017 15:00:00 GMT+0100 (BST)": {
            "c": 37038,
            "key": "2017-06-13 14",
            "name": new Date('2017-06-13T14:00:00.000Z')
        }
    },
    "total": 53292
};

describe("utils.normalizeData", function () {
    it("works with key-value dimension", function () {
        expect((0, _normalizeData2.default)(keyValueData)).toEqual(simpleDataReturn);
    });
    it("works with simple dimension", function () {
        expect((0, _normalizeData2.default)(simpleData)).toEqual(simpleDataReturn);
    });
    it("works with grouped dimension", function () {
        expect((0, _normalizeData2.default)(groupedData)).toEqual(groupedDataReturn);
    });
    it("works with date-based dimension", function () {
        expect((0, _normalizeData2.default)(datedData)).toEqual(datedDataReturn);
    });
});