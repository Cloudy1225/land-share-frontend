"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames2 = _interopRequireDefault(require("../helpers/classNames")),
    _styleToCssString = _interopRequireDefault(require("../helpers/styleToCssString")),
    _colors = require("../helpers/colors");

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
    externalClasses: ["wux-input-class"],
    properties: {
        prefixCls: {
            type: String,
            value: "wux-selectable"
        },
        type: {
            type: String,
            value: "checkbox"
        },
        value: {
            type: String,
            value: ""
        },
        defaultChecked: {
            type: Boolean,
            value: !1
        },
        checked: {
            type: Boolean,
            value: !1,
            observer: function (e) {
                this.data.controlled && this.updated(e)
            }
        },
        disabled: {
            type: Boolean,
            value: !1
        },
        color: {
            type: String,
            value: "balanced",
            observer: function (e) {
                this.setData({
                    inputColor: (0, _colors.isPresetColor)(e)
                })
            }
        },
        controlled: {
            type: Boolean,
            value: !1
        },
        wrapStyle: {
            type: [String, Object],
            value: "",
            observer: function (e) {
                this.setData({
                    extStyle: (0, _styleToCssString.default)(e)
                })
            }
        }
    },
    data: {
        inputChecked: !1,
        inputColor: "",
        extStyle: ""
    },
    computed: {
        classes: ["prefixCls, inputChecked, disabled", function (e, t, a) {
            var r;
            return {
                wrap: (0, _classNames2.default)(e, (_defineProperty(r = {}, "".concat(e, "--checked"), t), _defineProperty(r, "".concat(e, "--disabled"), a), r)),
                input: "".concat(e, "__input"),
                icon: "".concat(e, "__icon")
            }
        }]
    },
    methods: {
        updated: function (e) {
            this.data.inputChecked !== e && this.setData({
                inputChecked: e
            })
        },
        onChange: function () {
            var e = this.data,
                t = e.value,
                a = e.inputChecked,
                r = e.disabled,
                o = e.controlled,
                n = {
                    checked: !a,
                    value: t
                };
            r || (o || this.updated(!a), this.triggerEvent("change", n))
        }
    },
    attached: function () {
        var e = this.data,
            t = e.defaultChecked,
            a = e.checked,
            r = e.controlled ? a : t,
            o = (0, _colors.isPresetColor)(this.data.color);
        this.setData({
            inputChecked: r,
            inputColor: o
        })
    }
});