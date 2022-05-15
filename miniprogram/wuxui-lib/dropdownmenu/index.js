"use strict";
var _observers, _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames = _interopRequireDefault(require("../helpers/classNames")),
    _index = require("../index");

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    }
}

function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
}

function _toConsumableArray(e) {
    return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance")
}

function _iterableToArray(e) {
    if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
}

function _arrayWithoutHoles(e) {
    if (Array.isArray(e)) {
        for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
        return n
    }
}

function ownKeys(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(t);
        e && (r = r.filter(function (e) {
            return Object.getOwnPropertyDescriptor(t, e).enumerable
        })), n.push.apply(n, r)
    }
    return n
}

function _objectSpread(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2 ? ownKeys(n, !0).forEach(function (e) {
            _defineProperty(t, e, n[e])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ownKeys(n).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
        })
    }
    return t
}

function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
}

function getLabels() {
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).filter(function (e) {
        return e.checked
    }).map(function (e) {
        return e.label
    }).join(",")
}

function getDisplayValues() {
    var n = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).reduce(function (e, t) {
        switch (t.type) {
            case "radio":
            case "checkbox":
                e.push(getLabels(t.children || []) || (n ? t.label : ""));
                break;
            case "filter":
                e.push(getDisplayValues(t.children || [], !1));
                break;
            default:
                e.push(t.label)
        }
        return e
    }, [])
}

function getSortValue(e) {
    return "number" == typeof e && [1, -1].includes(e) ? e : 1
}

function getValue() {
    var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
        t = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).filter(function (e) {
            return e.checked
        }).map(function (e) {
            return e.value
        });
    return e ? t[0] || "" : t
}

function getValues() {
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).reduce(function (e, t) {
        switch (t.type) {
            case "radio":
                e.push(getValue(t.children, !0));
                break;
            case "checkbox":
                e.push(getValue(t.children, !1));
                break;
            case "text":
                e.push(t.checked ? t.value : "");
                break;
            case "sort":
                e.push(t.checked ? getSortValue(t.sort) : "");
                break;
            case "filter":
                e.push(getValues(t.children))
        }
        return e
    }, [])
}

function clone(e) {
    return JSON.parse(JSON.stringify(e))
}

function isContain(e, t) {
    return Array.isArray(e) ? e.includes(t) : t === e
}

function getChangedParamPathFromFilter() {
    var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
        o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "";
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).reduce(function (e, t, n) {
        return _objectSpread({}, e, _defineProperty({}, "".concat(o, "[").concat(n, "].checked"), isContain(r, t.value)))
    }, {})
}

function getChangedValuesFromFilter() {
    var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
        o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "options";
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).reduce(function (e, t, n) {
        return "radio" === t.type || "checkbox" === t.type ? _objectSpread({}, e, {}, getChangedParamPathFromFilter(t.children, r[n], "".concat(o, "[").concat(n, "].children"))) : "filter" === t.type ? _objectSpread({}, e, {}, getChangedValuesFromFilter(t.children, r[n] || [], "".concat(o, "[").concat(n, "].children"))) : e
    }, {})
}

function getShowOptions() {
    var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [];
    return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).reduce(function (e, t, n) {
        return ["radio", "checkbox"].includes(t.type) ? [].concat(_toConsumableArray(e), [_objectSpread({}, t, {
            selected: getLabels(t.children || [])
        })]) : "filter" === t.type ? [].concat(_toConsumableArray(e), [_objectSpread({}, t, {
            children: getShowOptions(t.children || [], r[n])
        })]) : [].concat(_toConsumableArray(e), [_objectSpread({}, t)])
    }, [])
}(0, _baseComponent.default)({
    properties: {
        prefixCls: {
            type: String,
            value: "wux-dropdownmenu"
        },
        items: {
            type: Array,
            value: []
        },
        cancelText: {
            type: String,
            value: "重置"
        },
        confirmText: {
            type: String,
            value: "确定"
        }
    },
    data: {
        displayValues: [],
        values: []
    },
    observers: (_observers = {}, _defineProperty(_observers, "items.**", function (e) {
        this.setData({
            options: e,
            values: getValues(e)
        })
    }), _defineProperty(_observers, "options.**", function (e) {
        this.updatedDisplayValues(e)
    }), _observers),
    computed: {
        classes: ["prefixCls", function (e) {
            return {
                wrap: (0, _classNames.default)(e),
                bd: "".concat(e, "__bd"),
                item: "".concat(e, "__item"),
                text: "".concat(e, "__text"),
                icon: "".concat(e, "__icon"),
                pop: "".concat(e, "__pop"),
                scrollView: "".concat(e, "__scroll-view"),
                panel: "".concat(e, "__panel"),
                panelHd: "".concat(e, "__panel-hd"),
                panelTitle: "".concat(e, "__panel-title"),
                panelSelected: "".concat(e, "__panel-selected"),
                panelBd: "".concat(e, "__panel-bd"),
                groups: "".concat(e, "__groups"),
                group: "".concat(e, "__group"),
                radio: "".concat(e, "__radio"),
                btn: "".concat(e, "__btn"),
                check: "".concat(e, "__check"),
                btns: "".concat(e, "__btns"),
                select: "".concat(e, "__select")
            }
        }]
    },
    methods: {
        updatedValues: function (e, t) {
            this.data.values !== e && this.setData({
                values: e
            }, t)
        },
        updatedDisplayValues: function (e) {
            var t = getDisplayValues(0 < arguments.length && void 0 !== e ? e : this.data.options);
            this.data.displayValues !== t && this.setData({
                displayValues: t
            })
        },
        onClose: function (e) {
            var t = e.currentTarget.dataset.index;
            this.onSelectClose(t)
        },
        onPopupSelectChange: function (e) {
            var n = _toConsumableArray(this.data.values),
                t = this.showOptions || clone(this.data.options),
                r = e.detail.value,
                o = e.currentTarget.dataset,
                a = o.index,
                i = o.parentIndex;
            n[i] = n[i] || [], n[i][a] = r, n = _toConsumableArray(n).map(function (e) {
                return e
            }), t[i].children.length && (t[i].children.forEach(function (e, t) {
                e.children && (e.children = e.children.map(function (e) {
                    return _objectSpread({}, e, {
                        checked: !!n[i][t] && isContain(n[i][t], e.value)
                    })
                }))
            }), this.updatedDisplayValues(t), this.showOptions = t), this.updatedValues(n)
        },
        onSelectChange: function (e) {
            var t = _toConsumableArray(this.data.values),
                n = e.currentTarget.dataset,
                r = n.index,
                o = n.type,
                a = e.detail.selectedValue;
            t[r] = a, this.updatedValues(t), "radio" === o && this.onSelectConfirm(e)
        },
        onSelectClose: function (e, t) {
            var n = this,
                r = _defineProperty({
                    values: getValues(this.data.options)
                }, "options[".concat(e, "].visible"), !1);
            this.setData(r, function () {
                "function" == typeof t && t.call(n), n.showOptions = null, n.$wuxBackdrop.release()
            })
        },
        onSelectReset: function (e) {
            var t = _toConsumableArray(this.data.values);
            t[e.currentTarget.dataset.index] = [], this.updatedValues(t);
            var n = this.showOptions || clone(this.data.options);
            n && 0 < n.length && (n.forEach(function (e, t) {
                "filter" === e.type && (e.children = e.children.reduce(function (e, t) {
                    return [].concat(_toConsumableArray(e), [_objectSpread({}, t, {
                        children: t.children.map(function (e) {
                            return _objectSpread({}, e, {
                                checked: !1
                            })
                        })
                    })])
                }, []))
            }), this.updatedDisplayValues(n), this.showOptions = null)
        },
        onSelectConfirm: function (e) {
            var t = this,
                n = this.data,
                r = n.options,
                o = n.values,
                a = e.currentTarget.dataset,
                i = a.index,
                c = a.type,
                s = getChangedValuesFromFilter(r, o);
            "checkbox" !== c || o[i] && o[i].length || (s["options[".concat(i, "].checked")] = !1), this.setData(s, function () {
                return t.onSelectClose(i, t.onChange)
            })
        },
        onClick: function (e) {
            var t = e.currentTarget.dataset.index,
                n = this.data.options,
                r = getValues(n);
            n[t].visible || this.setData({
                values: r
            }), this.onOpenSelect(n, t)
        },
        onOpenSelect: function (e, t) {
            var o = this,
                n = 0 < arguments.length && void 0 !== e ? e : [],
                a = 1 < arguments.length && void 0 !== t ? t : 0,
                i = n[a],
                r = n.map(function (e, t) {
                    var n = Object.assign({}, e, {
                        checked: a === t && !e.checked
                    });
                    if (e.checked) {
                        var r = o.getDifference(e.groups, i.groups);
                        n.checked = !!r.length, a === t || r.length || ("object" === _typeof(n.children) && (["radio", "checkbox"].includes(e.type) && (n.children = n.children.map(function (e) {
                            return Object.assign({}, e, {
                                checked: !1
                            })
                        })), ["filter"].includes(e.type) && (n.children = n.children.map(function (e) {
                            return Object.assign({}, e, {
                                children: e.children.map(function (e) {
                                    return Object.assign({}, e, {
                                        checked: !1
                                    })
                                }),
                                selected: ""
                            })
                        }))), ["sort"].includes(e.type) && (n.sort = void 0))
                    }
                    return ["radio", "checkbox", "filter"].includes(e.type) && (n.visible = a === t && !e.visible, "filter" === e.type && o.$wuxBackdrop[a === t ? e.visible ? "release" : "retain" : "release"]()), a === t && ["sort"].includes(e.type) && (n.sort = "number" == typeof n.sort ? -n.sort : 1), n
                });
            this.setData({
                options: r,
                index: a
            }, function () {
                ["radio", "checkbox", "filter"].includes(i.type) || o.onChange()
            })
        },
        onCloseSelect: function () {
            var e = this.data.options.reduce(function (e, t, n) {
                return t.checked && t.visible ? _objectSpread({}, e, _defineProperty({}, "options[".concat(n, "].visible"), !1)) : e
            }, {});
            this.setData(e)
        },
        getDifference: function (e, t) {
            var n = 1 < arguments.length && void 0 !== t ? t : [];
            return (0 < arguments.length && void 0 !== e ? e : []).filter(function (e) {
                return n.includes(e)
            })
        },
        onChange: function () {
            var e = this,
                t = this.data.options,
                n = getValues(t),
                r = getShowOptions(t, n);
            this.updatedValues(n, function () {
                e.onCloseSelect(), e.triggerEvent("change", {
                    checkedItems: r.filter(function (e) {
                        return e.checked
                    }),
                    items: r,
                    checkedValues: n
                })
            })
        },
        onScroll: function (e) {
            this.triggerEvent("scroll", e)
        },
        onEnter: function (e) {
            this.triggerEvent("open", e)
        },
        onExit: function (e) {
            this.triggerEvent("close", e)
        }
    },
    created: function () {
        this.$wuxBackdrop = (0, _index.$wuxBackdrop)("#wux-backdrop", this)
    },
    attached: function () {
        var e = this.data.items;
        this.setData({
            options: e,
            values: getValues(e)
        })
    }
});