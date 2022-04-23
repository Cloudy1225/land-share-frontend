"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames2 = _interopRequireDefault(require("../helpers/classNames"));

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    }
}

function _defineProperty(e, r, t) {
    return r in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e
}(0, _baseComponent.default)({
    relations: {
        "../grid/index": {
            type: "child",
            observer: function () {
                this.debounce(this.changeCurrent)
            }
        }
    },
    properties: {
        prefixCls: {
            type: String,
            value: "wux-grids"
        },
        col: {
            type: Number,
            value: 3,
            observer: "changeCurrent"
        },
        bordered: {
            type: Boolean,
            value: !0,
            observer: "changeCurrent"
        },
        square: {
            type: Boolean,
            value: !1,
            observer: "changeCurrent"
        }
    },
    computed: {
        classes: ["prefixCls, bordered", function (e, r) {
            return {
                wrap: (0, _classNames2.default)(e, _defineProperty({}, "".concat(e, "--bordered"), r))
            }
        }]
    },
    methods: {
        changeCurrent: function () {
            var e = this.getRelationNodes("../grid/index"),
                r = this.data,
                t = r.col,
                n = r.bordered,
                a = r.square,
                o = 0 < parseInt(t) ? parseInt(t) : 1,
                u = "".concat(100 / o, "%");
            0 < e.length && e.forEach(function (e, r) {
                e.changeCurrent(u, n, a, r)
            })
        }
    }
});