"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames2 = _interopRequireDefault(require("../helpers/classNames"));

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    }
}

function _defineProperty(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e
}(0, _baseComponent.default)({
    externalClasses: ["wux-class-badge"],
    properties: {
        prefixCls: {
            type: String,
            value: "wux-badge"
        },
        count: {
            type: Number,
            value: 0,
            observer: "updated"
        },
        overflowCount: {
            type: Number,
            value: 99
        },
        dot: {
            type: Boolean,
            value: !1
        },
        showZero: {
            type: Boolean,
            value: !1
        },
        status: {
            type: String,
            value: ""
        },
        text: {
            type: String,
            value: ""
        }
    },
    data: {
        finalCount: 0
    },
    computed: {
        classes: ["prefixCls, status", function (e, t) {
            return {
                wrap: (0, _classNames2.default)(e),
                status: "".concat(e, "__status"),
                statusDot: (0, _classNames2.default)("".concat(e, "__status-dot"), _defineProperty({}, "".concat(e, "__status-dot--").concat(t), t)),
                statusText: "".concat(e, "__status-text"),
                dot: "".concat(e, "__dot"),
                count: "".concat(e, "__count")
            }
        }]
    },
    methods: {
        updated: function (e) {
            var t = 0 < arguments.length && void 0 !== e ? e : this.data.count,
                a = this.data.overflowCount,
                s = a <= t ? "".concat(a, "+") : t;
            this.setData({
                finalCount: s
            })
        }
    }
});