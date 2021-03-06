"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _popupMixin = _interopRequireDefault(require("../helpers/popupMixin")),
    _utils = require("./utils");

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    }
}

function ownKeys(t, e) {
    var i = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(t);
        e && (a = a.filter(function (e) {
            return Object.getOwnPropertyDescriptor(t, e).enumerable
        })), i.push.apply(i, a)
    }
    return i
}

function _objectSpread(t) {
    for (var e = 1; e < arguments.length; e++) {
        var i = null != arguments[e] ? arguments[e] : {};
        e % 2 ? ownKeys(i, !0).forEach(function (e) {
            _defineProperty(t, e, i[e])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : ownKeys(i).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
        })
    }
    return t
}

function _defineProperty(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = i, e
}(0, _baseComponent.default)({
    behaviors: [(0, _popupMixin.default)("#wux-select")],
    properties: {
        prefixCls: {
            type: String,
            value: "wux-select"
        },
        value: {
            type: [String, Array],
            value: ""
        },
        options: {
            type: Array,
            value: []
        },
        multiple: {
            type: Boolean,
            value: !1
        },
        max: {
            type: Number,
            value: -1
        }
    },
    data: {
        scrollTop: 0
    },
    observers: _defineProperty({}, "options, multiple", function (e, t) {
        this.setData({
            inputValue: this.getRealValue(e, this.data.inputValue, t)
        })
    }),
    methods: {
        getRealValue: function (e, t, i) {
            var a = 0 < arguments.length && void 0 !== e ? e : this.data.options,
                n = 1 < arguments.length && void 0 !== t ? t : this.data.inputValue,
                r = 2 < arguments.length && void 0 !== i ? i : this.data.multiple;
            return (0, _utils.getRealValue)(a, n, r)
        },
        updated: function (e, t) {
            if (!this.hasFieldDecorator || t) {
                var i = this.getRealValue(this.data.options, e);
                this.data.inputValue !== i && this.setData({
                    inputValue: i
                })
            }
        },
        setVisibleState: function (i, e) {
            var a = this,
                n = 1 < arguments.length && void 0 !== e ? e : function () {};
            if (this.data.popupVisible !== i) {
                var r = {
                    mounted: !0,
                    inputValue: this.getRealValue(this.data.options, this.data.value),
                    popupVisible: i
                };
                this.setData(i ? r : {
                    popupVisible: i
                }, function () {
                    if (i) {
                        var t = r.inputValue,
                            e = a.getFieldElem();
                        a.hasFieldDecorator && e && (t = e.data.value, e.changeValue(t)), a.getBoundingClientRect(function (e) {
                            a.scrollIntoView(t, e)
                        })
                    }
                    n()
                })
            }
        },
        onValueChange: function (e) {
            if (this.data.mounted) {
                var t = this.data,
                    i = (t.options, t.max),
                    a = t.multiple,
                    n = e.detail.selectedValue;
                a && 1 <= i && i < n.length || (this.setScrollValue(n), this.updated(n, !0), this.triggerEvent("valueChange", this.formatPickerValue(_objectSpread({}, e.detail, {
                    value: n
                }))))
            }
        },
        scrollIntoView: function (e, t) {
            var i = this.data,
                a = i.options,
                n = i.multiple,
                r = (0, _utils.getSelectIndex)(a, e, n),
                o = a.length,
                l = Array.isArray(r) ? r[r.length - 1] : r; - 1 !== l && void 0 !== l || (l = 0);
            var u = 1 <= o ? parseFloat(t / o * l) : 0;
            this.data.scrollTop !== u && this.setData({
                scrollTop: u
            })
        },
        getBoundingClientRect: function (e) {
            return this.selectComponent("#wux-select").getBoundingClientRect(e)
        }
    }
});