var feng3d;
(function (feng3d) {
    feng3d.lazy = {
        getvalue: function (lazyItem) {
            if (typeof lazyItem == "function")
                return lazyItem();
            return lazyItem;
        }
    };
})(feng3d || (feng3d = {}));
/**
 * 判断是否为基础类型（在序列化中不发生变化的对象）
 */
Object.isBaseType = function (object) {
    //基础类型
    if (object == undefined
        || object == null
        || typeof object == "boolean"
        || typeof object == "string"
        || typeof object == "number")
        return true;
};
Object.getPropertyDescriptor = function (host, property) {
    var data = Object.getOwnPropertyDescriptor(host, property);
    if (data) {
        return data;
    }
    var prototype = Object.getPrototypeOf(host);
    if (prototype) {
        return Object.getPropertyDescriptor(prototype, property);
    }
    return null;
};
Object.propertyIsWritable = function (host, property) {
    var data = Object.getPropertyDescriptor(host, property);
    if (!data)
        return false;
    if (data.get && !data.set)
        return false;
    return true;
};
Object.runFunc = function (obj, func) {
    func(obj);
    return obj;
};
Map.prototype.getKeys = function () {
    var keys = [];
    this.forEach(function (v, k) {
        keys.push(k);
    });
    return keys;
};
Map.prototype.getValues = function () {
    var values = [];
    this.forEach(function (v, k) {
        values.push(v);
    });
    return values;
};
Array.prototype.unique = function (compare) {
    if (compare === void 0) { compare = function (a, b) { return a == b; }; }
    var arr = this;
    for (var i = 0; i < arr.length; i++) {
        for (var j = arr.length - 1; j > i; j--) {
            if (compare(arr[i], arr[j]))
                arr.splice(j, 1);
        }
    }
    return this;
};
Array.prototype.delete = function (item) {
    var arr = this;
    var index = arr.indexOf(item);
    if (index != -1)
        arr.splice(index, 1);
    return index;
};
//# sourceMappingURL=index.js.map
console.log("@feng3d/polyfill-0.0.3");
(function universalModuleDefinition(root, factory)
{
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["@feng3d/polyfill"] = factory();
    else
        root["@feng3d/polyfill"] = factory();
    
    var globalObject = (typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this);
    globalObject["feng3d"] = factory();
})(this, function ()
{
    return feng3d;
});
