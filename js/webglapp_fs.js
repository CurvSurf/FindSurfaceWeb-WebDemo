/*!
 * File: webglapp_fs.js
 * Author: Sunggoo Kim <sg.kim@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function isNumber(n) {
    return typeof (n) === 'number';
}
function is(n, ctor) {
    return n instanceof ctor;
}
function max(a, b) {
    return a > b ? a : b;
}
function min(a, b) {
    return a < b ? a : b;
}
function clamp(value, vmin, vmax) {
    return max(vmin, min(vmax, value));
}
function lerp(v0, v1, t) {
    if (v0 instanceof vec4 && v1 instanceof vec4) {
        if (t instanceof vec4) {
            return v0.mul(t.negate().add(1)).add(v1.mul(t));
        }
        else {
            return v0.mul(1 - t).add(v1.mul(t));
        }
    }
    else if (v0 instanceof vec3 && v1 instanceof vec3) {
        if (t instanceof vec3) {
            return v0.mul(t.negate().add(1)).add(v1.mul(t));
        }
        else {
            return v0.mul(1 - t).add(v1.mul(t));
        }
    }
    else if (v0 instanceof vec2 && v1 instanceof vec2) {
        if (t instanceof vec2) {
            return v0.mul(t.negate().add(1)).add(v1.mul(t));
        }
        else {
            return v0.mul(1 - t).add(v1.mul(t));
        }
    }
    else {
        return v0 * (1 - t) + v1 * t;
    }
}
var vec = (function () {
    function vec() {
    }
    return vec;
}());
var vec2 = (function (_super) {
    __extends(vec2, _super);
    function vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    Object.defineProperty(vec2.prototype, "length", {
        get: function () { return Math.pow(this.dot(this), 0.5); },
        enumerable: true,
        configurable: true
    });
    vec2.prototype.assign = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            this.x = arg0.x;
            this.y = arg0.y;
        }
        else {
            this.x = arg0;
            this.y = arg1;
        }
        return this;
    };
    vec2.prototype.negate = function () {
        return new vec2(-this.x, -this.y);
    };
    vec2.prototype.normalize = function () {
        return this.div(this.length);
    };
    vec2.prototype.add = function (arg0, arg1) {
        return arg0 instanceof vec2 ? new vec2(this.x + arg0.x, this.y + arg0.y) :
            isNumber(arg1) ? new vec2(this.x + arg0, this.y + arg1) :
                new vec2(this.x + arg0, this.y + arg0);
    };
    vec2.prototype.sub = function (arg0, arg1) {
        return arg0 instanceof vec2 ? new vec2(this.x - arg0.x, this.y - arg0.y) :
            isNumber(arg1) ? new vec2(this.x - arg0, this.y - arg1) :
                new vec2(this.x - arg0, this.y - arg0);
    };
    vec2.prototype.mul = function (arg0, arg1) {
        return arg0 instanceof mat2 ? new vec2(this.dot(arg0.column(0)), this.dot(arg0.column(1))) :
            arg0 instanceof vec2 ? new vec2(this.x * arg0.x, this.y * arg0.y) :
                isNumber(arg1) ? new vec2(this.x * arg0, this.y * arg1) :
                    new vec2(this.x * arg0, this.y * arg0);
    };
    vec2.prototype.div = function (arg0, arg1) {
        return arg0 instanceof vec2 ? new vec2(this.x / arg0.x, this.y / arg0.y) :
            isNumber(arg1) ? new vec2(this.x / arg0, this.y / arg1) :
                new vec2(this.x / arg0, this.y / arg0);
    };
    vec2.prototype.dot = function (arg0, arg1) {
        return arg0 instanceof vec2 ? this.mul(arg0).sum() :
            this.mul(arg0, arg1).sum();
    };
    vec2.prototype.clamp = function (vmin, vmax) {
        return vmin instanceof vec2 && vmax instanceof vec2 ?
            new vec2(clamp(this.x, vmin.x, vmax.x), clamp(this.y, vmin.y, vmax.y)) :
            new vec2(clamp(this.x, vmin, vmax), clamp(this.y, vmin, vmax));
    };
    vec2.prototype.sum = function () { return this.x + this.y; };
    vec2.prototype.toArray = function () {
        return [this.x, this.y];
    };
    vec2.prototype.greaterThan = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return this.x > arg0.x && this.y > arg0.y;
        }
        else {
            return this.x > arg0 && this.y > arg1;
        }
    };
    vec2.prototype.lessThan = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return this.x < arg0.x && this.y < arg0.y;
        }
        else {
            return this.x < arg0 && this.y < arg1;
        }
    };
    vec2.prototype.equalTo = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return Math.abs(this.x - arg0.x) < Number.EPSILON &&
                Math.abs(this.y - arg0.y) < Number.EPSILON;
        }
        else {
            return Math.abs(this.x - arg0) < Number.EPSILON &&
                Math.abs(this.y - arg1) < Number.EPSILON;
        }
    };
    vec2.prototype.greaterThanOrEqualTo = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return this.greaterThan(arg0) || this.equalTo(arg0);
        }
        else {
            return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
    };
    vec2.prototype.lessThanOrEqualTo = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return this.lessThan(arg0) || this.equalTo(arg0);
        }
        else {
            return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
    };
    vec2.prototype.maxElement = function () {
        return Math.max(this.x, this.y);
    };
    vec2.prototype.minElement = function () {
        return Math.min(this.x, this.y);
    };
    vec2.prototype.maxElements = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return new vec2(Math.max(this.x, arg0.x), Math.max(this.y, arg0.y));
        }
        else {
            return new vec2(Math.max(this.x, arg0), Math.max(this.y, arg1));
        }
    };
    vec2.prototype.minElements = function (arg0, arg1) {
        if (arg0 instanceof vec2) {
            return new vec2(Math.min(this.x, arg0.x), Math.min(this.y, arg0.y));
        }
        else {
            return new vec2(Math.min(this.x, arg0), Math.min(this.y, arg1));
        }
    };
    vec2.prototype.clone = function () { return new vec2().assign(this); };
    Object.defineProperty(vec2.prototype, "xx", {
        get: function () { return new vec2(this.x, this.x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "xy", {
        get: function () { return new vec2(this.x, this.y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "yx", {
        get: function () { return new vec2(this.y, this.x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "yy", {
        get: function () { return new vec2(this.y, this.y); },
        enumerable: true,
        configurable: true
    });
    return vec2;
}(vec));
var vec3 = (function (_super) {
    __extends(vec3, _super);
    function vec3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        var _this = _super.call(this) || this;
        _this._x = x;
        _this._y = y;
        _this._z = z;
        return _this;
    }
    Object.defineProperty(vec3.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "z", {
        get: function () { return this._z; },
        set: function (value) { this._z = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "length", {
        get: function () { return Math.pow(this.dot(this), 0.5); },
        enumerable: true,
        configurable: true
    });
    vec3.prototype.assign = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            this._x = arg0.x;
            this._y = arg0.y;
            this._z = arg0.z;
        }
        else if (arg0 instanceof vec2) {
            this._x = arg0.x;
            this._y = arg0.y;
            this._z = arg1;
        }
        else {
            if (arg1 instanceof vec2) {
                this._x = arg0;
                this._y = arg1.x;
                this._z = arg1.y;
            }
            else {
                this._x = arg0;
                this._y = arg1;
                this._z = arg2;
            }
        }
        return this;
    };
    vec3.prototype.negate = function () {
        return new vec3(-this._x, -this._y, -this._z);
    };
    vec3.prototype.normalize = function () {
        return this.div(this.length);
    };
    vec3.prototype.add = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(this._x + arg0.x, this._y + arg0.y, this._z + arg0.z);
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this._x + arg0.x, this._y + arg0.y, this._z + arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this._x + arg0, this._y + arg1.x, this._z + arg1.y);
            }
            else if (isNumber(arg2)) {
                return new vec3(this._x + arg0, this._y + arg1, this._z + arg2);
            }
            else {
                return new vec3(this._x + arg0, this._y + arg0, this._z + arg0);
            }
        }
    };
    vec3.prototype.sub = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(this._x - arg0.x, this._y - arg0.y, this._z - arg0.z);
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this._x - arg0.x, this._y - arg0.y, this._z - arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this._x - arg0, this._y - arg1.x, this._z - arg1.y);
            }
            else if (isNumber(arg2)) {
                return new vec3(this._x - arg0, this._y - arg1, this._z - arg2);
            }
            else {
                return new vec3(this._x - arg0, this._y - arg0, this._z - arg0);
            }
        }
    };
    vec3.prototype.mul = function (arg0, arg1, arg2) {
        if (arg0 instanceof mat3) {
            return new vec3(this.dot(arg0.column(0)), this.dot(arg0.column(1)), this.dot(arg0.column(2)));
        }
        else if (arg0 instanceof vec3) {
            return new vec3(this._x * arg0.x, this._y * arg0.y, this._z * arg0.z);
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this._x * arg0.x, this._y * arg0.y, this._z * arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this._x * arg0, this._y * arg1.x, this._z * arg1.y);
            }
            else if (isNumber(arg2)) {
                return new vec3(this._x * arg0, this._y * arg1, this._z * arg2);
            }
            else {
                return new vec3(this._x * arg0, this._y * arg0, this._z * arg0);
            }
        }
    };
    vec3.prototype.div = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(this._x / arg0.x, this._y / arg0.y, this._z / arg0.z);
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this._x / arg0.x, this._y / arg0.y, this._z / arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this._x / arg0, this._y / arg1.x, this._z / arg1.y);
            }
            else if (isNumber(arg2)) {
                return new vec3(this._x / arg0, this._y / arg1, this._z / arg2);
            }
            else {
                return new vec3(this._x / arg0, this._y / arg0, this._z / arg0);
            }
        }
    };
    vec3.prototype.dot = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return this.mul(arg0).sum();
        }
        else if (arg0 instanceof vec2) {
            return this.mul(arg0, arg1).sum();
        }
        else {
            if (arg1 instanceof vec2) {
                return this.mul(arg0, arg1).sum();
            }
            else {
                return this.mul(arg0, arg1, arg2).sum();
            }
        }
    };
    vec3.prototype.cross = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(this._y * arg0.z - this._z * arg0.y, this._z * arg0.x - this._x * arg0.z, this._x * arg0.y - this._y * arg0.x);
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this._y * arg1 - this._z * arg0.y, this._z * arg0.x - this._x * arg1, this._x * arg0.y - this._y * arg0.x);
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this._y * arg1.y - this._z * arg1.x, this._z * arg0 - this._x * arg1.y, this._x * arg1.x - this._y * arg0);
            }
            else {
                return new vec3(this._y * arg2 - this._z * arg1, this._z * arg0 - this._x * arg2, this._x * arg1 - this._y * arg0);
            }
        }
    };
    vec3.prototype.clamp = function (vmin, vmax) {
        return vmin instanceof vec3 && vmax instanceof vec3 ?
            new vec3(clamp(this._x, vmin.x, vmax.x), clamp(this._y, vmin.y, vmax.y), clamp(this._z, vmin.z, vmax.z)) :
            new vec3(clamp(this._x, vmin, vmax), clamp(this._y, vmin, vmax), clamp(this._z, vmin, vmax));
    };
    vec3.prototype.sum = function () { return this._x + this._y + this._z; };
    vec3.prototype.toArray = function () {
        return [this._x, this._y, this._z];
    };
    vec3.prototype.greaterThan = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return this._x > arg0.x && this._y > arg0.y && this._z > arg0.z;
        }
        else if (arg0 instanceof vec2) {
            return this._x > arg0.x && this._y > arg0.y && this._z > arg1;
        }
        else {
            if (arg1 instanceof vec2) {
                return this._x > arg0 && this._y > arg1.x && this._z > arg1.y;
            }
            else {
                return this._x > arg0 && this._y > arg1 && this._z > arg2;
            }
        }
    };
    vec3.prototype.lessThan = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return this._x < arg0.x && this._y < arg0.y && this._z < arg0.z;
        }
        else if (arg0 instanceof vec2) {
            return this._x < arg0.x && this._y < arg0.y && this._z < arg1;
        }
        else {
            if (arg1 instanceof vec2) {
                return this._x < arg0 && this._y < arg1.x && this._z < arg1.y;
            }
            else {
                return this._x < arg0 && this._y < arg1 && this._z < arg2;
            }
        }
    };
    vec3.prototype.equalTo = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                Math.abs(this._y - arg0.y) < Number.EPSILON &&
                Math.abs(this._z - arg0.z) < Number.EPSILON;
        }
        else if (arg0 instanceof vec2) {
            return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                Math.abs(this._y - arg0.y) < Number.EPSILON &&
                Math.abs(this._z - arg1) < Number.EPSILON;
        }
        else {
            if (arg1 instanceof vec2) {
                return Math.abs(this._x - arg0) < Number.EPSILON &&
                    Math.abs(this._y - arg1.x) < Number.EPSILON &&
                    Math.abs(this._z - arg1.y) < Number.EPSILON;
            }
            else {
                return Math.abs(this._x - arg0) < Number.EPSILON &&
                    Math.abs(this._y - arg1) < Number.EPSILON &&
                    Math.abs(this._z - arg2) < Number.EPSILON;
            }
        }
    };
    vec3.prototype.greaterThanOrEqualTo = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return this.greaterThan(arg0) || this.equalTo(arg0);
        }
        else if (arg0 instanceof vec2) {
            return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else {
                return this.greaterThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
        }
    };
    vec3.prototype.lessThanOrEqualTo = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return this.lessThan(arg0) || this.equalTo(arg0);
        }
        else if (arg0 instanceof vec2) {
            return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
        else {
            if (arg1 instanceof vec2) {
                return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else {
                return this.lessThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
        }
    };
    vec3.prototype.maxElement = function () {
        return Math.max(this._x, this._y, this._z);
    };
    vec3.prototype.minElement = function () {
        return Math.min(this._x, this._y, this._z);
    };
    vec3.prototype.maxElements = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg0.z));
        }
        else if (arg0 instanceof vec2) {
            return new vec3(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg1));
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(Math.max(this._x, arg0), Math.max(this._y, arg1.x), Math.max(this._z, arg1.y));
            }
            else {
                return new vec3(Math.max(this._x, arg0), Math.max(this._y, arg1), Math.max(this._z, arg2));
            }
        }
    };
    vec3.prototype.minElements = function (arg0, arg1, arg2) {
        if (arg0 instanceof vec3) {
            return new vec3(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg0.z));
        }
        else if (arg0 instanceof vec2) {
            return new vec3(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg1));
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(Math.min(this._x, arg0), Math.min(this._y, arg1.x), Math.min(this._z, arg1.y));
            }
            else {
                return new vec3(Math.min(this._x, arg0), Math.min(this._y, arg1), Math.min(this._z, arg2));
            }
        }
    };
    vec3.prototype.clone = function () { return new vec3().assign(this); };
    vec3.angleBetween = function (arg0, arg1, arg2) {
        var v0 = arg0.normalize();
        var v1 = arg1.normalize();
        if (typeof arg2 == "undefined") {
            return Math.acos(v0.dot(v1));
        }
        else {
            var sign = v0.cross(v1).dot(arg2);
            sign /= Math.abs(sign);
            return Math.acos(v0.dot(v1)) * sign;
        }
    };
    Object.defineProperty(vec3.prototype, "xx", {
        get: function () { return new vec2(this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xy", {
        get: function () { return new vec2(this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xz", {
        get: function () { return new vec2(this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yx", {
        get: function () { return new vec2(this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yy", {
        get: function () { return new vec2(this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yz", {
        get: function () { return new vec2(this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zx", {
        get: function () { return new vec2(this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zy", {
        get: function () { return new vec2(this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zz", {
        get: function () { return new vec2(this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xxx", {
        get: function () { return new vec3(this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xxy", {
        get: function () { return new vec3(this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xxz", {
        get: function () { return new vec3(this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xyx", {
        get: function () { return new vec3(this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xyy", {
        get: function () { return new vec3(this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xyz", {
        get: function () { return new vec3(this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xzx", {
        get: function () { return new vec3(this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xzy", {
        get: function () { return new vec3(this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xzz", {
        get: function () { return new vec3(this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yxx", {
        get: function () { return new vec3(this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yxy", {
        get: function () { return new vec3(this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yxz", {
        get: function () { return new vec3(this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yyx", {
        get: function () { return new vec3(this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yyy", {
        get: function () { return new vec3(this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yyz", {
        get: function () { return new vec3(this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yzx", {
        get: function () { return new vec3(this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yzy", {
        get: function () { return new vec3(this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yzz", {
        get: function () { return new vec3(this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zxx", {
        get: function () { return new vec3(this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zxy", {
        get: function () { return new vec3(this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zxz", {
        get: function () { return new vec3(this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zyx", {
        get: function () { return new vec3(this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zyy", {
        get: function () { return new vec3(this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zyz", {
        get: function () { return new vec3(this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zzx", {
        get: function () { return new vec3(this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zzy", {
        get: function () { return new vec3(this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "zzz", {
        get: function () { return new vec3(this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    return vec3;
}(vec));
var vec4 = (function (_super) {
    __extends(vec4, _super);
    function vec4(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        var _this = _super.call(this) || this;
        _this._x = x;
        _this._y = y;
        _this._z = z;
        _this._w = w;
        return _this;
    }
    Object.defineProperty(vec4.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "z", {
        get: function () { return this._z; },
        set: function (value) { this._z = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "w", {
        get: function () { return this._w; },
        set: function (value) { this._w = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "length", {
        get: function () { return Math.pow(this.dot(this), 0.5); },
        enumerable: true,
        configurable: true
    });
    vec4.prototype.assign = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            this._x = arg0.x;
            this._y = arg0.y;
            this._z = arg0.z;
            this._w = arg0.w;
        }
        else if (arg0 instanceof vec3) {
            this._x = arg0.x;
            this._y = arg0.y;
            this._z = arg0.z;
            this._w = arg1;
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                this._x = arg0.x;
                this._y = arg0.y;
                this._z = arg1.x;
                this._w = arg1.y;
            }
            else {
                this._x = arg0.x;
                this._y = arg0.y;
                this._z = arg1;
                this._w = arg2;
            }
        }
        else {
            if (arg1 instanceof vec3) {
                this._x = arg0;
                this._y = arg1.x;
                this._z = arg1.y;
                this._w = arg1.z;
            }
            else if (arg1 instanceof vec2) {
                this._x = arg0;
                this._y = arg1.x;
                this._z = arg1.y;
                this._w = arg2;
            }
            else {
                if (arg2 instanceof vec2) {
                    this._x = arg0;
                    this._y = arg1;
                    this._z = arg2.x;
                    this._w = arg2.y;
                }
                else {
                    this._x = arg0;
                    this._y = arg1;
                    this._z = arg2;
                    this._w = arg3;
                }
            }
        }
        return this;
    };
    vec4.prototype.negate = function () {
        return new vec4(-this._x, -this._y, -this._z, -this._w);
    };
    vec4.prototype.normalize = function () {
        return this.div(this.length);
    };
    vec4.prototype.add = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return new vec4(this._x + arg0.x, this._y + arg0.y, this._z + arg0.z, this._w + arg0.w);
        }
        else if (arg0 instanceof vec3) {
            return new vec4(this._x + arg0.x, this._y + arg0.y, this._z + arg0.z, this._w + arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(this._x + arg0.x, this._y + arg0.y, this._z + arg1.x, this._w + arg1.y);
            }
            else {
                return new vec4(this._x + arg0.x, this._y + arg0.y, this._z + arg1, this._w + arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(this._x + arg0, this._y + arg1.x, this._z + arg1.y, this._w + arg1.z);
            }
            else if (arg1 instanceof vec2) {
                return new vec4(this._x + arg0, this._y + arg1.x, this._z + arg1.y, this._w + arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(this._x + arg0, this._y + arg1, this._z + arg2.x, this._w + arg2.y);
                }
                else if (isNumber(arg3)) {
                    return new vec4(this._x + arg0, this._y + arg1, this._z + arg2, this._w + arg3);
                }
                else {
                    return new vec4(this._x + arg0, this._y + arg0, this._z + arg0, this._w + arg0);
                }
            }
        }
    };
    vec4.prototype.sub = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return new vec4(this._x - arg0.x, this._y - arg0.y, this._z - arg0.z, this._w - arg0.w);
        }
        else if (arg0 instanceof vec3) {
            return new vec4(this._x - arg0.x, this._y - arg0.y, this._z - arg0.z, this._w - arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(this._x - arg0.x, this._y - arg0.y, this._z - arg1.x, this._w - arg1.y);
            }
            else {
                return new vec4(this._x - arg0.x, this._y - arg0.y, this._z - arg1, this._w - arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(this._x - arg0, this._y - arg1.x, this._z - arg1.y, this._w - arg1.z);
            }
            else if (arg1 instanceof vec2) {
                return new vec4(this._x - arg0, this._y - arg1.x, this._z - arg1.y, this._w - arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(this._x - arg0, this._y - arg1, this._z - arg2.x, this._w - arg2.y);
                }
                else if (isNumber(arg3)) {
                    return new vec4(this._x - arg0, this._y - arg1, this._z - arg2, this._w - arg3);
                }
                else {
                    return new vec4(this._x - arg0, this._y - arg0, this._z - arg0, this._w - arg0);
                }
            }
        }
    };
    vec4.prototype.mul = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof mat4) {
            return new vec4(this.dot(arg0.column(0)), this.dot(arg0.column(1)), this.dot(arg0.column(2)), this.dot(arg0.column(3)));
        }
        else if (arg0 instanceof vec4) {
            return new vec4(this._x * arg0.x, this._y * arg0.y, this._z * arg0.z, this._w * arg0.w);
        }
        else if (arg0 instanceof vec3) {
            return new vec4(this._x * arg0.x, this._y * arg0.y, this._z * arg0.z, this._w * arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(this._x * arg0.x, this._y * arg0.y, this._z * arg1.x, this._w * arg1.y);
            }
            else {
                return new vec4(this._x * arg0.x, this._y * arg0.y, this._z * arg1, this._w * arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(this._x * arg0, this._y * arg1.x, this._z * arg1.y, this._w * arg1.z);
            }
            else if (arg1 instanceof vec2) {
                return new vec4(this._x * arg0, this._y * arg1.x, this._z * arg1.y, this._w * arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(this._x * arg0, this._y * arg1, this._z * arg2.x, this._w * arg2.y);
                }
                else if (isNumber(arg3)) {
                    return new vec4(this._x * arg0, this._y * arg1, this._z * arg2, this._w * arg3);
                }
                else {
                    return new vec4(this._x * arg0, this._y * arg0, this._z * arg0, this._w * arg0);
                }
            }
        }
    };
    vec4.prototype.div = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return new vec4(this._x / arg0.x, this._y / arg0.y, this._z / arg0.z, this._w / arg0.w);
        }
        else if (arg0 instanceof vec3) {
            return new vec4(this._x / arg0.x, this._y / arg0.y, this._z / arg0.z, this._w / arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(this._x / arg0.x, this._y / arg0.y, this._z / arg1.x, this._w / arg1.y);
            }
            else {
                return new vec4(this._x / arg0.x, this._y / arg0.y, this._z / arg1, this._w / arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(this._x / arg0, this._y / arg1.x, this._z / arg1.y, this._w / arg1.z);
            }
            else if (arg1 instanceof vec2) {
                return new vec4(this._x / arg0, this._y / arg1.x, this._z / arg1.y, this._w / arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(this._x / arg0, this._y / arg1, this._z / arg2.x, this._w / arg2.y);
                }
                else if (isNumber(arg3)) {
                    return new vec4(this._x / arg0, this._y / arg1, this._z / arg2, this._w / arg3);
                }
                else {
                    return new vec4(this._x / arg0, this._y / arg0, this._z / arg0, this._w / arg0);
                }
            }
        }
    };
    vec4.prototype.dot = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return this._x * arg0.x + this._y * arg0.y + this._z * arg0.z + this._w * arg0.w;
        }
        else if (arg0 instanceof vec3) {
            return this._x * arg0.x + this._y * arg0.y + this._z * arg0.z + this._w * arg1;
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return this._x * arg0.x + this._y * arg0.y + this._z * arg1.x + this._w * arg1.y;
            }
            else {
                return this._x * arg0.x + this._y * arg0.y + this._z * arg1 + this._w * arg2;
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return this._x * arg0 + this._y * arg1.x + this._z * arg1.y + this._w * arg1.z;
            }
            else if (arg1 instanceof vec2) {
                return this._x * arg0 + this._y * arg1.x + this._z * arg1.y + this._w * arg2;
            }
            else {
                if (arg2 instanceof vec2) {
                    return this._x * arg0 + this._y * arg1 + this._z * arg2.x + this._w * arg2.y;
                }
                else {
                    return this._x * arg0 + this._y * arg1 + this._z * arg2 + this._w * arg3;
                }
            }
        }
    };
    vec4.prototype.clamp = function (vmin, vmax) {
        return vmin instanceof vec4 && vmax instanceof vec4 ?
            new vec4(clamp(this._x, vmin.x, vmax.x), clamp(this._y, vmin.y, vmax.y), clamp(this._z, vmin.z, vmax.z), clamp(this._w, vmin.w, vmax.w)) :
            new vec4(clamp(this._x, vmin, vmax), clamp(this._y, vmin, vmax), clamp(this._z, vmin, vmax), clamp(this._w, vmin, vmax));
    };
    vec4.prototype.sum = function () { return this._x + this._y + this._z + this._w; };
    vec4.prototype.toArray = function () {
        return [this._x, this._y, this._z, this._w];
    };
    vec4.prototype.greaterThan = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return this._x > arg0.x && this._y > arg0.y && this._z > arg0.z && this._w > arg0.w;
        }
        else if (arg0 instanceof vec3) {
            return this._x > arg0.x && this._y > arg0.y && this._z > arg0.z && this._w > arg1;
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return this._x > arg0.x && this._y > arg0.y && this._z > arg1.x && this._w > arg1.y;
            }
            else {
                return this._x > arg0.x && this._y > arg0.y && this._z > arg1 && this._w > arg2;
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return this._x > arg0 && this._y > arg1.x && this._z > arg1.y && this._w > arg1.z;
            }
            else if (arg1 instanceof vec2) {
                return this._x > arg0 && this._y > arg1.x && this._z > arg1.y && this._w > arg2;
            }
            else {
                if (arg2 instanceof vec2) {
                    return this._x > arg0 && this._y > arg1 && this._z > arg2.x && this._w > arg2.y;
                }
                else {
                    return this._x > arg0 && this._y > arg1 && this._z > arg2 && this._w > arg3;
                }
            }
        }
    };
    vec4.prototype.lessThan = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return this._x < arg0.x && this._y < arg0.y && this._z < arg0.z && this._w < arg0.w;
        }
        else if (arg0 instanceof vec3) {
            return this._x < arg0.x && this._y < arg0.y && this._z < arg0.z && this._w < arg1;
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return this._x < arg0.x && this._y < arg0.y && this._z < arg1.x && this._w < arg1.y;
            }
            else {
                return this._x < arg0.x && this._y < arg0.y && this._z < arg1 && this._w < arg2;
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return this._x < arg0 && this._y < arg1.x && this._z < arg1.y && this._w < arg1.z;
            }
            else if (arg1 instanceof vec2) {
                return this._x < arg0 && this._y < arg1.x && this._z < arg1.y && this._w < arg2;
            }
            else {
                if (arg2 instanceof vec2) {
                    return this._x < arg0 && this._y < arg1 && this._z < arg2.x && this._w < arg2.y;
                }
                else {
                    return this._x < arg0 && this._y < arg1 && this._z < arg2 && this._w < arg3;
                }
            }
        }
    };
    vec4.prototype.equalTo = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                Math.abs(this._y - arg0.y) < Number.EPSILON &&
                Math.abs(this._z - arg0.z) < Number.EPSILON &&
                Math.abs(this._w - arg0.w) < Number.EPSILON;
        }
        else if (arg0 instanceof vec3) {
            return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                Math.abs(this._y - arg0.y) < Number.EPSILON &&
                Math.abs(this._z - arg0.z) < Number.EPSILON &&
                Math.abs(this._w - arg1) < Number.EPSILON;
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                    Math.abs(this._y - arg0.y) < Number.EPSILON &&
                    Math.abs(this._z - arg1.x) < Number.EPSILON &&
                    Math.abs(this._w - arg1.y) < Number.EPSILON;
            }
            else {
                return Math.abs(this._x - arg0.x) < Number.EPSILON &&
                    Math.abs(this._y - arg0.y) < Number.EPSILON &&
                    Math.abs(this._z - arg1) < Number.EPSILON &&
                    Math.abs(this._w - arg2) < Number.EPSILON;
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return Math.abs(this._x - arg0) < Number.EPSILON &&
                    Math.abs(this._y - arg1.x) < Number.EPSILON &&
                    Math.abs(this._z - arg1.y) < Number.EPSILON &&
                    Math.abs(this._w - arg1.z) < Number.EPSILON;
            }
            else if (arg1 instanceof vec2) {
                return Math.abs(this._x - arg0) < Number.EPSILON &&
                    Math.abs(this._y - arg1.x) < Number.EPSILON &&
                    Math.abs(this._z - arg1.y) < Number.EPSILON &&
                    Math.abs(this._w - arg2) < Number.EPSILON;
            }
            else {
                if (arg2 instanceof vec2) {
                    return Math.abs(this._x - arg0) < Number.EPSILON &&
                        Math.abs(this._y - arg1) < Number.EPSILON &&
                        Math.abs(this._z - arg2.x) < Number.EPSILON &&
                        Math.abs(this._w - arg2.y) < Number.EPSILON;
                }
                else {
                    return Math.abs(this._x - arg0) < Number.EPSILON &&
                        Math.abs(this._y - arg1) < Number.EPSILON &&
                        Math.abs(this._z - arg2) < Number.EPSILON &&
                        Math.abs(this._w - arg3) < Number.EPSILON;
                }
            }
        }
    };
    vec4.prototype.greaterThanOrEqualTo = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return this.greaterThan(arg0) || this.equalTo(arg0);
        }
        else if (arg0 instanceof vec3) {
            return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else {
                return this.greaterThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return this.greaterThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else if (arg1 instanceof vec2) {
                return this.greaterThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return this.greaterThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
                }
                else {
                    return this.lessThan(arg0, arg1, arg2, arg3) || this.equalTo(arg0, arg1, arg2, arg3);
                }
            }
        }
    };
    vec4.prototype.lessThanOrEqualTo = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return this.lessThan(arg0) || this.equalTo(arg0);
        }
        else if (arg0 instanceof vec3) {
            return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else {
                return this.lessThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return this.lessThan(arg0, arg1) || this.equalTo(arg0, arg1);
            }
            else if (arg1 instanceof vec2) {
                return this.lessThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
            }
            else {
                if (arg2 instanceof vec2) {
                    return this.lessThan(arg0, arg1, arg2) || this.equalTo(arg0, arg1, arg2);
                }
                else {
                    return this.lessThan(arg0, arg1, arg2, arg3) || this.equalTo(arg0, arg1, arg2, arg3);
                }
            }
        }
    };
    vec4.prototype.maxElement = function () {
        return Math.max(this._x, this._y, this._z, this._w);
    };
    vec4.prototype.minElement = function () {
        return Math.min(this._x, this._y, this._z, this._w);
    };
    vec4.prototype.maxElements = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return new vec4(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg0.z), Math.max(this._w, arg0.w));
        }
        else if (arg0 instanceof vec3) {
            return new vec4(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg0.z), Math.max(this._w, arg1));
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg1.x), Math.max(this._w, arg1.y));
            }
            else {
                return new vec4(Math.max(this._x, arg0.x), Math.max(this._y, arg0.y), Math.max(this._z, arg1), Math.max(this._w, arg2));
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(Math.max(this._x, arg0), Math.max(this._y, arg1.x), Math.max(this._z, arg1.y), Math.max(this._w, arg1.z));
            }
            else if (arg1 instanceof vec2) {
                return new vec4(Math.max(this._x, arg0), Math.max(this._y, arg1.x), Math.max(this._z, arg1.y), Math.max(this._w, arg2));
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(Math.max(this._x, arg0), Math.max(this._y, arg1), Math.max(this._z, arg2.x), Math.max(this._w, arg2.y));
                }
                else {
                    return new vec4(Math.max(this._x, arg0), Math.max(this._y, arg1), Math.max(this._z, arg2), Math.max(this._w, arg3));
                }
            }
        }
    };
    vec4.prototype.minElements = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof vec4) {
            return new vec4(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg0.z), Math.min(this._w, arg0.w));
        }
        else if (arg0 instanceof vec3) {
            return new vec4(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg0.z), Math.min(this._w, arg1));
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg1.x), Math.min(this._w, arg1.y));
            }
            else {
                return new vec4(Math.min(this._x, arg0.x), Math.min(this._y, arg0.y), Math.min(this._z, arg1), Math.min(this._w, arg2));
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(Math.min(this._x, arg0), Math.min(this._y, arg1.x), Math.min(this._z, arg1.y), Math.min(this._w, arg1.z));
            }
            else if (arg1 instanceof vec2) {
                return new vec4(Math.min(this._x, arg0), Math.min(this._y, arg1.x), Math.min(this._z, arg1.y), Math.min(this._w, arg2));
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(Math.min(this._x, arg0), Math.min(this._y, arg1), Math.min(this._z, arg2.x), Math.min(this._w, arg2.y));
                }
                else {
                    return new vec4(Math.min(this._x, arg0), Math.min(this._y, arg1), Math.min(this._z, arg2), Math.min(this._w, arg3));
                }
            }
        }
    };
    vec4.prototype.clone = function () { return new vec4().assign(this); };
    Object.defineProperty(vec4.prototype, "xx", {
        get: function () { return new vec2(this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xy", {
        get: function () { return new vec2(this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xz", {
        get: function () { return new vec2(this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xw", {
        get: function () { return new vec2(this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yx", {
        get: function () { return new vec2(this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yy", {
        get: function () { return new vec2(this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yz", {
        get: function () { return new vec2(this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yw", {
        get: function () { return new vec2(this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zx", {
        get: function () { return new vec2(this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zy", {
        get: function () { return new vec2(this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zz", {
        get: function () { return new vec2(this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zw", {
        get: function () { return new vec2(this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wx", {
        get: function () { return new vec2(this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wy", {
        get: function () { return new vec2(this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wz", {
        get: function () { return new vec2(this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ww", {
        get: function () { return new vec2(this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxx", {
        get: function () { return new vec3(this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxy", {
        get: function () { return new vec3(this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxz", {
        get: function () { return new vec3(this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxw", {
        get: function () { return new vec3(this._x, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyx", {
        get: function () { return new vec3(this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyy", {
        get: function () { return new vec3(this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyz", {
        get: function () { return new vec3(this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyw", {
        get: function () { return new vec3(this._x, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzx", {
        get: function () { return new vec3(this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzy", {
        get: function () { return new vec3(this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzz", {
        get: function () { return new vec3(this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzw", {
        get: function () { return new vec3(this._x, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwx", {
        get: function () { return new vec3(this._x, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwy", {
        get: function () { return new vec3(this._x, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwz", {
        get: function () { return new vec3(this._x, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xww", {
        get: function () { return new vec3(this._x, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxx", {
        get: function () { return new vec3(this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxy", {
        get: function () { return new vec3(this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxz", {
        get: function () { return new vec3(this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxw", {
        get: function () { return new vec3(this._y, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyx", {
        get: function () { return new vec3(this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyy", {
        get: function () { return new vec3(this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyz", {
        get: function () { return new vec3(this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyw", {
        get: function () { return new vec3(this._y, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzx", {
        get: function () { return new vec3(this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzy", {
        get: function () { return new vec3(this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzz", {
        get: function () { return new vec3(this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzw", {
        get: function () { return new vec3(this._y, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywx", {
        get: function () { return new vec3(this._y, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywy", {
        get: function () { return new vec3(this._y, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywz", {
        get: function () { return new vec3(this._y, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yww", {
        get: function () { return new vec3(this._y, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxx", {
        get: function () { return new vec3(this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxy", {
        get: function () { return new vec3(this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxz", {
        get: function () { return new vec3(this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxw", {
        get: function () { return new vec3(this._z, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyx", {
        get: function () { return new vec3(this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyy", {
        get: function () { return new vec3(this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyz", {
        get: function () { return new vec3(this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyw", {
        get: function () { return new vec3(this._z, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzx", {
        get: function () { return new vec3(this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzy", {
        get: function () { return new vec3(this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzz", {
        get: function () { return new vec3(this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzw", {
        get: function () { return new vec3(this._z, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwx", {
        get: function () { return new vec3(this._z, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwy", {
        get: function () { return new vec3(this._z, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwz", {
        get: function () { return new vec3(this._z, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zww", {
        get: function () { return new vec3(this._z, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxx", {
        get: function () { return new vec3(this._w, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxy", {
        get: function () { return new vec3(this._w, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxz", {
        get: function () { return new vec3(this._w, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxw", {
        get: function () { return new vec3(this._w, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyx", {
        get: function () { return new vec3(this._w, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyy", {
        get: function () { return new vec3(this._w, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyz", {
        get: function () { return new vec3(this._w, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyw", {
        get: function () { return new vec3(this._w, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzx", {
        get: function () { return new vec3(this._w, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzy", {
        get: function () { return new vec3(this._w, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzz", {
        get: function () { return new vec3(this._w, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzw", {
        get: function () { return new vec3(this._w, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwx", {
        get: function () { return new vec3(this._w, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwy", {
        get: function () { return new vec3(this._w, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwz", {
        get: function () { return new vec3(this._w, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "www", {
        get: function () { return new vec3(this._w, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxxx", {
        get: function () { return new vec4(this._x, this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxxy", {
        get: function () { return new vec4(this._x, this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxxz", {
        get: function () { return new vec4(this._x, this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxxw", {
        get: function () { return new vec4(this._x, this._x, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxyx", {
        get: function () { return new vec4(this._x, this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxyy", {
        get: function () { return new vec4(this._x, this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxyz", {
        get: function () { return new vec4(this._x, this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxyw", {
        get: function () { return new vec4(this._x, this._x, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxzx", {
        get: function () { return new vec4(this._x, this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxzy", {
        get: function () { return new vec4(this._x, this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxzz", {
        get: function () { return new vec4(this._x, this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxzw", {
        get: function () { return new vec4(this._x, this._x, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxwx", {
        get: function () { return new vec4(this._x, this._x, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxwy", {
        get: function () { return new vec4(this._x, this._x, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxwz", {
        get: function () { return new vec4(this._x, this._x, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xxww", {
        get: function () { return new vec4(this._x, this._x, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyxx", {
        get: function () { return new vec4(this._x, this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyxy", {
        get: function () { return new vec4(this._x, this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyxz", {
        get: function () { return new vec4(this._x, this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyxw", {
        get: function () { return new vec4(this._x, this._y, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyyx", {
        get: function () { return new vec4(this._x, this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyyy", {
        get: function () { return new vec4(this._x, this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyyz", {
        get: function () { return new vec4(this._x, this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyyw", {
        get: function () { return new vec4(this._x, this._y, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyzx", {
        get: function () { return new vec4(this._x, this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyzy", {
        get: function () { return new vec4(this._x, this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyzz", {
        get: function () { return new vec4(this._x, this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyzw", {
        get: function () { return new vec4(this._x, this._y, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xywx", {
        get: function () { return new vec4(this._x, this._y, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xywy", {
        get: function () { return new vec4(this._x, this._y, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xywz", {
        get: function () { return new vec4(this._x, this._y, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xyww", {
        get: function () { return new vec4(this._x, this._y, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzxx", {
        get: function () { return new vec4(this._x, this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzxy", {
        get: function () { return new vec4(this._x, this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzxz", {
        get: function () { return new vec4(this._x, this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzxw", {
        get: function () { return new vec4(this._x, this._z, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzyx", {
        get: function () { return new vec4(this._x, this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzyy", {
        get: function () { return new vec4(this._x, this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzyz", {
        get: function () { return new vec4(this._x, this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzyw", {
        get: function () { return new vec4(this._x, this._z, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzzx", {
        get: function () { return new vec4(this._x, this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzzy", {
        get: function () { return new vec4(this._x, this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzzz", {
        get: function () { return new vec4(this._x, this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzzw", {
        get: function () { return new vec4(this._x, this._z, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzwx", {
        get: function () { return new vec4(this._x, this._z, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzwy", {
        get: function () { return new vec4(this._x, this._z, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzwz", {
        get: function () { return new vec4(this._x, this._z, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xzww", {
        get: function () { return new vec4(this._x, this._z, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwxx", {
        get: function () { return new vec4(this._x, this._w, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwxy", {
        get: function () { return new vec4(this._x, this._w, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwxz", {
        get: function () { return new vec4(this._x, this._w, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwxw", {
        get: function () { return new vec4(this._x, this._w, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwyx", {
        get: function () { return new vec4(this._x, this._w, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwyy", {
        get: function () { return new vec4(this._x, this._w, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwyz", {
        get: function () { return new vec4(this._x, this._w, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwyw", {
        get: function () { return new vec4(this._x, this._w, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwzx", {
        get: function () { return new vec4(this._x, this._w, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwzy", {
        get: function () { return new vec4(this._x, this._w, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwzz", {
        get: function () { return new vec4(this._x, this._w, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwzw", {
        get: function () { return new vec4(this._x, this._w, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwwx", {
        get: function () { return new vec4(this._x, this._w, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwwy", {
        get: function () { return new vec4(this._x, this._w, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwwz", {
        get: function () { return new vec4(this._x, this._w, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "xwww", {
        get: function () { return new vec4(this._x, this._w, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxxx", {
        get: function () { return new vec4(this._y, this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxxy", {
        get: function () { return new vec4(this._y, this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxxz", {
        get: function () { return new vec4(this._y, this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxxw", {
        get: function () { return new vec4(this._y, this._x, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxyx", {
        get: function () { return new vec4(this._y, this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxyy", {
        get: function () { return new vec4(this._y, this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxyz", {
        get: function () { return new vec4(this._y, this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxyw", {
        get: function () { return new vec4(this._y, this._x, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxzx", {
        get: function () { return new vec4(this._y, this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxzy", {
        get: function () { return new vec4(this._y, this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxzz", {
        get: function () { return new vec4(this._y, this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxzw", {
        get: function () { return new vec4(this._y, this._x, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxwx", {
        get: function () { return new vec4(this._y, this._x, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxwy", {
        get: function () { return new vec4(this._y, this._x, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxwz", {
        get: function () { return new vec4(this._y, this._x, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yxww", {
        get: function () { return new vec4(this._y, this._x, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyxx", {
        get: function () { return new vec4(this._y, this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyxy", {
        get: function () { return new vec4(this._y, this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyxz", {
        get: function () { return new vec4(this._y, this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyxw", {
        get: function () { return new vec4(this._y, this._y, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyyx", {
        get: function () { return new vec4(this._y, this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyyy", {
        get: function () { return new vec4(this._y, this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyyz", {
        get: function () { return new vec4(this._y, this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyyw", {
        get: function () { return new vec4(this._y, this._y, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyzx", {
        get: function () { return new vec4(this._y, this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyzy", {
        get: function () { return new vec4(this._y, this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyzz", {
        get: function () { return new vec4(this._y, this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyzw", {
        get: function () { return new vec4(this._y, this._y, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yywx", {
        get: function () { return new vec4(this._y, this._y, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yywy", {
        get: function () { return new vec4(this._y, this._y, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yywz", {
        get: function () { return new vec4(this._y, this._y, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yyww", {
        get: function () { return new vec4(this._y, this._y, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzxx", {
        get: function () { return new vec4(this._y, this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzxy", {
        get: function () { return new vec4(this._y, this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzxz", {
        get: function () { return new vec4(this._y, this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzxw", {
        get: function () { return new vec4(this._y, this._z, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzyx", {
        get: function () { return new vec4(this._y, this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzyy", {
        get: function () { return new vec4(this._y, this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzyz", {
        get: function () { return new vec4(this._y, this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzyw", {
        get: function () { return new vec4(this._y, this._z, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzzx", {
        get: function () { return new vec4(this._y, this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzzy", {
        get: function () { return new vec4(this._y, this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzzz", {
        get: function () { return new vec4(this._y, this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzzw", {
        get: function () { return new vec4(this._y, this._z, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzwx", {
        get: function () { return new vec4(this._y, this._z, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzwy", {
        get: function () { return new vec4(this._y, this._z, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzwz", {
        get: function () { return new vec4(this._y, this._z, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "yzww", {
        get: function () { return new vec4(this._y, this._z, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywxx", {
        get: function () { return new vec4(this._y, this._w, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywxy", {
        get: function () { return new vec4(this._y, this._w, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywxz", {
        get: function () { return new vec4(this._y, this._w, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywxw", {
        get: function () { return new vec4(this._y, this._w, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywyx", {
        get: function () { return new vec4(this._y, this._w, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywyy", {
        get: function () { return new vec4(this._y, this._w, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywyz", {
        get: function () { return new vec4(this._y, this._w, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywyw", {
        get: function () { return new vec4(this._y, this._w, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywzx", {
        get: function () { return new vec4(this._y, this._w, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywzy", {
        get: function () { return new vec4(this._y, this._w, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywzz", {
        get: function () { return new vec4(this._y, this._w, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywzw", {
        get: function () { return new vec4(this._y, this._w, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywwx", {
        get: function () { return new vec4(this._y, this._w, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywwy", {
        get: function () { return new vec4(this._y, this._w, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywwz", {
        get: function () { return new vec4(this._y, this._w, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "ywww", {
        get: function () { return new vec4(this._y, this._w, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxxx", {
        get: function () { return new vec4(this._z, this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxxy", {
        get: function () { return new vec4(this._z, this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxxz", {
        get: function () { return new vec4(this._z, this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxxw", {
        get: function () { return new vec4(this._z, this._x, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxyx", {
        get: function () { return new vec4(this._z, this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxyy", {
        get: function () { return new vec4(this._z, this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxyz", {
        get: function () { return new vec4(this._z, this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxyw", {
        get: function () { return new vec4(this._z, this._x, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxzx", {
        get: function () { return new vec4(this._z, this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxzy", {
        get: function () { return new vec4(this._z, this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxzz", {
        get: function () { return new vec4(this._z, this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxzw", {
        get: function () { return new vec4(this._z, this._x, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxwx", {
        get: function () { return new vec4(this._z, this._x, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxwy", {
        get: function () { return new vec4(this._z, this._x, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxwz", {
        get: function () { return new vec4(this._z, this._x, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zxww", {
        get: function () { return new vec4(this._z, this._x, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyxx", {
        get: function () { return new vec4(this._z, this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyxy", {
        get: function () { return new vec4(this._z, this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyxz", {
        get: function () { return new vec4(this._z, this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyxw", {
        get: function () { return new vec4(this._z, this._y, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyyx", {
        get: function () { return new vec4(this._z, this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyyy", {
        get: function () { return new vec4(this._z, this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyyz", {
        get: function () { return new vec4(this._z, this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyyw", {
        get: function () { return new vec4(this._z, this._y, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyzx", {
        get: function () { return new vec4(this._z, this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyzy", {
        get: function () { return new vec4(this._z, this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyzz", {
        get: function () { return new vec4(this._z, this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyzw", {
        get: function () { return new vec4(this._z, this._y, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zywx", {
        get: function () { return new vec4(this._z, this._y, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zywy", {
        get: function () { return new vec4(this._z, this._y, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zywz", {
        get: function () { return new vec4(this._z, this._y, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zyww", {
        get: function () { return new vec4(this._z, this._y, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzxx", {
        get: function () { return new vec4(this._z, this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzxy", {
        get: function () { return new vec4(this._z, this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzxz", {
        get: function () { return new vec4(this._z, this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzxw", {
        get: function () { return new vec4(this._z, this._z, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzyx", {
        get: function () { return new vec4(this._z, this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzyy", {
        get: function () { return new vec4(this._z, this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzyz", {
        get: function () { return new vec4(this._z, this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzyw", {
        get: function () { return new vec4(this._z, this._z, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzzx", {
        get: function () { return new vec4(this._z, this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzzy", {
        get: function () { return new vec4(this._z, this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzzz", {
        get: function () { return new vec4(this._z, this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzzw", {
        get: function () { return new vec4(this._z, this._z, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzwx", {
        get: function () { return new vec4(this._z, this._z, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzwy", {
        get: function () { return new vec4(this._z, this._z, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzwz", {
        get: function () { return new vec4(this._z, this._z, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zzww", {
        get: function () { return new vec4(this._z, this._z, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwxx", {
        get: function () { return new vec4(this._z, this._w, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwxy", {
        get: function () { return new vec4(this._z, this._w, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwxz", {
        get: function () { return new vec4(this._z, this._w, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwxw", {
        get: function () { return new vec4(this._z, this._w, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwyx", {
        get: function () { return new vec4(this._z, this._w, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwyy", {
        get: function () { return new vec4(this._z, this._w, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwyz", {
        get: function () { return new vec4(this._z, this._w, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwyw", {
        get: function () { return new vec4(this._z, this._w, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwzx", {
        get: function () { return new vec4(this._z, this._w, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwzy", {
        get: function () { return new vec4(this._z, this._w, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwzz", {
        get: function () { return new vec4(this._z, this._w, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwzw", {
        get: function () { return new vec4(this._z, this._w, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwwx", {
        get: function () { return new vec4(this._z, this._w, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwwy", {
        get: function () { return new vec4(this._z, this._w, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwwz", {
        get: function () { return new vec4(this._z, this._w, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "zwww", {
        get: function () { return new vec4(this._z, this._w, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxxx", {
        get: function () { return new vec4(this._w, this._x, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxxy", {
        get: function () { return new vec4(this._w, this._x, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxxz", {
        get: function () { return new vec4(this._w, this._x, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxxw", {
        get: function () { return new vec4(this._w, this._x, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxyx", {
        get: function () { return new vec4(this._w, this._x, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxyy", {
        get: function () { return new vec4(this._w, this._x, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxyz", {
        get: function () { return new vec4(this._w, this._x, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxyw", {
        get: function () { return new vec4(this._w, this._x, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxzx", {
        get: function () { return new vec4(this._w, this._x, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxzy", {
        get: function () { return new vec4(this._w, this._x, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxzz", {
        get: function () { return new vec4(this._w, this._x, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxzw", {
        get: function () { return new vec4(this._w, this._x, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxwx", {
        get: function () { return new vec4(this._w, this._x, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxwy", {
        get: function () { return new vec4(this._w, this._x, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxwz", {
        get: function () { return new vec4(this._w, this._x, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wxww", {
        get: function () { return new vec4(this._w, this._x, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyxx", {
        get: function () { return new vec4(this._w, this._y, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyxy", {
        get: function () { return new vec4(this._w, this._y, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyxz", {
        get: function () { return new vec4(this._w, this._y, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyxw", {
        get: function () { return new vec4(this._w, this._y, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyyx", {
        get: function () { return new vec4(this._w, this._y, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyyy", {
        get: function () { return new vec4(this._w, this._y, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyyz", {
        get: function () { return new vec4(this._w, this._y, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyyw", {
        get: function () { return new vec4(this._w, this._y, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyzx", {
        get: function () { return new vec4(this._w, this._y, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyzy", {
        get: function () { return new vec4(this._w, this._y, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyzz", {
        get: function () { return new vec4(this._w, this._y, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyzw", {
        get: function () { return new vec4(this._w, this._y, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wywx", {
        get: function () { return new vec4(this._w, this._y, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wywy", {
        get: function () { return new vec4(this._w, this._y, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wywz", {
        get: function () { return new vec4(this._w, this._y, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wyww", {
        get: function () { return new vec4(this._w, this._y, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzxx", {
        get: function () { return new vec4(this._w, this._z, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzxy", {
        get: function () { return new vec4(this._w, this._z, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzxz", {
        get: function () { return new vec4(this._w, this._z, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzxw", {
        get: function () { return new vec4(this._w, this._z, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzyx", {
        get: function () { return new vec4(this._w, this._z, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzyy", {
        get: function () { return new vec4(this._w, this._z, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzyz", {
        get: function () { return new vec4(this._w, this._z, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzyw", {
        get: function () { return new vec4(this._w, this._z, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzzx", {
        get: function () { return new vec4(this._w, this._z, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzzy", {
        get: function () { return new vec4(this._w, this._z, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzzz", {
        get: function () { return new vec4(this._w, this._z, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzzw", {
        get: function () { return new vec4(this._w, this._z, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzwx", {
        get: function () { return new vec4(this._w, this._z, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzwy", {
        get: function () { return new vec4(this._w, this._z, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzwz", {
        get: function () { return new vec4(this._w, this._z, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wzww", {
        get: function () { return new vec4(this._w, this._z, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwxx", {
        get: function () { return new vec4(this._w, this._w, this._x, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwxy", {
        get: function () { return new vec4(this._w, this._w, this._x, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwxz", {
        get: function () { return new vec4(this._w, this._w, this._x, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwxw", {
        get: function () { return new vec4(this._w, this._w, this._x, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwyx", {
        get: function () { return new vec4(this._w, this._w, this._y, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwyy", {
        get: function () { return new vec4(this._w, this._w, this._y, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwyz", {
        get: function () { return new vec4(this._w, this._w, this._y, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwyw", {
        get: function () { return new vec4(this._w, this._w, this._y, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwzx", {
        get: function () { return new vec4(this._w, this._w, this._z, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwzy", {
        get: function () { return new vec4(this._w, this._w, this._z, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwzz", {
        get: function () { return new vec4(this._w, this._w, this._z, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwzw", {
        get: function () { return new vec4(this._w, this._w, this._z, this._w); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwwx", {
        get: function () { return new vec4(this._w, this._w, this._w, this._x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwwy", {
        get: function () { return new vec4(this._w, this._w, this._w, this._y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwwz", {
        get: function () { return new vec4(this._w, this._w, this._w, this._z); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "wwww", {
        get: function () { return new vec4(this._w, this._w, this._w, this._w); },
        enumerable: true,
        configurable: true
    });
    return vec4;
}(vec));
var mat = (function () {
    function mat() {
    }
    return mat;
}());
var mat2 = (function (_super) {
    __extends(mat2, _super);
    function mat2(_00, _01, _10, _11) {
        if (_00 === void 0) { _00 = 1; }
        if (_01 === void 0) { _01 = 0; }
        if (_10 === void 0) { _10 = 0; }
        if (_11 === void 0) { _11 = 1; }
        var _this = _super.call(this) || this;
        _this[0] = [_00, _01];
        _this[1] = [_10, _11];
        return _this;
    }
    mat2.prototype.identity = function () {
        this[0][0] = this[1][1] = 1;
        this[0][1] = this[1][0] = 0;
        return this;
    };
    mat2.prototype.transpose = function () {
        return new mat2(this[0][0], this[1][0], this[0][1], this[1][1]);
    };
    mat2.prototype.column = function (c) {
        return new vec2(this[0][c], this[1][c]);
    };
    mat2.prototype.row = function (r) {
        return new vec2(this[r][0], this[r][1]);
    };
    mat2.prototype.negate = function () {
        return new mat2(-this[0][0], -this[0][1], -this[1][0], -this[0][0]);
    };
    mat2.prototype.add = function (arg0) {
        return (arg0 instanceof mat2) ?
            new mat2(this[0][0] + arg0[0][0], this[0][1] + arg0[0][1], this[1][0] + arg0[1][0], this[1][1] + arg0[1][1]) :
            new mat2(this[0][0] + arg0, this[0][1] + arg0, this[1][0] + arg0, this[1][1] + arg0);
    };
    mat2.prototype.sub = function (arg0) {
        return (arg0 instanceof mat2) ?
            new mat2(this[0][0] - arg0[0][0], this[0][1] - arg0[0][1], this[1][0] - arg0[1][0], this[1][1] - arg0[1][1]) :
            new mat2(this[0][0] - arg0, this[0][1] - arg0, this[1][0] - arg0, this[1][1] - arg0);
    };
    mat2.prototype.mul = function (arg0, arg1) {
        return arg0 instanceof mat2 ? new mat2(this.row(0).dot(arg0.column(0)), this.row(0).dot(arg0.column(1)), this.row(1).dot(arg0.column(0)), this.row(1).dot(arg0.column(1))) :
            arg0 instanceof vec2 ? new vec2(arg0.dot(this.row(0)), arg0.dot(this.row(1))) :
                isNumber(arg1) ? new vec2(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1)) :
                    new mat2(this[0][0] * arg0, this[0][1] * arg0, this[1][0] * arg0, this[1][1] * arg0);
    };
    mat2.prototype.determinant = function () {
        return this[0][0] * this[1][1] - this[0][1] * this[1][0];
    };
    mat2.prototype.inverse = function () {
        var det = this.determinant();
        if (det === 0) {
            return null;
        }
        var s = 1 / det;
        return new mat2(this[1][1], -this[0][1], -this[1][0], this[0][0]).mul(s);
    };
    mat2.prototype.toArray = function () {
        return [this[0][0], this[0][1],
            this[1][0], this[1][1]];
    };
    mat2.prototype.clone = function () { return new mat2(this[0][0], this[0][1], this[1][0], this[1][1]); };
    return mat2;
}(mat));
var mat3 = (function (_super) {
    __extends(mat3, _super);
    function mat3(_00, _01, _02, _10, _11, _12, _20, _21, _22) {
        if (_00 === void 0) { _00 = 1; }
        if (_01 === void 0) { _01 = 0; }
        if (_02 === void 0) { _02 = 0; }
        if (_10 === void 0) { _10 = 0; }
        if (_11 === void 0) { _11 = 1; }
        if (_12 === void 0) { _12 = 0; }
        if (_20 === void 0) { _20 = 0; }
        if (_21 === void 0) { _21 = 0; }
        if (_22 === void 0) { _22 = 1; }
        var _this = _super.call(this) || this;
        _this[0] = [_00, _01, _02];
        _this[1] = [_10, _11, _12];
        _this[2] = [_20, _21, _22];
        return _this;
    }
    mat3.prototype.identity = function () {
        this[0][0] = this[1][1] = this[2][2] = 1;
        this[0][1] = this[0][2] = this[1][0] = 0;
        this[1][2] = this[2][0] = this[2][1] = 0;
        return this;
    };
    mat3.prototype.transpose = function () {
        return new mat3(this[0][0], this[1][0], this[2][0], this[0][1], this[1][1], this[2][1], this[0][2], this[1][2], this[2][2]);
    };
    mat3.prototype.column = function (c) {
        return new vec3(this[0][c], this[1][c], this[2][c]);
    };
    mat3.prototype.row = function (r) {
        return new vec3(this[r][0], this[r][1], this[r][2]);
    };
    mat3.prototype.negate = function () {
        return new mat3(-this[0][0], -this[0][1], -this[0][2], -this[1][0], -this[1][1], -this[1][2], -this[2][0], -this[2][1], -this[2][2]);
    };
    mat3.prototype.add = function (arg0) {
        return (arg0 instanceof mat3) ?
            new mat3(this[0][0] + arg0[0][0], this[0][1] + arg0[0][1], this[0][2] + arg0[0][2], this[1][0] + arg0[1][0], this[1][1] + arg0[1][1], this[1][2] + arg0[1][2], this[2][0] + arg0[2][0], this[2][1] + arg0[2][1], this[2][2] + arg0[2][2]) :
            new mat3(this[0][0] + arg0, this[0][1] + arg0, this[0][2] + arg0, this[1][0] + arg0, this[1][1] + arg0, this[1][2] + arg0, this[2][0] + arg0, this[2][1] + arg0, this[2][2] + arg0);
    };
    mat3.prototype.sub = function (arg0) {
        return (arg0 instanceof mat3) ?
            new mat3(this[0][0] - arg0[0][0], this[0][1] - arg0[0][1], this[0][2] - arg0[0][2], this[1][0] - arg0[1][0], this[1][1] - arg0[1][1], this[1][2] - arg0[1][2], this[2][0] - arg0[2][0], this[2][1] - arg0[2][1], this[2][2] - arg0[2][2]) :
            new mat3(this[0][0] - arg0, this[0][1] - arg0, this[0][2] - arg0, this[1][0] - arg0, this[1][1] - arg0, this[1][2] - arg0, this[2][0] - arg0, this[2][1] - arg0, this[2][2] - arg0);
    };
    mat3.prototype.mul = function (arg0, arg1, arg2) {
        if (arg0 instanceof mat3) {
            var r0 = this.row(0), r1 = this.row(1), r2 = this.row(2);
            var c0 = arg0.column(0), c1 = arg0.column(1), c2 = arg0.column(2);
            return new mat3(r0.dot(c0), r0.dot(c1), r0.dot(c2), r1.dot(c0), r1.dot(c1), r1.dot(c2), r2.dot(c0), r2.dot(c1), r2.dot(c2));
        }
        else if (arg0 instanceof vec3) {
            return new vec3(this.row(0).dot(arg0), this.row(1).dot(arg0), this.row(2).dot(arg0));
        }
        else if (arg0 instanceof vec2) {
            return new vec3(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1), this.row(2).dot(arg0, arg1));
        }
        else {
            if (arg1 instanceof vec2) {
                return new vec3(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1), this.row(2).dot(arg0, arg1));
            }
            else if (isNumber(arg2)) {
                return new vec3(this.row(0).dot(arg0, arg1, arg2), this.row(1).dot(arg0, arg1, arg2), this.row(2).dot(arg0, arg1, arg2));
            }
            else {
                return new vec3(this.row(0).dot(arg0, arg0, arg0), this.row(1).dot(arg0, arg0, arg0), this.row(2).dot(arg0, arg0, arg0));
            }
        }
    };
    mat3.prototype.determinant = function () {
        return this[0][0] * (this[1][1] * this[2][2] - this[1][2] * this[2][1]) +
            this[0][1] * (this[1][2] * this[2][0] - this[1][0] * this[2][2]) +
            this[0][2] * (this[1][0] * this[2][1] - this[1][1] * this[2][0]);
    };
    mat3.prototype.inverse = function () {
        var det = this.determinant();
        if (det === 0) {
            return null;
        }
        var s = 1 / det;
        return new mat3((this[1][1] * this[2][2] - this[2][1] * this[1][2]) * s, (this[0][2] * this[2][1] - this[0][1] * this[2][2]) * s, (this[0][1] * this[1][2] - this[0][2] * this[1][1]) * s, (this[1][2] * this[2][0] - this[1][0] * this[2][2]) * s, (this[0][0] * this[2][2] - this[0][2] * this[2][0]) * s, (this[1][0] * this[0][2] - this[0][0] * this[1][2]) * s, (this[1][0] * this[2][1] - this[2][0] * this[1][1]) * s, (this[2][0] * this[0][1] - this[0][0] * this[2][1]) * s, (this[0][0] * this[1][1] - this[1][0] * this[0][1]) * s);
    };
    mat3.prototype.mat2 = function (row, col) {
        if (row === void 0) { row = 0; }
        if (col === void 0) { col = 0; }
        return new mat2(this[row][col], this[row][col + 1], this[row + 1][col], this[row + 1][col + 1]);
    };
    mat3.prototype.toArray = function () {
        return [this[0][0], this[0][1], this[0][2],
            this[1][0], this[1][1], this[1][2],
            this[2][0], this[2][1], this[2][2]];
    };
    mat3.prototype.clone = function () { return new mat3(this[0][0], this[0][1], this[0][2], this[1][0], this[1][1], this[1][2], this[2][0], this[2][1], this[2][2]); };
    return mat3;
}(mat));
var mat4 = (function (_super) {
    __extends(mat4, _super);
    function mat4(_00, _01, _02, _03, _10, _11, _12, _13, _20, _21, _22, _23, _30, _31, _32, _33) {
        if (_00 === void 0) { _00 = 1; }
        if (_01 === void 0) { _01 = 0; }
        if (_02 === void 0) { _02 = 0; }
        if (_03 === void 0) { _03 = 0; }
        if (_10 === void 0) { _10 = 0; }
        if (_11 === void 0) { _11 = 1; }
        if (_12 === void 0) { _12 = 0; }
        if (_13 === void 0) { _13 = 0; }
        if (_20 === void 0) { _20 = 0; }
        if (_21 === void 0) { _21 = 0; }
        if (_22 === void 0) { _22 = 1; }
        if (_23 === void 0) { _23 = 0; }
        if (_30 === void 0) { _30 = 0; }
        if (_31 === void 0) { _31 = 0; }
        if (_32 === void 0) { _32 = 0; }
        if (_33 === void 0) { _33 = 1; }
        var _this = _super.call(this) || this;
        _this[0] = [_00, _01, _02, _03];
        _this[1] = [_10, _11, _12, _13];
        _this[2] = [_20, _21, _22, _23];
        _this[3] = [_30, _31, _32, _33];
        return _this;
    }
    mat4.prototype.assign = function (m) {
        for (var c = 0; c < 4; c++) {
            for (var r = 0; r < 4; r++) {
                this[c][r] = m[c][r];
            }
        }
        return this;
    };
    mat4.prototype.identity = function () {
        this[0][0] = this[1][1] = this[2][2] = this[3][3] = 1;
        this[0][1] = this[0][2] = this[0][3] = this[1][0] = 0;
        this[1][2] = this[1][3] = this[2][0] = this[2][1] = 0;
        this[2][3] = this[3][0] = this[3][1] = this[3][2] = 0;
        return this;
    };
    mat4.prototype.transpose = function () {
        return new mat4(this[0][0], this[1][0], this[2][0], this[3][0], this[0][1], this[1][1], this[2][1], this[3][1], this[0][2], this[1][2], this[2][2], this[3][2], this[0][3], this[1][3], this[2][3], this[3][3]);
    };
    mat4.prototype.column = function (c) {
        return new vec4(this[0][c], this[1][c], this[2][c], this[3][c]);
    };
    mat4.prototype.row = function (r) {
        return new vec4(this[r][0], this[r][1], this[r][2], this[r][3]);
    };
    mat4.prototype.negate = function () {
        return new mat4(-this[0][0], -this[0][1], -this[0][2], -this[0][3], -this[1][0], -this[1][1], -this[1][2], -this[1][3], -this[2][0], -this[2][1], -this[2][2], -this[2][3], -this[3][0], -this[3][1], -this[3][2], -this[3][3]);
    };
    mat4.prototype.add = function (arg0) {
        return (arg0 instanceof mat4) ?
            new mat4(this[0][0] + arg0[0][0], this[0][1] + arg0[0][1], this[0][2] + arg0[0][2], this[0][0] + arg0[0][3], this[1][0] + arg0[1][0], this[1][1] + arg0[1][1], this[1][2] + arg0[1][2], this[1][0] + arg0[1][3], this[2][0] + arg0[2][0], this[2][1] + arg0[2][1], this[2][2] + arg0[2][2], this[2][0] + arg0[2][3], this[3][0] + arg0[3][0], this[3][1] + arg0[3][1], this[3][2] + arg0[3][2], this[3][0] + arg0[3][3]) :
            new mat4(this[0][0] + arg0, this[0][1] + arg0, this[0][2] + arg0, this[0][3] + arg0, this[1][0] + arg0, this[1][1] + arg0, this[1][2] + arg0, this[1][3] + arg0, this[2][0] + arg0, this[2][1] + arg0, this[2][2] + arg0, this[2][3] + arg0, this[3][0] + arg0, this[3][1] + arg0, this[3][2] + arg0, this[3][3] + arg0);
    };
    mat4.prototype.sub = function (arg0) {
        return (arg0 instanceof mat4) ?
            new mat4(this[0][0] - arg0[0][0], this[0][1] - arg0[0][1], this[0][2] - arg0[0][2], this[0][0] - arg0[0][3], this[1][0] - arg0[1][0], this[1][1] - arg0[1][1], this[1][2] - arg0[1][2], this[1][0] - arg0[1][3], this[2][0] - arg0[2][0], this[2][1] - arg0[2][1], this[2][2] - arg0[2][2], this[2][0] - arg0[2][3], this[3][0] - arg0[3][0], this[3][1] - arg0[3][1], this[3][2] - arg0[3][2], this[3][0] - arg0[3][3]) :
            new mat4(this[0][0] - arg0, this[0][1] - arg0, this[0][2] - arg0, this[0][3] - arg0, this[1][0] - arg0, this[1][1] - arg0, this[1][2] - arg0, this[1][3] - arg0, this[2][0] - arg0, this[2][1] - arg0, this[2][2] - arg0, this[2][3] - arg0, this[3][0] - arg0, this[3][1] - arg0, this[3][2] - arg0, this[3][3] - arg0);
    };
    mat4.prototype.mul = function (arg0, arg1, arg2, arg3) {
        if (arg0 instanceof mat4) {
            var r0 = this.row(0), r1 = this.row(1), r2 = this.row(2), r3 = this.row(3);
            var c0 = arg0.column(0), c1 = arg0.column(1), c2 = arg0.column(2), c3 = arg0.column(3);
            return new mat4(r0.dot(c0), r0.dot(c1), r0.dot(c2), r0.dot(c3), r1.dot(c0), r1.dot(c1), r1.dot(c2), r1.dot(c3), r2.dot(c0), r2.dot(c1), r2.dot(c2), r2.dot(c3), r3.dot(c0), r3.dot(c1), r3.dot(c2), r3.dot(c3));
        }
        else if (arg0 instanceof vec4) {
            return new vec4(this.row(0).dot(arg0), this.row(1).dot(arg0), this.row(2).dot(arg0), this.row(3).dot(arg0));
        }
        else if (arg0 instanceof vec3) {
            return new vec4(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1), this.row(2).dot(arg0, arg1), this.row(3).dot(arg0, arg1));
        }
        else if (arg0 instanceof vec2) {
            if (arg1 instanceof vec2) {
                return new vec4(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1), this.row(2).dot(arg0, arg1), this.row(3).dot(arg0, arg1));
            }
            else {
                return new vec4(this.row(0).dot(arg0, arg1, arg2), this.row(1).dot(arg0, arg1, arg2), this.row(2).dot(arg0, arg1, arg2), this.row(3).dot(arg0, arg1, arg2));
            }
        }
        else {
            if (arg1 instanceof vec3) {
                return new vec4(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1), this.row(2).dot(arg0, arg1), this.row(3).dot(arg0, arg1));
            }
            else if (arg1 instanceof vec2) {
                return new vec4(this.row(0).dot(arg0, arg1, arg2), this.row(1).dot(arg0, arg1, arg2), this.row(2).dot(arg0, arg1, arg2), this.row(3).dot(arg0, arg1, arg2));
            }
            else {
                if (arg2 instanceof vec2) {
                    return new vec4(this.row(0).dot(arg0, arg1, arg2), this.row(1).dot(arg0, arg1, arg2), this.row(2).dot(arg0, arg1, arg2), this.row(3).dot(arg0, arg1, arg2));
                }
                else if (isNumber(arg3)) {
                    return new vec4(this.row(0).dot(arg0, arg1, arg2, arg3), this.row(1).dot(arg0, arg1, arg2, arg3), this.row(2).dot(arg0, arg1, arg2, arg3), this.row(3).dot(arg0, arg1, arg2, arg3));
                }
                else {
                    return new vec4(this.row(0).dot(arg0, arg0, arg0, arg0), this.row(1).dot(arg0, arg0, arg0, arg0), this.row(2).dot(arg0, arg0, arg0, arg0), this.row(3).dot(arg0, arg0, arg0, arg0));
                }
            }
        }
    };
    mat4.prototype.determinant = function () {
        return this[3][0] * this[2][1] * this[1][2] * this[0][3] - this[2][0] * this[3][1] * this[1][2] * this[0][3] -
            this[3][0] * this[1][1] * this[2][2] * this[0][3] + this[1][0] * this[3][1] * this[2][2] * this[0][3] +
            this[2][0] * this[1][1] * this[3][2] * this[0][3] - this[1][0] * this[2][1] * this[3][2] * this[0][3] -
            this[3][0] * this[2][1] * this[0][2] * this[1][3] + this[2][0] * this[3][1] * this[0][2] * this[1][3] +
            this[3][0] * this[0][1] * this[2][2] * this[1][3] - this[0][0] * this[3][1] * this[2][2] * this[1][3] -
            this[2][0] * this[0][1] * this[3][2] * this[1][3] + this[0][0] * this[2][1] * this[3][2] * this[1][3] +
            this[3][0] * this[1][1] * this[0][2] * this[2][3] - this[1][0] * this[3][1] * this[0][2] * this[2][3] -
            this[3][0] * this[0][1] * this[1][2] * this[2][3] + this[0][0] * this[3][1] * this[1][2] * this[2][3] +
            this[1][0] * this[0][1] * this[3][2] * this[2][3] - this[0][0] * this[1][1] * this[3][2] * this[2][3] -
            this[2][0] * this[1][1] * this[0][2] * this[3][3] + this[1][0] * this[2][1] * this[0][2] * this[3][3] +
            this[2][0] * this[0][1] * this[1][2] * this[3][3] - this[0][0] * this[2][1] * this[1][2] * this[3][3] -
            this[1][0] * this[0][1] * this[2][2] * this[3][3] + this[0][0] * this[1][1] * this[2][2] * this[3][3];
    };
    mat4.prototype.inverse = function () {
        var det = this.determinant();
        if (det === 0) {
            return null;
        }
        var s = 1 / det;
        return new mat4((this[2][1] * this[3][2] * this[1][3] - this[3][1] * this[2][2] * this[1][3] + this[3][1] * this[1][2] * this[2][3] - this[1][1] * this[3][2] * this[2][3] - this[2][1] * this[1][2] * this[3][3] + this[1][1] * this[2][2] * this[3][3]) * s, (this[3][1] * this[2][2] * this[0][3] - this[2][1] * this[3][2] * this[0][3] - this[3][1] * this[0][2] * this[2][3] + this[0][1] * this[3][2] * this[2][3] + this[2][1] * this[0][2] * this[3][3] - this[0][1] * this[2][2] * this[3][3]) * s, (this[1][1] * this[3][2] * this[0][3] - this[3][1] * this[1][2] * this[0][3] + this[3][1] * this[0][2] * this[1][3] - this[0][1] * this[3][2] * this[1][3] - this[1][1] * this[0][2] * this[3][3] + this[0][1] * this[1][2] * this[3][3]) * s, (this[2][1] * this[1][2] * this[0][3] - this[1][1] * this[2][2] * this[0][3] - this[2][1] * this[0][2] * this[1][3] + this[0][1] * this[2][2] * this[1][3] + this[1][1] * this[0][2] * this[2][3] - this[0][1] * this[1][2] * this[2][3]) * s, (this[3][0] * this[2][2] * this[1][3] - this[2][0] * this[3][2] * this[1][3] - this[3][0] * this[1][2] * this[2][3] + this[1][0] * this[3][2] * this[2][3] + this[2][0] * this[1][2] * this[3][3] - this[1][0] * this[2][2] * this[3][3]) * s, (this[2][0] * this[3][2] * this[0][3] - this[3][0] * this[2][2] * this[0][3] + this[3][0] * this[0][2] * this[2][3] - this[0][0] * this[3][2] * this[2][3] - this[2][0] * this[0][2] * this[3][3] + this[0][0] * this[2][2] * this[3][3]) * s, (this[3][0] * this[1][2] * this[0][3] - this[1][0] * this[3][2] * this[0][3] - this[3][0] * this[0][2] * this[1][3] + this[0][0] * this[3][2] * this[1][3] + this[1][0] * this[0][2] * this[3][3] - this[0][0] * this[1][2] * this[3][3]) * s, (this[1][0] * this[2][2] * this[0][3] - this[2][0] * this[1][2] * this[0][3] + this[2][0] * this[0][2] * this[1][3] - this[0][0] * this[2][2] * this[1][3] - this[1][0] * this[0][2] * this[2][3] + this[0][0] * this[1][2] * this[2][3]) * s, (this[2][0] * this[3][1] * this[1][3] - this[3][0] * this[2][1] * this[1][3] + this[3][0] * this[1][1] * this[2][3] - this[1][0] * this[3][1] * this[2][3] - this[2][0] * this[1][1] * this[3][3] + this[1][0] * this[2][1] * this[3][3]) * s, (this[3][0] * this[2][1] * this[0][3] - this[2][0] * this[3][1] * this[0][3] - this[3][0] * this[0][1] * this[2][3] + this[0][0] * this[3][1] * this[2][3] + this[2][0] * this[0][1] * this[3][3] - this[0][0] * this[2][1] * this[3][3]) * s, (this[1][0] * this[3][1] * this[0][3] - this[3][0] * this[1][1] * this[0][3] + this[3][0] * this[0][1] * this[1][3] - this[0][0] * this[3][1] * this[1][3] - this[1][0] * this[0][1] * this[3][3] + this[0][0] * this[1][1] * this[3][3]) * s, (this[2][0] * this[1][1] * this[0][3] - this[1][0] * this[2][1] * this[0][3] - this[2][0] * this[0][1] * this[1][3] + this[0][0] * this[2][1] * this[1][3] + this[1][0] * this[0][1] * this[2][3] - this[0][0] * this[1][1] * this[2][3]) * s, (this[3][0] * this[2][1] * this[1][2] - this[2][0] * this[3][1] * this[1][2] - this[3][0] * this[1][1] * this[2][2] + this[1][0] * this[3][1] * this[2][2] + this[2][0] * this[1][1] * this[3][2] - this[1][0] * this[2][1] * this[3][2]) * s, (this[2][0] * this[3][1] * this[0][2] - this[3][0] * this[2][1] * this[0][2] + this[3][0] * this[0][1] * this[2][2] - this[0][0] * this[3][1] * this[2][2] - this[2][0] * this[0][1] * this[3][2] + this[0][0] * this[2][1] * this[3][2]) * s, (this[3][0] * this[1][1] * this[0][2] - this[1][0] * this[3][1] * this[0][2] - this[3][0] * this[0][1] * this[1][2] + this[0][0] * this[3][1] * this[1][2] + this[1][0] * this[0][1] * this[3][2] - this[0][0] * this[1][1] * this[3][2]) * s, (this[1][0] * this[2][1] * this[0][2] - this[2][0] * this[1][1] * this[0][2] + this[2][0] * this[0][1] * this[1][2] - this[0][0] * this[2][1] * this[1][2] - this[1][0] * this[0][1] * this[2][2] + this[0][0] * this[1][1] * this[2][2]) * s);
    };
    mat4.prototype.mat2 = function (row, col) {
        if (row === void 0) { row = 0; }
        if (col === void 0) { col = 0; }
        return new mat2(this[row][col], this[row][col + 1], this[row + 1][col], this[row + 1][col + 1]);
    };
    mat4.prototype.mat3 = function (row, col) {
        if (row === void 0) { row = 0; }
        if (col === void 0) { col = 0; }
        return new mat3(this[row][col], this[row][col + 1], this[row][col + 2], this[row + 1][col], this[row + 1][col + 1], this[row + 1][col + 2], this[row + 2][col], this[row + 2][col + 1], this[row + 2][col + 2]);
    };
    mat4.prototype.toArray = function () {
        return [this[0][0], this[0][1], this[0][2], this[0][3],
            this[1][0], this[1][1], this[1][2], this[1][3],
            this[2][0], this[2][1], this[2][2], this[2][3],
            this[3][0], this[3][1], this[3][2], this[3][3]];
    };
    mat4.prototype.clone = function () { return new mat4(this[0][0], this[0][1], this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]); };
    mat4.translate = function (arg0, arg1, arg2) {
        return new mat4(1, 0, 0, (arg0 instanceof vec3) ? arg0.x : arg0, 0, 1, 0, (arg0 instanceof vec3) ? arg0.y : arg1, 0, 0, 1, (arg0 instanceof vec3) ? arg0.z : arg2, 0, 0, 0, 1);
    };
    mat4.scale = function (arg0, arg1, arg2) {
        return new mat4((arg0 instanceof vec3) ? arg0.x : arg0, 0, 0, 0, 0, (arg0 instanceof vec3) ? arg0.y : arg1, 0, 0, 0, 0, (arg0 instanceof vec3) ? arg0.z : arg2, 0, 0, 0, 0, 1);
    };
    mat4.rotate = function (axis, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var _a = axis.toArray(), x = _a[0], y = _a[1], z = _a[2];
        return new mat4(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0, x * y * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0, 0, 0, 0, 1);
    };
    mat4.rotateX = function (angle) {
        return mat4.rotate(new vec3(1, 0, 0), angle);
    };
    mat4.rotateY = function (angle) {
        return mat4.rotate(new vec3(0, 1, 0), angle);
    };
    mat4.rotateZ = function (angle) {
        return mat4.rotate(new vec3(0, 0, 1), angle);
    };
    mat4.lookAt = function (eye, at, up) {
        var n = eye.sub(at).normalize();
        var u = up.cross(n).normalize();
        var v = n.cross(u).normalize();
        return new mat4(u.x, u.y, u.z, -u.dot(eye), v.x, v.y, v.z, -v.dot(eye), n.x, n.y, n.z, -n.dot(eye), 0, 0, 0, 1);
    };
    mat4.lookAtInv = function (eye, at, up) {
        var v3 = mat4.lookAt(eye, at, up).mat3().transpose();
        var v4 = new mat4(v3[0][0], v3[0][1], v3[0][2], 0, v3[1][0], v3[1][1], v3[1][2], 0, v3[2][0], v3[2][1], v3[2][2], 0, 0, 0, 0, 1);
        return mat4.translate(eye).mul(v4);
    };
    mat4.orthographic = function (width, height, near, far) {
        return new mat4(2 / width, 0, 0, 0, 0, 2 / height, 0, 0, 0, 0, 2 / (near - far), (near + far) / (near - far), 0, 0, 0, 1);
    };
    mat4.perspective = function (fovy, aspectRatio, near, far) {
        var oot = 1 / Math.tan(fovy * 0.5);
        var nmf = near - far;
        return new mat4(oot / aspectRatio, 0, 0, 0, 0, oot, 0, 0, 0, 0, (near + far) / nmf, (2.0 * near * far) / nmf, 0, 0, -1, 0);
    };
    return mat4;
}(mat));
var Camera = (function () {
    function Camera(eye, at, up, near, far) {
        this.eye = eye;
        this.at = at;
        this.up = up;
        this.near = near;
        this.far = far;
        this.updateViewMatrix();
    }
    Camera.prototype.updateViewMatrix = function () {
        this.view = mat4.lookAt(this.eye, this.at, this.up);
    };
    Camera.prototype.assign = function (c) {
        this.eye.assign(c.eye);
        this.at.assign(c.at);
        this.up.assign(c.up);
        this.near = c.near;
        this.far = c.far;
        this.updateViewMatrix();
        return this;
    };
    return Camera;
}());
var OrthographicCamera = (function (_super) {
    __extends(OrthographicCamera, _super);
    function OrthographicCamera(eye, at, up, width, height, near, far, zoomFactor) {
        if (zoomFactor === void 0) { zoomFactor = 1; }
        var _this = _super.call(this, eye, at, up, near, far) || this;
        _this.width = width;
        _this.height = height;
        _this.zoomFactor = zoomFactor;
        _this.updateProjMatrix();
        return _this;
    }
    OrthographicCamera.prototype.updateProjMatrix = function () {
        this.proj = mat4.orthographic(this.width * this.zoomFactor, this.height * this.zoomFactor, this.near, this.far);
    };
    OrthographicCamera.prototype.assign = function (c) {
        _super.prototype.assign.call(this, c);
        this.width = c.width;
        this.height = c.height;
        this.zoomFactor = c.zoomFactor;
        this.updateProjMatrix();
        return this;
    };
    OrthographicCamera.prototype.clone = function () {
        return new OrthographicCamera(new vec3().assign(this.eye), new vec3().assign(this.at), new vec3().assign(this.up), this.width, this.height, this.near, this.far, this.zoomFactor);
    };
    return OrthographicCamera;
}(Camera));
var PerspectiveCamera = (function (_super) {
    __extends(PerspectiveCamera, _super);
    function PerspectiveCamera(eye, at, up, fovy, aspectRatio, near, far) {
        var _this = _super.call(this, eye, at, up, near, far) || this;
        _this.fovy = fovy;
        _this.aspectRatio = aspectRatio;
        _this.updateProjMatrix();
        return _this;
    }
    PerspectiveCamera.prototype.updateProjMatrix = function () {
        this.proj = mat4.perspective(this.fovy, this.aspectRatio, this.near, this.far);
    };
    PerspectiveCamera.prototype.assign = function (c) {
        _super.prototype.assign.call(this, c);
        this.fovy = c.fovy;
        this.aspectRatio = c.aspectRatio;
        this.updateProjMatrix();
        return this;
    };
    PerspectiveCamera.prototype.clone = function () {
        return new PerspectiveCamera(new vec3().assign(this.eye), new vec3().assign(this.at), new vec3().assign(this.up), this.fovy, this.aspectRatio, this.near, this.far);
    };
    return PerspectiveCamera;
}(Camera));
var CameraBehavior;
(function (CameraBehavior) {
    CameraBehavior[CameraBehavior["NOTHING"] = 0] = "NOTHING";
    CameraBehavior[CameraBehavior["CAMERA_ORBITING"] = 1] = "CAMERA_ORBITING";
    CameraBehavior[CameraBehavior["CAMERA_PANNING"] = 2] = "CAMERA_PANNING";
    CameraBehavior[CameraBehavior["CAMERA_ZOOMING"] = 3] = "CAMERA_ZOOMING";
    CameraBehavior[CameraBehavior["CAMERA_ROLLING"] = 4] = "CAMERA_ROLLING";
    CameraBehavior[CameraBehavior["OBJECT_ROTATING"] = 5] = "OBJECT_ROTATING";
    CameraBehavior[CameraBehavior["OBJECT_SCALING"] = 6] = "OBJECT_SCALING";
    CameraBehavior[CameraBehavior["OBJECT_ROLLING"] = 7] = "OBJECT_ROLLING";
})(CameraBehavior || (CameraBehavior = {}));
var CameraMovement = (function () {
    function CameraMovement() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.forward = false;
        this.backward = false;
    }
    CameraMovement.prototype.reset = function () {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.forward = false;
        this.backward = false;
    };
    CameraMovement.prototype.any = function () {
        return this.up || this.down || this.left || this.right || this.forward || this.backward;
    };
    return CameraMovement;
}());
var Trackball = (function () {
    function Trackball(currentCam) {
        this._mode = CameraBehavior.NOTHING;
        this._move = new CameraMovement();
        this._curr = currentCam.clone();
        this._prev = currentCam.clone();
        this._home = currentCam.clone();
        this._mouse = new vec2();
        this._speed = { zooming: 0.5, panning: 0.1, rotation: 0.75, translation: 0.0005 };
        this._transform = new mat4();
        this._objRoll = new mat4();
        this._objRotate = new mat4();
        this._objScale = new mat4();
        this._bUpdateTransform = false;
    }
    Object.defineProperty(Trackball.prototype, "eye", {
        get: function () { return this._curr.eye.add(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "at", {
        get: function () { return this._curr.at.add(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "up", {
        get: function () { return this._curr.up.add(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "zoomFactor", {
        get: function () { return this._curr.zoomFactor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "zoomingSpeed", {
        get: function () { return this._speed.zooming; },
        set: function (value) { this._speed.zooming = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "panningSpeed", {
        get: function () { return this._speed.panning; },
        set: function (value) { this._speed.panning = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "rotationSpeed", {
        get: function () { return this._speed.rotation; },
        set: function (value) { this._speed.rotation = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "translationSpeed", {
        get: function () { return this._speed.translation; },
        set: function (value) { this._speed.translation = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "movement", {
        get: function () { return this._move; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "viewMatrix", {
        get: function () { return this._curr.view; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "projectionMatrix", {
        get: function () { return this._curr.proj; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "transformMatrix", {
        get: function () { return this._bUpdateTransform ? this._objScale.mul(this._objRoll.mul(this._objRotate.mul(this._transform))) : this._transform; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trackball.prototype, "updateTransform", {
        set: function (b) { this._bUpdateTransform = b; },
        enumerable: true,
        configurable: true
    });
    Trackball.prototype.cameraOrbit = function (d) {
        var eye = this._prev.eye;
        var center = this._prev.at;
        var up = this._prev.up;
        var yawPitch = d.mul(Math.PI * 0.5);
        var yawAxis = up;
        var pitchAxis = center.sub(eye).cross(yawAxis).normalize();
        var T = mat4.translate(center);
        var Y = mat4.rotate(yawAxis, yawPitch.x);
        var P = mat4.rotate(pitchAxis, yawPitch.y);
        var invT = mat4.translate(center.negate());
        this._curr.eye.assign(T.mul(P.mul(Y.mul(invT.mul(new vec4(eye.x, eye.y, eye.z, 1))))).xyz);
        this._curr.updateViewMatrix();
    };
    Trackball.prototype.cameraPan = function (d) {
        var eye = this._prev.eye;
        var center = this._prev.at;
        var up = this._prev.up;
        var dir = eye.sub(center);
        var ocam = this._curr;
        var ds = d.mul(ocam.width, ocam.height).mul(0.5 * ocam.zoomFactor);
        var n = dir.normalize();
        var u = up.cross(n).normalize();
        var v = n.cross(u).normalize();
        var o = u.mul(ds.x).add(v.mul(ds.y));
        this._curr.eye.assign(eye.sub(o));
        this._curr.at.assign(center.sub(o));
        this._curr.updateViewMatrix();
    };
    Trackball.prototype.cameraZoom = function (d) {
        var t = Math.pow(2, -d.x);
        var eye = this._prev.eye;
        var center = this._prev.at;
        if (this._curr instanceof OrthographicCamera) {
            this._curr.zoomFactor = this._prev.zoomFactor * t;
        }
        else if (this._curr instanceof PerspectiveCamera) {
            var dist = eye.sub(center).length;
            if (dist < this._curr.near && t < 1)
                return;
            if (dist > this._curr.far && t > 1)
                return;
            this._curr.eye.assign(lerp(center, eye, t));
        }
        this._curr.updateViewMatrix();
    };
    Trackball.prototype.cameraRoll = function (d) {
        var eye = this._prev.eye;
        var center = this._prev.at;
        var up = this._prev.up;
        var n = center.sub(eye).normalize();
        var u = up.cross(n).normalize();
        var v = n.cross(u).normalize();
        var p0 = new vec3().assign(this._mouse, 0).normalize();
        var p1 = new vec3().assign(this._mouse.add(d), 0).normalize();
        var angle = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));
        this._curr.up.assign(mat4.rotate(n, angle).mul(up, 0).xyz);
        this._curr.updateViewMatrix();
    };
    Trackball.prototype.objectRotate = function (d) {
        var angle = d.length * Math.PI * 0.5;
        var n = new vec3(-d.y, d.x, 0).normalize().mul(this._prev.view.mat3());
        this._objRotate = mat4.rotate(n, angle);
        this._bUpdateTransform = true;
    };
    Trackball.prototype.objectScale = function (d) {
        var t = 9 * Math.pow(10, -d.y);
        this._objScale = mat4.scale(t, t, t);
        this._bUpdateTransform = true;
    };
    Trackball.prototype.objectRoll = function (d) {
        var eye = this._prev.eye;
        var center = this._prev.at;
        var p0 = new vec3(this._mouse.x, this._mouse.y, 0).normalize();
        var p1 = new vec3().assign(this._mouse.add(d), 0).normalize();
        var angle = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));
        var n = center.sub(eye).normalize().mul(this._prev.view.mat3());
        this._objRoll = mat4.rotate(n, angle);
        this._bUpdateTransform = true;
    };
    Trackball.prototype.reset = function (cam) {
        this._mode = CameraBehavior.NOTHING;
        this._move.reset();
        this._curr.assign(cam == undefined ? this._home : cam);
        this._prev.assign(cam == undefined ? this._home : cam);
        this._transform.identity();
        this._objRoll.identity();
        this._objScale.identity();
        this._objRotate.identity();
        this._bUpdateTransform = false;
        this._mouse.assign(0, 0);
        this._curr.updateViewMatrix();
        this._curr.updateProjMatrix();
    };
    Trackball.prototype.mouse = function (x, y, behavior) {
        this._prev.assign(this._curr);
        this._mouse.assign(clamp(2 * x - 1, -1, 1), clamp(1 - 2 * y, -1, 1));
        this._mode = behavior;
        if (this._bUpdateTransform) {
            this._transform = this._objScale.mul(this._objRoll.mul(this._objRotate.mul(this._transform)));
            this._objScale.identity();
            this._objRoll.identity();
            this._objRotate.identity();
            this._bUpdateTransform = false;
        }
    };
    Trackball.prototype.motion = function (x, y) {
        x = clamp(2 * x - 1, -1, 1);
        y = clamp(1 - 2 * y, -1, 1);
        var d = new vec2(x, y).sub(this._mouse);
        if (d.x == 0 && d.y == 0)
            return;
        switch (this._mode) {
            case CameraBehavior.CAMERA_ORBITING:
                this.cameraOrbit(d);
                break;
            case CameraBehavior.CAMERA_PANNING:
                this.cameraPan(d);
                break;
            case CameraBehavior.CAMERA_ROLLING:
                this.cameraRoll(d);
                break;
            case CameraBehavior.CAMERA_ZOOMING:
                this.cameraZoom(d);
                break;
            case CameraBehavior.OBJECT_ROTATING:
                this.objectRotate(d);
                break;
            case CameraBehavior.OBJECT_SCALING:
                this.objectScale(d);
                break;
            case CameraBehavior.OBJECT_ROLLING:
                this.objectRoll(d);
                break;
            default: break;
        }
    };
    Trackball.prototype.updateViewport = function (width, height, fovy_deg) {
        if (fovy_deg == null) {
            var ocam = this._curr;
            ocam.width = width;
            ocam.height = height;
            ocam = this._prev;
            ocam.width = width;
            ocam.height = height;
            ocam = this._home;
            ocam.width = width;
            ocam.height = height;
        }
        else {
            this._curr.fovy = fovy_deg * (Math.PI / 180);
            this._curr.aspectRatio = width / height;
            this._home.fovy = fovy_deg * (Math.PI / 180);
            this._home.aspectRatio = width / height;
        }
    };
    Trackball.prototype.update = function (elapsedTime) {
        if (this._move.any()) {
            var distance = this._home.eye.sub(this._home.at).length * elapsedTime * this._speed.translation;
            var n = this._curr.at.sub(this._curr.eye).normalize();
            var u = this._curr.up.cross(n).normalize();
            var v = n.cross(u).normalize();
            var dt = new vec3();
            var forward = n.mul(distance);
            var left = u.mul(distance);
            var up = v.mul(distance);
            if (this._move.forward) {
                dt = dt.add(n.mul(distance));
            }
            if (this._move.backward) {
                dt = dt.sub(n.mul(distance));
            }
            if (this._move.left) {
                dt = dt.add(u.mul(distance));
            }
            if (this._move.right) {
                dt = dt.sub(u.mul(distance));
            }
            if (this._move.up) {
                dt = dt.add(v.mul(distance));
            }
            if (this._move.down) {
                dt = dt.sub(v.mul(distance));
            }
            this._curr.eye = this._curr.eye.add(dt);
            this._curr.at = this._curr.at.add(dt);
        }
        this._curr.updateViewMatrix();
        this._curr.updateProjMatrix();
    };
    return Trackball;
}());
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["Point"] = 0] = "Point";
    PrimitiveType[PrimitiveType["Line"] = 1] = "Line";
    PrimitiveType[PrimitiveType["Triangle"] = 2] = "Triangle";
})(PrimitiveType || (PrimitiveType = {}));
;
function GenerateWireSphereVertexData(subdiv) {
    if (subdiv === void 0) { subdiv = 4; }
    var points = [];
    var vertices = [];
    var indices = [];
    var subdivide = function (i0, i1, i2, level) {
        if (level-- > 0) {
            var p0 = points[i0];
            var p1 = points[i1];
            var p2 = points[i2];
            var p01 = p0.add(p1).normalize();
            var p12 = p1.add(p2).normalize();
            var p20 = p2.add(p0).normalize();
            points.push(p01, p12, p20);
            vertices.push.apply(vertices, p01.toArray().concat(p12.toArray(), p20.toArray()));
            var i01 = points.length - 3;
            var i12 = i01 + 1;
            var i20 = i12 + 1;
            subdivide(i0, i01, i20, level);
            subdivide(i01, i1, i12, level);
            subdivide(i01, i12, i20, level);
            subdivide(i20, i12, i2, level);
        }
        else {
            indices.push(i0, i1, i1, i2, i2, i0);
        }
    };
    points.push(new vec3(1, 0, 0));
    vertices.push(1, 0, 0);
    points.push(new vec3(-1, 0, 0));
    vertices.push(-1, 0, 0);
    points.push(new vec3(0, 1, 0));
    vertices.push(0, 1, 0);
    points.push(new vec3(0, -1, 0));
    vertices.push(0, -1, 0);
    points.push(new vec3(0, 0, 1));
    vertices.push(0, 0, 1);
    points.push(new vec3(0, 0, -1));
    vertices.push(0, 0, -1);
    subdivide(2, 4, 0, subdiv);
    subdivide(2, 0, 5, subdiv);
    subdivide(2, 5, 1, subdiv);
    subdivide(2, 1, 4, subdiv);
    subdivide(3, 0, 4, subdiv);
    subdivide(3, 5, 0, subdiv);
    subdivide(3, 1, 5, subdiv);
    subdivide(3, 4, 1, subdiv);
    return { vertices: vertices, indices: indices };
}
function GenerateSphereVertexData(subdiv) {
    if (subdiv === void 0) { subdiv = 4; }
    var points = [];
    var vertices = [];
    var indices = [];
    var subdivide = function (i0, i1, i2, level) {
        if (level-- > 0) {
            var p0 = points[i0];
            var p1 = points[i1];
            var p2 = points[i2];
            var p01 = p0.add(p1).normalize();
            var p12 = p1.add(p2).normalize();
            var p20 = p2.add(p0).normalize();
            points.push(p01, p12, p20);
            vertices.push.apply(vertices, p01.toArray().concat(p12.toArray(), p20.toArray()));
            var i01 = points.length - 3;
            var i12 = i01 + 1;
            var i20 = i12 + 1;
            subdivide(i0, i01, i20, level);
            subdivide(i01, i1, i12, level);
            subdivide(i01, i12, i20, level);
            subdivide(i20, i12, i2, level);
        }
        else {
            indices.push(i0, i1, i2);
        }
    };
    points.push(new vec3(1, 0, 0));
    vertices.push(1, 0, 0);
    points.push(new vec3(-1, 0, 0));
    vertices.push(-1, 0, 0);
    points.push(new vec3(0, 1, 0));
    vertices.push(0, 1, 0);
    points.push(new vec3(0, -1, 0));
    vertices.push(0, -1, 0);
    points.push(new vec3(0, 0, 1));
    vertices.push(0, 0, 1);
    points.push(new vec3(0, 0, -1));
    vertices.push(0, 0, -1);
    subdivide(2, 4, 0, subdiv);
    subdivide(2, 0, 5, subdiv);
    subdivide(2, 5, 1, subdiv);
    subdivide(2, 1, 4, subdiv);
    subdivide(3, 0, 4, subdiv);
    subdivide(3, 5, 0, subdiv);
    subdivide(3, 1, 5, subdiv);
    subdivide(3, 4, 1, subdiv);
    return { vertices: vertices, indices: indices };
}
function GenerateWireCylinderVertexData(lsubdiv, rsubdiv) {
    if (lsubdiv === void 0) { lsubdiv = 3; }
    if (rsubdiv === void 0) { rsubdiv = 36; }
    lsubdiv = Math.floor(Math.max(1, lsubdiv));
    rsubdiv = Math.floor(Math.max(3, rsubdiv));
    var vertices = [];
    var indices = [];
    var step = 2 / lsubdiv;
    var unitAngle = Math.PI / (rsubdiv / 2);
    for (var k = 0; k < rsubdiv; k++) {
        var angle = unitAngle * k;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        vertices.push(c, 1, s);
        var i00 = k * (lsubdiv + 1);
        var i01 = ((k + 1) % rsubdiv) * (lsubdiv + 1);
        indices.push(i00, i01);
        for (var t = 1; t <= lsubdiv; t++) {
            vertices.push(c, 1 - step * t, s);
            indices.push(i00 + t - 1, i00 + t);
            indices.push(i01 + t - 1, i01 + t);
            indices.push(i00 + t, i01 + t);
        }
    }
    return { vertices: vertices, indices: indices };
}
function GenerateCylinderVertexData(lsubdiv, rsubdiv) {
    if (lsubdiv === void 0) { lsubdiv = 4; }
    if (rsubdiv === void 0) { rsubdiv = 36; }
    lsubdiv = Math.floor(Math.max(1, lsubdiv));
    rsubdiv = Math.floor(Math.max(3, rsubdiv));
    var vertices = [];
    var indices = [];
    var step = 2 / lsubdiv;
    var unitAngle = Math.PI / (rsubdiv / 2);
    for (var k = 0; k < rsubdiv; k++) {
        var angle = unitAngle * k;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        vertices.push(c, 1, s);
        var i00 = k * (lsubdiv + 1);
        var i01 = ((k + 1) % rsubdiv) * (lsubdiv + 1);
        for (var t = 1; t <= lsubdiv; t++) {
            vertices.push(c, 1 - step * t, s);
            indices.push(i00 + t - 1, i00 + t, i01 + t);
            indices.push(i00 + t - 1, i01 + t, i01 + t - 1);
        }
    }
    return { vertices: vertices, indices: indices };
}
function GenerateWireTorusVertexData(tsubdiv, psubdiv) {
    if (tsubdiv === void 0) { tsubdiv = 36; }
    if (psubdiv === void 0) { psubdiv = 10; }
    var vertices = [];
    var indices = [];
    var tUnitAngle = Math.PI / (tsubdiv / 2);
    var pUnitAngle = Math.PI / (psubdiv / 2);
    var mean_radius = 1.0;
    var tube_radius = 0.5;
    for (var k = 0; k < tsubdiv; k++) {
        var phi = tUnitAngle * k;
        var cphi = Math.cos(phi);
        var sphi = Math.sin(phi);
        for (var s = 0; s < psubdiv; s++) {
            var theta = pUnitAngle * s;
            var ctheta = Math.cos(theta);
            var stheta = Math.sin(theta);
            var x = (mean_radius + tube_radius * ctheta) * cphi;
            var y = tube_radius * stheta;
            var z = -(mean_radius + tube_radius * ctheta) * sphi;
            vertices.push(x, y, z);
            var i0_ = k * psubdiv;
            var i1_ = ((k + 1) % tsubdiv) * psubdiv;
            var i_0 = s;
            var i_1 = (s + 1) % psubdiv;
            var i00 = i0_ + i_0;
            var i01 = i0_ + i_1;
            var i10 = i1_ + i_0;
            var i11 = i1_ + i_1;
            indices.push(i00, i01, i00, i10);
            indices.push(i10, i11, i01, i11);
        }
    }
    return { vertices: vertices, indices: indices };
}
function GenerateTorusVertexData(tsubdiv, psubdiv) {
    if (tsubdiv === void 0) { tsubdiv = 36; }
    if (psubdiv === void 0) { psubdiv = 10; }
    var vertices = [];
    var indices = [];
    var tUnitAngle = Math.PI / (tsubdiv / 2);
    var pUnitAngle = Math.PI / (psubdiv / 2);
    var mean_radius = 1.0;
    var tube_radius = 0.5;
    for (var k = 0; k < tsubdiv; k++) {
        var phi = tUnitAngle * k;
        var cphi = Math.cos(phi);
        var sphi = Math.sin(phi);
        for (var s = 0; s < psubdiv; s++) {
            var theta = pUnitAngle * s;
            var ctheta = Math.cos(theta);
            var stheta = Math.sin(theta);
            var x = (mean_radius + tube_radius * ctheta) * cphi;
            var y = tube_radius * stheta;
            var z = -(mean_radius + tube_radius * ctheta) * sphi;
            vertices.push(x, y, z);
            var i0_ = k * psubdiv;
            var i1_ = ((k + 1) % tsubdiv) * psubdiv;
            var i_0 = s;
            var i_1 = (s + 1) % psubdiv;
            var i00 = i0_ + i_0;
            var i01 = i0_ + i_1;
            var i10 = i1_ + i_0;
            var i11 = i1_ + i_1;
            indices.push(i00, i01, i11);
            indices.push(i00, i11, i10);
        }
    }
    return { vertices: vertices, indices: indices };
}
function CreateShaderProgram(gl, vsSrc, fsSrc) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSrc);
    gl.compileShader(vs);
    if (gl.getShaderParameter(vs, gl.COMPILE_STATUS) === false) {
        throw new Error(gl.getShaderInfoLog(vs));
    }
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSrc);
    gl.compileShader(fs);
    if (gl.getShaderParameter(fs, gl.COMPILE_STATUS) === false) {
        throw new Error(gl.getShaderInfoLog(fs));
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS) === false) {
        throw new Error(gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);
    gl.validateProgram(prog);
    if (gl.getProgramParameter(prog, gl.VALIDATE_STATUS) === false) {
        throw new Error(gl.getProgramInfoLog(prog));
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return prog;
}
;
function CreateFramebufferObject(gl, width, height) {
    var TEX = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, TEX);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    var RBO = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, RBO);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    var FBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo: FBO, rbo: RBO, tex: TEX };
}
function ResizeFramebufferObject(gl, width, height, FBO) {
    gl.bindTexture(gl.TEXTURE_2D, FBO.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
function BindFramebufferObject(gl, FBO) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, FBO.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, FBO.tex, 0);
    gl.bindRenderbuffer(gl.RENDERBUFFER, FBO.rbo);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, FBO.rbo);
}
function UnbindFramebufferObject(gl) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
;
;
function CreateVertexBuffer(gl, vertices) {
    var VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return { count: vertices.length / 3, vbo: VBO };
}
function CreateVertexBufferIndexed(gl, vertices, indices) {
    if (indices == undefined) {
        indices = vertices.indices;
        vertices = vertices.vertices;
    }
    var VB = CreateVertexBuffer(gl, vertices);
    var IBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return { count: indices.length, vbo: VB.vbo, ibo: IBO };
}
;
;
function CreateVertexArrayBuffer(gl, vertices) {
    var VAO = gl.createVertexArray();
    gl.bindVertexArray([VAO]);
    var VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    return { vao: VAO, vbo: VBO, count: vertices.length / 3 };
}
function CreateVertexArrayBufferIndexed(gl, vertices, indices) {
    if (indices == null) {
        indices = vertices.indices;
        vertices = vertices.vertices;
    }
    var VAB = CreateVertexArrayBuffer(gl, vertices);
    gl.bindVertexArray(VAB.vao);
    var IBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { count: indices.length, vao: VAB.vao, vbo: VAB.vbo, ibo: IBO };
}
var AppBase = (function () {
    function AppBase(canvas) {
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
    }
    AppBase.prototype.onKeyDown = function (event) { };
    AppBase.prototype.onKeyUp = function (event) { };
    AppBase.prototype.onMouseDown = function (event) { };
    AppBase.prototype.onMouseUp = function (event) { };
    AppBase.prototype.onMouseMove = function (event) { };
    AppBase.prototype.onMouseOver = function (event) { };
    AppBase.prototype.onMouseOut = function (event) { };
    AppBase.prototype.onTouchStart = function (event) { };
    AppBase.prototype.onTouchMove = function (event) { };
    AppBase.prototype.onTouchEnd = function (event) { };
    AppBase.prototype.onTouchCancel = function (event) { };
    return AppBase;
}());
var WebGLAppBase = (function (_super) {
    __extends(WebGLAppBase, _super);
    function WebGLAppBase(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this._glContext = null;
        _this._glContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (_this._glContext !== null) {
            canvas.addEventListener("mousedown", _this.onMouseDown.bind(_this));
            canvas.addEventListener("mouseup", _this.onMouseUp.bind(_this));
            canvas.addEventListener("mousemove", _this.onMouseMove.bind(_this));
            canvas.addEventListener("mouseover", _this.onMouseOver.bind(_this));
            canvas.addEventListener("mouseout", _this.onMouseOut.bind(_this));
            canvas.addEventListener("touchstart", _this.onTouchStart.bind(_this));
            canvas.addEventListener("touchmove", _this.onTouchMove.bind(_this));
            canvas.addEventListener("touchend", _this.onTouchEnd.bind(_this));
            canvas.addEventListener("touchcancel", _this.onTouchCancel.bind(_this));
        }
        return _this;
    }
    Object.defineProperty(WebGLAppBase.prototype, "WebGLContext", {
        get: function () { return this._glContext; },
        enumerable: true,
        configurable: true
    });
    WebGLAppBase.prototype.Init = function () {
        return this.init(this.WebGLContext);
    };
    WebGLAppBase.prototype.Run = function () {
        var _this = this;
        var handle0 = setInterval(function () {
            if (_this.initialUpdate(_this.WebGLContext)) {
                clearInterval(handle0);
            }
        }, 1000);
        this._run = true;
        this._renderLoop();
    };
    WebGLAppBase.prototype.Stop = function () {
        var _this = this;
        this._run = false;
        var handle1 = setInterval(function () {
            if (_this.finalUpdate(_this.WebGLContext)) {
                clearInterval(handle1);
                _this.cleanUp(_this.WebGLContext);
            }
        }, 1000);
    };
    WebGLAppBase.prototype._renderLoop = function (timeStamp, prevTimeStamp) {
        var _this = this;
        if (timeStamp === void 0) { timeStamp = new Date().valueOf(); }
        if (prevTimeStamp === void 0) { prevTimeStamp = timeStamp; }
        var dt = timeStamp - prevTimeStamp;
        this.WebGLContext.clear(this.WebGLContext.COLOR_BUFFER_BIT | this.WebGLContext.DEPTH_BUFFER_BIT);
        this.update(this.WebGLContext, dt);
        this.render(this.WebGLContext, dt);
        if (this._run) {
            window.requestAnimationFrame(function (t) { _this._renderLoop.call(_this, t); });
        }
    };
    WebGLAppBase.prototype.initialUpdate = function (gl) { return true; };
    WebGLAppBase.prototype.update = function (gl, timeElapsed) { };
    WebGLAppBase.prototype.finalUpdate = function (gl) { return true; };
    return WebGLAppBase;
}(AppBase));
var WebGL2AppBase = (function (_super) {
    __extends(WebGL2AppBase, _super);
    function WebGL2AppBase(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this._glContext = null;
        _this._glContext = canvas.getContext("webgl2", { premultipliedAlpha: false });
        if (_this._glContext !== null) {
            canvas.addEventListener("mousedown", _this.onMouseDown.bind(_this));
            canvas.addEventListener("mouseup", _this.onMouseUp.bind(_this));
            canvas.addEventListener("mousemove", _this.onMouseMove.bind(_this));
            canvas.addEventListener("mouseover", _this.onMouseOver.bind(_this));
            canvas.addEventListener("mouseout", _this.onMouseOut.bind(_this));
            canvas.addEventListener("touchstart", _this.onTouchStart.bind(_this));
            canvas.addEventListener("touchmove", _this.onTouchMove.bind(_this));
            canvas.addEventListener("touchend", _this.onTouchEnd.bind(_this));
            canvas.addEventListener("touchcancel", _this.onTouchCancel.bind(_this));
        }
        return _this;
    }
    Object.defineProperty(WebGL2AppBase.prototype, "WebGLContext", {
        get: function () { return this._glContext; },
        enumerable: true,
        configurable: true
    });
    WebGL2AppBase.prototype.Init = function () {
        return this.init(this.WebGLContext);
    };
    WebGL2AppBase.prototype.Run = function () {
        var _this = this;
        var handle0 = setInterval(function () {
            if (_this.initialUpdate(_this.WebGLContext)) {
                clearInterval(handle0);
            }
        }, 1000);
        this._run = true;
        this._renderLoop();
    };
    WebGL2AppBase.prototype.Stop = function () {
        var _this = this;
        this._run = false;
        var handle1 = setInterval(function () {
            if (_this.finalUpdate(_this.WebGLContext)) {
                clearInterval(handle1);
                _this.cleanUp(_this.WebGLContext);
            }
        }, 1000);
    };
    WebGL2AppBase.prototype._renderLoop = function (timeStamp, prevTimeStamp) {
        var _this = this;
        if (timeStamp === void 0) { timeStamp = new Date().valueOf(); }
        if (prevTimeStamp === void 0) { prevTimeStamp = timeStamp; }
        var dt = timeStamp - prevTimeStamp;
        this.WebGLContext.clear(this.WebGLContext.COLOR_BUFFER_BIT | this.WebGLContext.DEPTH_BUFFER_BIT);
        this.update(this.WebGLContext, dt);
        this.render(this.WebGLContext, dt);
        if (this._run) {
            window.requestAnimationFrame(function (t) { _this._renderLoop.call(_this, t); });
        }
    };
    WebGL2AppBase.prototype.initialUpdate = function (gl) { return true; };
    WebGL2AppBase.prototype.update = function (gl, timeElapsed) { };
    WebGL2AppBase.prototype.finalUpdate = function (gl) { return true; };
    return WebGL2AppBase;
}(AppBase));
var PrimitiveData = (function () {
    function PrimitiveData() {
        this.pointVisible = true;
        this.geometryVisible = true;
        this.pointColor = GenerateRainbowColor();
        this.geometryColor = new vec3();
        this.pointSelected = false;
        this.geometrySelected = false;
    }
    return PrimitiveData;
}());
var randomColorIndex = 0;
function GenerateRainbowColor() {
    var rainbowColors = [
        RGB3f(255, 0, 0),
        RGB3f(255, 128, 0),
        RGB3f(255, 255, 0),
        RGB3f(0, 255, 64),
        RGB3f(0, 128, 255),
        RGB3f(0, 0, 255),
        RGB3f(255, 0, 255)
    ];
    var color = rainbowColors[randomColorIndex];
    randomColorIndex = (randomColorIndex + 1) % 7;
    return color;
}
var PlaneData = (function (_super) {
    __extends(PlaneData, _super);
    function PlaneData(ll, lr, ur, ul) {
        var _this = _super.call(this) || this;
        _this.geometryColor.assign(1, 0, 0);
        _this._ll = new vec3(ll[0], ll[1], ll[2]);
        _this._lr = new vec3(lr[0], lr[1], lr[2]);
        _this._ur = new vec3(ur[0], ur[1], ur[2]);
        _this._ul = new vec3(ul[0], ul[1], ul[2]);
        _this._modelMatrix = new mat4();
        return _this;
    }
    Object.defineProperty(PlaneData.prototype, "ll", {
        get: function () { return this._ll; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "lr", {
        get: function () { return this._lr; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "ur", {
        get: function () { return this._ur; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "ul", {
        get: function () { return this._ul; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "hori", {
        get: function () { return this._ll.sub(this._lr); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "vert", {
        get: function () { return this._ll.sub(this._ul); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "width", {
        get: function () { return this.hori.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "height", {
        get: function () { return this.vert.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "normal", {
        get: function () { return this.vert.cross(this.hori).normalize(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "area", {
        get: function () { return this.width * this.height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "center", {
        get: function () { return this._ll.add(this._lr).add(this._ur).add(this._ul).mul(0.25); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaneData.prototype, "modelMatrix", {
        get: function () { return this._modelMatrix; },
        enumerable: true,
        configurable: true
    });
    return PlaneData;
}(PrimitiveData));
var SphereData = (function (_super) {
    __extends(SphereData, _super);
    function SphereData(c, r) {
        var _this = _super.call(this) || this;
        _this.geometryColor.assign(0, 1, 0);
        _this._center = new vec3(c[0], c[1], c[2]);
        _this._radius = r;
        _this._modelMatrix = mat4.translate(_this._center).mul(mat4.scale(_this._radius, _this._radius, _this._radius));
        return _this;
    }
    Object.defineProperty(SphereData.prototype, "center", {
        get: function () { return this._center; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereData.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereData.prototype, "modelMatrix", {
        get: function () { return this._modelMatrix; },
        enumerable: true,
        configurable: true
    });
    return SphereData;
}(PrimitiveData));
var CylinderData = (function (_super) {
    __extends(CylinderData, _super);
    function CylinderData(tc, bc, r) {
        var _this = _super.call(this) || this;
        _this.geometryColor.assign(1, 0, 1);
        _this._topcenter = new vec3(tc[0], tc[1], tc[2]);
        _this._bottomcenter = new vec3(bc[0], bc[1], bc[2]);
        _this._radius = r;
        var yAxis = new vec3(0, 1, 0);
        var axis = _this.axis;
        var rotAxis = yAxis.cross(axis).normalize();
        var rotAngle = vec3.angleBetween(yAxis, axis, rotAxis);
        _this._modelMatrix = mat4.translate(_this.center).mul(mat4.rotate(rotAxis, rotAngle).mul(mat4.scale(_this._radius, _this.height * 0.5, _this._radius)));
        return _this;
    }
    Object.defineProperty(CylinderData.prototype, "topCenter", {
        get: function () { return this._topcenter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "bottomCenter", {
        get: function () { return this._bottomcenter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "center", {
        get: function () { return this._topcenter.add(this._bottomcenter).mul(0.5); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "axis", {
        get: function () { return this._topcenter.sub(this._bottomcenter).normalize(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "height", {
        get: function () { return this._topcenter.sub(this._bottomcenter).length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderData.prototype, "modelMatrix", {
        get: function () { return this._modelMatrix; },
        enumerable: true,
        configurable: true
    });
    return CylinderData;
}(PrimitiveData));
var ConeData = (function (_super) {
    __extends(ConeData, _super);
    function ConeData(t, b, tr, br) {
        var _this = _super.call(this) || this;
        _this.geometryColor.assign(0, 1, 1);
        _this._topcenter = new vec3(t[0], t[1], t[2]);
        _this._bottomcenter = new vec3(b[0], b[1], b[2]);
        _this._topradius = tr;
        _this._bottomradius = br;
        var yAxis = new vec3(0, 1, 0);
        var axis = _this.axis;
        var rotAxis = yAxis.cross(axis).normalize();
        var rotAngle = vec3.angleBetween(yAxis, axis, rotAxis);
        _this._modelMatrix = mat4.translate(_this.center).mul(mat4.rotate(rotAxis, rotAngle).mul(mat4.scale(1, _this.height * 0.5, 1)));
        return _this;
    }
    Object.defineProperty(ConeData.prototype, "topCenter", {
        get: function () { return this._topcenter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "bottomCenter", {
        get: function () { return this._bottomcenter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "center", {
        get: function () { return this._topcenter.add(this._bottomcenter).mul(0.5); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "topRadius", {
        get: function () { return this._topradius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "bottomRadius", {
        get: function () { return this._bottomradius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "axis", {
        get: function () { return this._topcenter.sub(this._bottomcenter).normalize(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "height", {
        get: function () { return this._topcenter.sub(this._bottomcenter).length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConeData.prototype, "modelMatrix", {
        get: function () { return this._modelMatrix; },
        enumerable: true,
        configurable: true
    });
    return ConeData;
}(PrimitiveData));
var TorusData = (function (_super) {
    __extends(TorusData, _super);
    function TorusData(c, n, mr, tr, tb, ta) {
        var _this = _super.call(this) || this;
        _this.geometryColor.assign(1, 1, 0);
        _this._center = new vec3(c[0], c[1], c[2]);
        _this._axis = new vec3(n[0], n[1], n[2]);
        _this._meanradius = mr;
        _this._tuberadius = tr;
        _this._tubebegin = new vec3(tb[0], tb[1], tb[2]);
        _this._tubeangle = ta;
        var basis0 = _this._tubebegin.normalize();
        var basis1 = _this._axis.normalize();
        var basis2 = basis0.cross(basis1).normalize();
        var R = new mat4(basis0.x, basis1.x, basis2.x, 0, basis0.y, basis1.y, basis2.y, 0, basis0.z, basis1.z, basis2.z, 0, 0, 0, 0, 1);
        var T = mat4.translate(_this._center);
        _this._modelMatrix = T.mul(R);
        return _this;
    }
    Object.defineProperty(TorusData.prototype, "center", {
        get: function () { return this._center; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorusData.prototype, "axis", {
        get: function () { return this._axis; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorusData.prototype, "meanRadius", {
        get: function () { return this._meanradius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorusData.prototype, "tubeRadius", {
        get: function () { return this._tuberadius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorusData.prototype, "tubeAngle", {
        get: function () { return this._tubeangle; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TorusData.prototype, "modelMatrix", {
        get: function () { return this._modelMatrix; },
        enumerable: true,
        configurable: true
    });
    return TorusData;
}(PrimitiveData));
function RGB3f(r, g, b) { return new vec3(r, g, b).div(255); }
var WebGLApp = (function (_super) {
    __extends(WebGLApp, _super);
    function WebGLApp(canvas, vertices, textCanvas) {
        var _this = _super.call(this, canvas) || this;
        _this.programDebug = null;
        _this.programPointCloud = null;
        _this.programWireGeometry = null;
        _this.plane = null;
        _this.sphere = null;
        _this.cylinder = null;
        _this.cone = null;
        _this.torus = null;
        _this.objectNames = [];
        _this.inlierVAO = {};
        _this.inlierObjects = {};
        _this.programGeometry = null;
        _this.arrowCylinder = null;
        _this.originSphere = null;
        _this.rulerQuad = null;
        _this.bboxMin = null;
        _this.bboxMax = null;
        _this.boxRadius = 20;
        _this._vertexDataBackup = null;
        _this._vertexData = null;
        _this.picked_point = null;
        _this.ray_org = null;
        _this.ray_dir = null;
        _this.touchID = 0;
        _this.touchStartTime = 0;
        _this.touchStartPos = new vec2();
        _this._trackballBehavior = CameraBehavior.NOTHING;
        _this._trackballHomeFront = null;
        _this._trackballHomeSide = null;
        _this._trackballHomeTop = null;
        _this._trackballBase = "front";
        _this.text = null;
        _this.touchRadius = 0.1;
        _this.bTouchAreaVisible = false;
        _this.count = 0;
        _this.text = textCanvas instanceof HTMLCanvasElement ? textCanvas.getContext("2d") : document.createElement("canvas").getContext("2d");
        _this.text.font = "20px Arial";
        _this._vertexData = vertices;
        var mv = Number.MAX_VALUE;
        _this.bboxMin = new vec3(mv, mv, mv);
        _this.bboxMax = new vec3(-mv, -mv, -mv);
        var massCenter = new vec3();
        for (var k = 0; k < _this._vertexData.length; k += 3) {
            var x = _this._vertexData[k];
            var y = _this._vertexData[k + 1];
            var z = _this._vertexData[k + 2];
            _this.bboxMin = _this.bboxMin.minElements(x, y, z);
            _this.bboxMax = _this.bboxMax.maxElements(x, y, z);
            massCenter.assign(massCenter.x + x, massCenter.y + y, massCenter.z + z);
        }
        massCenter.assign(massCenter.div(_this._vertexData.length / 3));
        for (var k = 0; k < _this._vertexData.length; k += 3) {
            _this._vertexData[k] -= massCenter.x;
            _this._vertexData[k + 1] -= massCenter.y;
            _this._vertexData[k + 2] -= massCenter.z;
        }
        _this._vertexDataBackup = vertices.slice();
        _this.outlierPointSize = 1.0;
        _this.inlierPointSize = 3.0;
        _this.selectedPointSize = 5.0;
        _this.frame = {
            color: {
                origin: [0.5, 0.5, 0.5],
                xaxis: [1, 0, 0],
                yaxis: [0, 1, 0],
                zaxis: [0, 0, 1]
            },
            scale: {
                origin_radius: 0.1,
                arrow_radius: 0.05,
                arrow_tip_radius: 0.1
            },
            pos: { x: 20, y: 20 },
            size: { width: 100, height: 100 }
        };
        _this.ruler = {
            color: [1, 1, 1],
            scale: { lineWidth: 3 },
            pos: { x: 10, y: 10 },
            size: { width: 100, height: 10 }
        };
        return _this;
    }
    WebGLApp.prototype.GetFrameOriginColor = function () { return this.frame.color.origin.slice(); };
    WebGLApp.prototype.SetFrameOriginColor = function (r, g, b) { this.frame.color.origin = [r, g, b]; };
    WebGLApp.prototype.GetFrameAxisXColor = function () { return this.frame.color.xaxis.slice(); };
    WebGLApp.prototype.SetFrameAxisXColor = function (r, g, b) { this.frame.color.xaxis = [r, g, b]; };
    WebGLApp.prototype.GetFrameAxisYColor = function () { return this.frame.color.yaxis.slice(); };
    WebGLApp.prototype.SetFrameAxisYColor = function (r, g, b) { this.frame.color.yaxis = [r, g, b]; };
    WebGLApp.prototype.GetFrameAxisZColor = function () { return this.frame.color.zaxis.slice(); };
    WebGLApp.prototype.SetFrameAxisZColor = function (r, g, b) { this.frame.color.zaxis = [r, g, b]; };
    WebGLApp.prototype.GetOriginRadius = function () { return this.frame.scale.origin_radius; };
    WebGLApp.prototype.SetOriginRadius = function (radius) { this.frame.scale.origin_radius = radius; };
    WebGLApp.prototype.GetAxisTipRadius = function () { return this.frame.scale.arrow_tip_radius; };
    WebGLApp.prototype.SetAxisTipRadius = function (radius) { this.frame.scale.arrow_tip_radius = radius; };
    WebGLApp.prototype.GetAxisRadius = function () { return this.frame.scale.arrow_radius; };
    WebGLApp.prototype.SetAxisRadius = function (radius) { this.frame.scale.arrow_radius = radius; };
    WebGLApp.prototype.GetFramePos = function () { return { x: this.frame.pos.x, y: this.frame.pos.y }; };
    WebGLApp.prototype.SetFramePos = function (x, y) { this.frame.pos.x = x; this.frame.pos.y = y; };
    WebGLApp.prototype.GetFrameSize = function () { return { width: this.frame.size.width, height: this.frame.size.height }; };
    WebGLApp.prototype.SetFrameSize = function (w, h) { this.frame.size.width = w; this.frame.size.height = h; };
    WebGLApp.prototype.GetRulerBarColor = function () { return this.ruler.color.slice(); };
    WebGLApp.prototype.SetRulerBarColor = function (r, g, b) { this.ruler.color = [r, g, b]; };
    WebGLApp.prototype.GetRulerPos = function () { return { x: this.ruler.pos.x, y: this.ruler.pos.y }; };
    WebGLApp.prototype.SetRulerPos = function (x, y) { this.ruler.pos.x = x; this.ruler.pos.y = y; };
    WebGLApp.prototype.GetRulerSize = function () { return { width: this.ruler.size.width, height: this.ruler.size.height }; };
    WebGLApp.prototype.SetRulerSize = function (w, h) { this.ruler.size.width = w; this.ruler.size.height = h; };
    WebGLApp.prototype.GetRulerLineWidth = function () { return this.ruler.scale.lineWidth; };
    WebGLApp.prototype.SetRulerLineWidth = function (width) { this.ruler.scale.lineWidth = width; };
    WebGLApp.prototype.GetOutlierPointSize = function () { return this.outlierPointSize; };
    WebGLApp.prototype.SetOutlierPointSize = function (size) { this.outlierPointSize = Math.max(size, 1.0); };
    WebGLApp.prototype.GetInlierPointSize = function () { return this.inlierPointSize; };
    WebGLApp.prototype.SetInlierPointSize = function (size) { this.inlierPointSize = Math.max(size, 1.0); };
    WebGLApp.prototype.GetSelectedPointSize = function () { return this.inlierPointSize; };
    WebGLApp.prototype.SetSelectedPointSize = function (size) { this.selectedPointSize = Math.max(size, 1.0); };
    Object.defineProperty(WebGLApp.prototype, "vertexData", {
        get: function () { return this._vertexData; },
        enumerable: true,
        configurable: true
    });
    WebGLApp.prototype.SetTrackballRotate = function () { this._trackballBehavior = CameraBehavior.OBJECT_ROTATING; };
    WebGLApp.prototype.SetTrackballZoom = function () { this._trackballBehavior = CameraBehavior.CAMERA_ZOOMING; };
    WebGLApp.prototype.SetTrackballPan = function () { this._trackballBehavior = CameraBehavior.CAMERA_PANNING; };
    WebGLApp.prototype.SetTrackballStop = function () { this._trackballBehavior = CameraBehavior.NOTHING; };
    WebGLApp.prototype.ShowTouchArea = function (show, radius) {
        if (typeof radius !== "undefined") {
            this.touchRadius = radius;
        }
        this.bTouchAreaVisible = show;
    };
    WebGLApp.prototype.Resize = function (width, height) {
        this.width = width;
        this.height = height;
        var ocam = this._trackballHomeFront;
        ocam.width = width;
        ocam.height = height;
        ocam = this._trackballHomeSide;
        ocam.width = width;
        ocam.height = height;
        ocam = this._trackballHomeTop;
        ocam.width = width;
        ocam.height = height;
        this.trackball.updateViewport(width, height);
        this.WebGLContext.viewport(0, 0, width, height);
        this.text.font = "20px Arial";
    };
    WebGLApp.prototype.init = function (gl) {
        this.CreateTrackball();
        if (gl === null)
            return false;
        this.programDebug = CreateShaderProgram(gl, WebGLApp.vsDebugES2, WebGLApp.fsDebugES2);
        this.programPointCloud = CreateShaderProgram(gl, WebGLApp.vsPointCloudES2, WebGLApp.fsPointCloudES2);
        this.programWireGeometry = CreateShaderProgram(gl, WebGLApp.vsWireGeometryES2, WebGLApp.fsWireGeometryES2);
        this.programGeometry = CreateShaderProgram(gl, WebGLApp.vsGeometryES2, WebGLApp.fsGeometryES2);
        this.pointcloud = CreateVertexBuffer(gl, this.vertexData);
        this.plane = CreateVertexBufferIndexed(gl, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], [0, 1, 1, 2, 2, 3, 3, 0]);
        this.sphere = CreateVertexBufferIndexed(gl, GenerateWireSphereVertexData(2));
        this.cylinder = CreateVertexBufferIndexed(gl, GenerateWireCylinderVertexData(3, 18));
        this.cone = CreateVertexBufferIndexed(gl, GenerateWireCylinderVertexData(2, 18));
        this.torus = CreateVertexBufferIndexed(gl, GenerateWireTorusVertexData(18, 18));
        this.arrowCylinder = CreateVertexBufferIndexed(gl, GenerateCylinderVertexData(1));
        this.originSphere = CreateVertexBufferIndexed(gl, GenerateSphereVertexData(3));
        this.rulerQuad = CreateVertexBufferIndexed(gl, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], [0, 1, 2, 0, 2, 3]);
        var t = 30 / 255;
        gl.clearColor(t, t, t, 1.0);
        gl.viewport(0, 0, this.width, this.height);
        gl.enable(gl.DEPTH_TEST);
        return true;
    };
    WebGLApp.prototype.CreateTrackball = function () {
        var m = this.bboxMin;
        var M = this.bboxMax;
        var center = new vec3();
        var radius = m.sub(M).length * 0.5;
        this.boxRadius = radius;
        var eye = center.sub(new vec3(0, 0, -(radius + 1)));
        var up = new vec3(0, 1, 0);
        var extent = M.sub(m).mul(0.5).xy;
        var zoomFactor = this.width > this.height ? 2 * radius / this.width : 2 * radius / this.height;
        var near = 0.001;
        var far = max(2 * radius + 1, 20.0);
        this._trackballHomeFront = new OrthographicCamera(eye, center, up, this.width, this.height, near, far, zoomFactor);
        this._trackballHomeSide = new OrthographicCamera(center.add(new vec3((radius + 1), 0, 0)), center, up, this.width, this.height, near, far, zoomFactor);
        this._trackballHomeTop = new OrthographicCamera(center.add(new vec3(0, radius + 1, 0)), center, new vec3(0, 0, -1), this.width, this.height, near, far, zoomFactor);
        this.trackball = new Trackball(this._trackballHomeFront);
    };
    WebGLApp.prototype.SetCameraFront = function () { this.trackball.reset(this._trackballHomeFront); this._trackballBase = "front"; };
    WebGLApp.prototype.SetCameraSide = function () { this.trackball.reset(this._trackballHomeSide); this._trackballBase = "side"; };
    WebGLApp.prototype.SetCameraTop = function () { this.trackball.reset(this._trackballHomeTop); this._trackballBase = "top"; };
    WebGLApp.prototype.extractInlier = function (flags) {
        var inlier = [];
        var outlier = [];
        for (var k = 0; k < flags.length; k++) {
            var tk = 3 * k;
            var x = this._vertexData[tk];
            var y = this._vertexData[tk + 1];
            var z = this._vertexData[tk + 2];
            (flags[k] == 0 ? inlier : outlier).push(x, y, z);
        }
        this._vertexData = outlier;
        var gl = this.WebGLContext;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(outlier), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.pointcloud.count = outlier.length / 3;
        return inlier;
    };
    WebGLApp.prototype.AppendObject = function (key, objInfo) {
        var inlier = this.extractInlier(objInfo.flags);
        this.inlierVAO[key] = CreateVertexBuffer(this.WebGLContext, inlier);
        this.objectNames.push(key);
        switch (objInfo.type) {
            case "plane":
                this.inlierObjects[key] = new PlaneData(objInfo.param.ll, objInfo.param.lr, objInfo.param.ur, objInfo.param.ul);
                break;
            case "sphere":
                this.inlierObjects[key] = new SphereData(objInfo.param.c, objInfo.param.r);
                break;
            case "cylinder":
                this.inlierObjects[key] = new CylinderData(objInfo.param.t, objInfo.param.b, objInfo.param.r);
                break;
            case "cone":
                this.inlierObjects[key] = new ConeData(objInfo.param.t, objInfo.param.b, objInfo.param.tr, objInfo.param.br);
                break;
            case "torus":
                var t = this.calculateElbowJoint(inlier, objInfo.param.c, objInfo.param.n);
                this.inlierObjects[key] = new TorusData(objInfo.param.c, objInfo.param.n, objInfo.param.mr, objInfo.param.tr, t.tb, t.ta);
                break;
        }
    };
    WebGLApp.prototype.RemoveObject = function (key) {
        var index = this.objectNames.indexOf(key);
        if (index != -1) {
            this.objectNames.splice(index, 1);
            this.WebGLContext.deleteBuffer(this.inlierVAO[key].vbo);
            delete this.inlierObjects[key];
            delete this.inlierVAO[key];
        }
    };
    WebGLApp.prototype.Reset = function () {
        var _this = this;
        this._vertexData = this._vertexDataBackup.slice();
        this.objectNames.forEach(function (name) {
            _this.WebGLContext.deleteBuffer(_this.inlierVAO[name].vbo);
        });
        this.inlierObjects = {};
        this.inlierVAO = {};
        this.objectNames = [];
        var gl = this.WebGLContext;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertexData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.pointcloud.count = this._vertexData.length / 3;
    };
    WebGLApp.prototype.SetObjectVisible = function (key, visible) {
        this.inlierObjects[key].geometryVisible = visible;
        this.inlierObjects[key].pointVisible = visible;
    };
    WebGLApp.prototype.SetInlierVisible = function (key, visible) {
        this.inlierObjects[key].pointVisible = visible;
    };
    WebGLApp.prototype.SetAllInlierVisible = function (visible) {
        for (var k = 0; k < this.objectNames.length; k++) {
            this.inlierObjects[this.objectNames[k]].pointVisible = visible;
        }
    };
    WebGLApp.prototype.SetMeshVisible = function (key, visible) {
        this.inlierObjects[key].geometryVisible = visible;
    };
    WebGLApp.prototype.SetAllMeshVisible = function (visible) {
        for (var k = 0; k < this.objectNames.length; k++) {
            this.inlierObjects[this.objectNames[k]].geometryVisible = visible;
        }
    };
    WebGLApp.prototype.GetInlierColor = function (key) {
        return [this.inlierObjects[key].pointColor.x, this.inlierObjects[key].pointColor.y, this.inlierObjects[key].pointColor.z];
    };
    WebGLApp.prototype.SetInlierColor = function (key, color) {
        this.inlierObjects[key].pointColor.x = color[0];
        this.inlierObjects[key].pointColor.y = color[1];
        this.inlierObjects[key].pointColor.z = color[2];
    };
    WebGLApp.prototype.GetMeshColor = function (key) {
        return [this.inlierObjects[key].geometryColor.x, this.inlierObjects[key].geometryColor.y, this.inlierObjects[key].geometryColor.z];
    };
    WebGLApp.prototype.SetMeshColor = function (key, color) {
        this.inlierObjects[key].geometryColor.x = color[0];
        this.inlierObjects[key].geometryColor.y = color[1];
        this.inlierObjects[key].geometryColor.z = color[2];
    };
    WebGLApp.prototype.SelectObject = function (key) {
        this.inlierObjects[key].pointSelected = true;
        this.inlierObjects[key].geometrySelected = true;
    };
    WebGLApp.prototype.SelectObjectMesh = function (key) {
        this.inlierObjects[key].geometrySelected = true;
    };
    WebGLApp.prototype.SelectObjectInlier = function (key) {
        this.inlierObjects[key].pointSelected = true;
    };
    WebGLApp.prototype.DeselectAll = function () {
        var _this = this;
        this.objectNames.forEach(function (name) {
            _this.inlierObjects[name].pointSelected = false;
            _this.inlierObjects[name].geometrySelected = false;
        });
    };
    WebGLApp.prototype.calculateElbowJoint = function (inliers, center, axis) {
        var c = new vec3(center[0], center[1], center[2]);
        var n = new vec3(axis[0], axis[1], axis[2]);
        var inlierPoints = [];
        for (var k = 0; k < inliers.length; k += 3) {
            var v = new vec3(inliers[k], inliers[k + 1], inliers[k + 2]).sub(c);
            inlierPoints.push(n.cross(v).cross(n).normalize());
        }
        var barycentric = new vec3();
        inlierPoints.forEach(function (v) {
            barycentric.x += v.x;
            barycentric.y += v.y;
            barycentric.z += v.z;
        });
        barycentric = barycentric.div(inlierPoints.length);
        var elbowMiddle = barycentric.normalize();
        var angles = [];
        inlierPoints.forEach(function (v) {
            angles.push(vec3.angleBetween(elbowMiddle, v, n));
        });
        var min_index = -1;
        var max_index = -1;
        var min_angle = Number.MAX_VALUE;
        var max_angle = -Number.MAX_VALUE;
        angles.forEach(function (angle, i) {
            if (angle < min_angle) {
                min_angle = angle;
                min_index = i;
            }
            if (angle > max_angle) {
                max_angle = angle;
                max_index = i;
            }
        });
        return { tb: inlierPoints[min_index].toArray(), ta: vec3.angleBetween(inlierPoints[min_index], inlierPoints[max_index]) };
    };
    WebGLApp.prototype.initialUpdate = function (gl) {
        return true;
    };
    WebGLApp.prototype.update = function (gl, timeElapsed) {
        this.trackball.update(timeElapsed);
    };
    WebGLApp.prototype.render = function (gl, timeElapsed) {
        this.text.clearRect(0, 0, this.text.canvas.width, this.text.canvas.height);
        this.text.fillStyle = "white";
        gl.viewport(0, 0, this.width, this.height);
        this.renderPointCloud(gl);
        this.renderInliers(gl);
        if (this.bTouchAreaVisible && this.picked_point instanceof vec3) {
            gl.useProgram(this.programWireGeometry);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(mat4.translate(this.picked_point).mul(mat4.scale(this.touchRadius, this.touchRadius, this.touchRadius))).transpose().toArray());
            gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
            gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
            gl.uniform3f(gl.getUniformLocation(this.programWireGeometry, "color"), 1, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphere.vbo);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphere.ibo);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 1);
            gl.drawElements(gl.LINES, this.sphere.count, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.useProgram(null);
        }
        this.renderUnitFrame(gl);
        this.renderRuler(gl);
    };
    WebGLApp.prototype.renderPointCloud = function (gl) {
        gl.useProgram(this.programPointCloud);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "model_matrix"), false, this.trackball.transformMatrix.transpose().toArray());
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
        gl.uniform1f(gl.getUniformLocation(this.programPointCloud, "pointSize"), this.outlierPointSize);
        gl.uniform3f(gl.getUniformLocation(this.programPointCloud, "color"), 1, 1, 1);
        gl.drawArrays(gl.POINTS, 0, this.pointcloud.count);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    WebGLApp.prototype.renderInliers = function (gl) {
        var _this = this;
        this.objectNames.forEach(function (name) {
            var objectData = _this.inlierObjects[name];
            var objectVBO = _this.inlierVAO[name];
            if (objectData.pointVisible) {
                gl.useProgram(_this.programPointCloud);
                gl.bindBuffer(gl.ARRAY_BUFFER, objectVBO.vbo);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programPointCloud, "model_matrix"), false, _this.trackball.transformMatrix.transpose().toArray());
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programPointCloud, "view_matrix"), false, _this.trackball.viewMatrix.transpose().toArray());
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programPointCloud, "proj_matrix"), false, _this.trackball.projectionMatrix.transpose().toArray());
                gl.uniform1f(gl.getUniformLocation(_this.programPointCloud, "pointSize"), objectData.pointSelected ? _this.selectedPointSize : _this.inlierPointSize);
                gl.uniform3fv(gl.getUniformLocation(_this.programPointCloud, "color"), objectData.pointColor.toArray());
                gl.drawArrays(gl.POINTS, 0, objectVBO.count);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.useProgram(null);
            }
            if (objectData.geometryVisible) {
                gl.enable(gl.BLEND);
                gl.disable(gl.DEPTH_TEST);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                gl.useProgram(_this.programWireGeometry);
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programWireGeometry, "model_matrix"), false, _this.trackball.transformMatrix.mul(objectData.modelMatrix).transpose().toArray());
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programWireGeometry, "view_matrix"), false, _this.trackball.viewMatrix.transpose().toArray());
                gl.uniformMatrix4fv(gl.getUniformLocation(_this.programWireGeometry, "proj_matrix"), false, _this.trackball.projectionMatrix.transpose().toArray());
                gl.uniform3fv(gl.getUniformLocation(_this.programWireGeometry, "color"), objectData.geometryColor.toArray());
                switch (true) {
                    case objectData instanceof PlaneData:
                        gl.bindBuffer(gl.ARRAY_BUFFER, _this.plane.vbo);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.plane.ibo);
                        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                        gl.uniform1i(gl.getUniformLocation(_this.programWireGeometry, "subroutine_index"), 0);
                        gl.uniform3fv(gl.getUniformLocation(_this.programWireGeometry, "quad[0]"), objectData.ll.toArray());
                        gl.uniform3fv(gl.getUniformLocation(_this.programWireGeometry, "quad[1]"), objectData.lr.toArray());
                        gl.uniform3fv(gl.getUniformLocation(_this.programWireGeometry, "quad[2]"), objectData.ur.toArray());
                        gl.uniform3fv(gl.getUniformLocation(_this.programWireGeometry, "quad[3]"), objectData.ul.toArray());
                        gl.drawElements(gl.LINES, _this.plane.count, gl.UNSIGNED_SHORT, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        break;
                    case objectData instanceof SphereData:
                        gl.bindBuffer(gl.ARRAY_BUFFER, _this.sphere.vbo);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.sphere.ibo);
                        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                        gl.uniform1i(gl.getUniformLocation(_this.programWireGeometry, "subroutine_index"), 1);
                        gl.drawElements(gl.LINES, _this.sphere.count, gl.UNSIGNED_SHORT, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        break;
                    case objectData instanceof CylinderData:
                        gl.bindBuffer(gl.ARRAY_BUFFER, _this.cylinder.vbo);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.cylinder.ibo);
                        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                        gl.uniform1i(gl.getUniformLocation(_this.programWireGeometry, "subroutine_index"), 2);
                        gl.drawElements(gl.LINES, _this.cylinder.count, gl.UNSIGNED_SHORT, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        break;
                    case objectData instanceof ConeData:
                        gl.bindBuffer(gl.ARRAY_BUFFER, _this.cone.vbo);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.cone.ibo);
                        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                        gl.uniform1i(gl.getUniformLocation(_this.programWireGeometry, "subroutine_index"), 3);
                        gl.uniform1f(gl.getUniformLocation(_this.programWireGeometry, "radius0"), objectData.bottomRadius);
                        gl.uniform1f(gl.getUniformLocation(_this.programWireGeometry, "radius1"), objectData.topRadius);
                        gl.drawElements(gl.LINES, _this.cone.count, gl.UNSIGNED_SHORT, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        break;
                    case objectData instanceof TorusData:
                        gl.bindBuffer(gl.ARRAY_BUFFER, _this.torus.vbo);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.torus.ibo);
                        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                        gl.uniform1i(gl.getUniformLocation(_this.programWireGeometry, "subroutine_index"), 4);
                        gl.uniform1f(gl.getUniformLocation(_this.programWireGeometry, "radius0"), objectData.tubeRadius);
                        gl.uniform1f(gl.getUniformLocation(_this.programWireGeometry, "radius1"), objectData.meanRadius);
                        var ipr = 8 * 10;
                        var ratio = objectData.tubeAngle / (2 * Math.PI);
                        var count = ipr * (Math.floor(ratio * _this.torus.count / ipr) + 1);
                        gl.drawElements(gl.LINES, count, gl.UNSIGNED_SHORT, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        break;
                }
                gl.useProgram(null);
                gl.disable(gl.BLEND);
                gl.enable(gl.DEPTH_TEST);
            }
        });
    };
    WebGLApp.prototype.renderUnitFrame = function (gl) {
        gl.viewport(this.frame.pos.x, this.height - this.frame.pos.y - this.frame.size.height, this.frame.size.width, this.frame.size.height);
        gl.useProgram(this.programGeometry);
        switch (this._trackballBase) {
            case "front":
                gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeFront.view.transpose().toArray());
                break;
            case "side":
                gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeSide.view.transpose().toArray());
                break;
            case "top":
                gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeTop.view.transpose().toArray());
                break;
        }
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "proj_matrix"), false, mat4.orthographic(2, 2, 0.001, this.boxRadius * 10).transpose().toArray());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.originSphere.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.originSphere.ibo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 1);
        gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.origin);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(mat4.scale(this.frame.scale.origin_radius, this.frame.scale.origin_radius, this.frame.scale.origin_radius)).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.originSphere.count, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowCylinder.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.arrowCylinder.ibo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        var cylTS = mat4.translate(0, 0.45, 0).mul(mat4.scale(this.frame.scale.arrow_radius, 0.45, this.frame.scale.arrow_radius));
        var conTS = mat4.translate(0, 0.9, 0).mul(mat4.scale(1, 0.1, 1));
        gl.uniform1f(gl.getUniformLocation(this.programGeometry, "radius0"), this.frame.scale.arrow_tip_radius);
        gl.uniform1f(gl.getUniformLocation(this.programGeometry, "radius1"), 0);
        gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.xaxis);
        var RX = mat4.rotateZ(-Math.PI / 2);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RX.mul(cylTS)).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RX.mul(conTS)).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.yaxis);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(cylTS).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(conTS).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.zaxis);
        var RZ = mat4.rotateX(Math.PI / 2);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RZ.mul(cylTS)).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RZ.mul(conTS)).transpose().toArray());
        gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    WebGLApp.prototype.toSuperscriptString = function (digitstr) {
        var superscript = "";
        for (var k = 0; k < digitstr.length; k++) {
            var code = digitstr.charCodeAt(k);
            switch (code) {
                case 43: break;
                case 45:
                    superscript += String.fromCharCode(0x207B);
                    break;
                case 48:
                    superscript += String.fromCharCode(0x2070);
                    break;
                case 49:
                    superscript += String.fromCharCode(0x00B9);
                    break;
                case 50:
                    superscript += String.fromCharCode(0x00B2);
                    break;
                case 51:
                    superscript += String.fromCharCode(0x00B3);
                    break;
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                    superscript += String.fromCharCode(0x2074 + code - 53);
                    break;
            }
        }
        return superscript;
    };
    WebGLApp.prototype.convertToScientific = function (value, fractionDigits) {
        if (fractionDigits === void 0) { fractionDigits = 1; }
        var expstr = value.toExponential(fractionDigits);
        var _a = expstr.split("e"), significand = _a[0], exponent = _a[1];
        return significand + (Number(exponent) != 0 ? " " + String.fromCharCode(0x00D7) + "10" + this.toSuperscriptString(exponent) : "");
    };
    WebGLApp.prototype.renderRuler = function (gl) {
        var widthlength = this.width * this.trackball.zoomFactor;
        var x = this.ruler.pos.x;
        var y = this.height - this.ruler.pos.y - this.ruler.size.height;
        var w = this.ruler.size.width;
        var h = this.ruler.size.height;
        var l = this.ruler.scale.lineWidth;
        var bx = x;
        var by = y + h - l;
        var bw = w;
        var bh = l;
        this.text.fillRect(bx, by, bw, bh);
        var lineLength = widthlength * bw / this.width;
        var _a = lineLength.toExponential(1).split("e"), sig = _a[0], exp = _a[1];
        var numTicks = Math.floor(Number(sig));
        this.text.strokeStyle = "white";
        this.text.beginPath();
        for (var k = 0; k < numTicks; k++) {
            var tickLength = bw * Number((k + 1) + "e" + exp) / lineLength;
            this.text.moveTo(bx + tickLength, y + l);
            this.text.lineTo(bx + tickLength, y + h);
        }
        this.text.stroke();
        this.text.fillText(this.convertToScientific(lineLength, 2), bx, by - 20);
        var lx = x;
        var ly = y;
        var lw = l;
        var lh = h;
        this.text.fillRect(lx, ly, lw, lh);
        var rx = x + w - l;
        var ry = y;
        var rw = l;
        var rh = h;
        this.text.fillRect(rx, ry, rw, rh);
    };
    WebGLApp.prototype.finalUpdate = function (gl) {
        return true;
    };
    WebGLApp.prototype.cleanUp = function (gl) {
        var _this = this;
        gl.deleteProgram(this.programPointCloud);
        gl.deleteBuffer(this.pointcloud.vbo);
        this.objectNames.forEach(function (name) {
            gl.deleteBuffer(_this.inlierVAO[name].vbo);
        });
        gl.deleteBuffer(this.sphere.vbo);
        gl.deleteBuffer(this.sphere.ibo);
        gl.deleteBuffer(this.cylinder.vbo);
        gl.deleteBuffer(this.cylinder.ibo);
        gl.deleteBuffer(this.cone.vbo);
        gl.deleteBuffer(this.cone.ibo);
        gl.deleteBuffer(this.torus.vbo);
        gl.deleteBuffer(this.torus.ibo);
    };
    WebGLApp.prototype.PickPoint = function (x, y) {
        var pixel_length = this.trackball.zoomFactor;
        x *= this.width * 0.5 * this.trackball.zoomFactor;
        y *= this.height * 0.5 * this.trackball.zoomFactor;
        var epos = new vec3(x, y, 1);
        var invView = this.trackball.transformMatrix.transpose().mul(mat4.lookAtInv(this.trackball.eye, this.trackball.at, this.trackball.up));
        var ray_org = invView.mul(new vec4(x, y, -1, 1)).xyz;
        var ray_dir = invView.mul(new vec4(x, y, 1, 1)).xyz.sub(ray_org).normalize();
        var ray_radius = pixel_length * 4;
        var min_index = -1;
        var min_dist = Number.MAX_VALUE;
        var min_pt = null;
        var candidate_point_indices = [];
        for (var k = 0; k < this.vertexData.length; k += 3) {
            var pt = new vec3(this.vertexData[k], this.vertexData[k + 1], this.vertexData[k + 2]);
            var pto = pt.sub(ray_org);
            var dist = pto.sub(ray_dir.mul(ray_dir.dot(pto))).length;
            if (dist < ray_radius) {
                candidate_point_indices.push({ index: k / 3, point: pt });
            }
            if (dist < min_dist) {
                min_index = k / 3;
                min_dist = dist;
                min_pt = pt;
            }
        }
        if (candidate_point_indices.length == 0) {
            this.ray_org = ray_org;
            this.ray_dir = ray_dir;
            this.picked_point = min_pt;
            return min_index;
        }
        var closest_index = -1;
        var closest_dist = Number.MAX_VALUE;
        for (var k = 0; k < candidate_point_indices.length; k++) {
            var candidate = candidate_point_indices[k];
            var dist = this.trackball.eye.sub(candidate.point).length;
            if (dist < closest_dist) {
                closest_index = k;
                closest_dist = dist;
            }
        }
        this.ray_org = ray_org;
        this.ray_dir = ray_dir;
        this.picked_point = candidate_point_indices[closest_index].point;
        return candidate_point_indices[closest_index].index;
    };
    WebGLApp.prototype.GetOutliers = function () {
        return this._vertexData;
    };
    WebGLApp.prototype.onMouseDown = function (event) {
        var x = event.x / this.width;
        var y = event.y / this.height;
        if (event.button == 0) {
            this.trackball.mouse(x, y, this._trackballBehavior);
        }
    };
    WebGLApp.prototype.onMouseUp = function (event) {
        var x = event.x / this.width;
        var y = event.y / this.height;
        if (event.button == 0) {
            this.trackball.mouse(x, y, CameraBehavior.NOTHING);
        }
    };
    WebGLApp.prototype.onMouseMove = function (event) {
        var x = event.x / this.width;
        var y = event.y / this.height;
        this.trackball.motion(x, y);
    };
    WebGLApp.prototype.onMouseOut = function (event) {
        var x = event.x / this.width;
        var y = event.y / this.height;
        if (event.button == 0) {
            this.trackball.mouse(x, y, CameraBehavior.NOTHING);
        }
    };
    WebGLApp.prototype.onTouchStart = function (event) {
        event.preventDefault();
        if (event.touches.length == 1) {
            this.touchID = event.touches[0].identifier;
            this.touchStartTime = (new Date()).getTime();
            var x = event.touches[0].clientX;
            var y = event.touches[0].clientY;
            this.touchStartPos.assign(x, y);
            this.trackball.mouse(x / this.width, y / this.height, this._trackballBehavior);
        }
    };
    WebGLApp.prototype.onTouchMove = function (event) {
        event.preventDefault();
        for (var k = 0; k < event.changedTouches.length; k++) {
            var touch = event.changedTouches[k];
            if (touch.identifier === this.touchID) {
                var x = touch.clientX;
                var y = touch.clientY;
                this.trackball.motion(x / this.width, y / this.height);
            }
        }
    };
    WebGLApp.prototype.onTouchEnd = function (event) {
        event.preventDefault();
        for (var k = 0; k < event.changedTouches.length; k++) {
            var touch = event.changedTouches[k];
            if (touch.identifier === this.touchID) {
                var x = touch.clientX;
                var y = touch.clientY;
                this.trackball.mouse(x / this.width, y / this.height, CameraBehavior.NOTHING);
                var diffTime = (new Date()).getTime() - this.touchStartTime;
                var diffDist = this.touchStartPos.sub(x, y).length;
                if (diffTime < 500 && diffDist < 4) {
                    var eventInit = {
                        bubbles: true, cancelable: true, view: window, detail: 1,
                        screenX: touch.screenX, screenY: touch.screenY,
                        clientX: touch.clientX, clientY: touch.clientY,
                        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                        button: 0, relatedTarget: null
                    };
                    var mouseEvent = new MouseEvent("click", eventInit);
                    if (!(mouseEvent instanceof MouseEvent)) {
                        mouseEvent = document.createEvent("MouseEvent");
                        var e = eventInit;
                        mouseEvent.initMouseEvent("click", e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                    }
                    event.target.dispatchEvent(mouseEvent);
                }
            }
        }
    };
    WebGLApp.prototype.onTouchCancel = function (event) {
        event.preventDefault();
        for (var k = 0; k < event.changedTouches.length; k++) {
            var touch = event.changedTouches[k];
            if (touch.identifier === this.touchID) {
                var x = touch.clientX;
                var y = touch.clientY;
                this.trackball.mouse(x / this.width, y / this.height, CameraBehavior.NOTHING);
            }
        }
    };
    WebGLApp.vsDebugES2 = "#version 100\n\tattribute vec3 pos;\n\n\tuniform vec3 line[2];\n\tuniform mat4 model_matrix;\n\tuniform mat4 view_matrix;\n\tuniform mat4 proj_matrix;\n\n\tvoid main() {\n\t\tgl_Position = proj_matrix*view_matrix*model_matrix*vec4(line[int(pos.x)], 1);\n\t}\n\t";
    WebGLApp.fsDebugES2 = "#version 100\n\tprecision mediump float;\n\n\tvoid main() {\n\t\tgl_FragColor = vec4(1, 0, 0, 1);\n\t}\n\t";
    WebGLApp.vsPointCloudES2 = "#version 100\n    attribute vec3 pos;\n\t\n\tuniform mat4 model_matrix;\n    uniform mat4 view_matrix;\n\tuniform mat4 proj_matrix;\n\tuniform float pointSize;\n\n    void main() {\n        gl_PointSize = pointSize;\n        gl_Position = proj_matrix*view_matrix*model_matrix*vec4(pos, 1);\n    }\n    ";
    WebGLApp.fsPointCloudES2 = "#version 100\n    precision mediump float;\n\n    uniform vec3 color;\n\n    void main() {\n        gl_FragColor = vec4(color, 1.0);\n    }\n    ";
    WebGLApp.vsWireGeometryES2 = "#version 100\n\tattribute vec3 pos;\n\n\tuniform int subroutine_index;\t// 0: plane, 1: sphere, 2: cylinder, 3: cone, 4: torus\n\tuniform vec3 quad[4];\t// ll, lr, ur, ul\n\tuniform float radius0;\t// bottom or tube\n\tuniform float radius1;\t// top or mean\n\tuniform mat4 model_matrix;\n\tuniform mat4 view_matrix;\n\tuniform mat4 proj_matrix;\n\n\tvec4 Plane() { return vec4(quad[int(pos.x)], 1); }\n\tvec4 Sphere() { return vec4(pos, 1); }\n\tvec4 Cylinder() { return vec4(pos, 1); }\n\tvec4 Cone() {\n\t\tfloat height = (pos.y + 1.0)*0.5;\n\t\tfloat interpolated_radius = mix(radius0, radius1, height);\n\t\treturn vec4(vec3(interpolated_radius, 1, interpolated_radius)*pos, 1);\n\t}\n\tvec4 Torus() {\n\t\tvec3 tdir = normalize(vec3(pos.x, 0, pos.z));\n\t\tvec3 pdir = normalize(pos-tdir);\n\t\treturn vec4(radius1*tdir+radius0*pdir, 1);\n\t}\n\tvoid main() {\n\t\tvec4 pos;\n\t\tif(subroutine_index==0) pos = Plane();\n\t\telse if(subroutine_index==1) pos = Sphere();\n\t\telse if(subroutine_index==2) pos = Cylinder();\n\t\telse if(subroutine_index==3) pos = Cone();\n\t\telse if(subroutine_index==4) pos = Torus();\n\t\tgl_Position = proj_matrix*view_matrix*model_matrix*pos;\n\t}\n\t";
    WebGLApp.vsGeometryES2 = "#version 100\n\tattribute vec3 pos;\n\t\n\tuniform int subroutine_index;\t// 0: plane, 1: sphere, 2: cylinder, 3: cone, 4: torus\n\tuniform vec3 quad[4];\t// ll, lr, ur, ul\n\tuniform float radius0;\t// bottom or tube\n\tuniform float radius1;\t// top or mean\n\tuniform mat4 model_matrix;\n\tuniform mat4 view_matrix;\n\tuniform mat4 proj_matrix;\n\n\tvec4 Plane() { return vec4(quad[int(pos.x)], 1); }\n\tvec4 Sphere() { return vec4(pos, 1); }\n\tvec4 Cylinder() { return vec4(pos, 1); }\n\tvec4 Cone() {\n\t\tfloat height = (pos.y + 1.0)*0.5;\n\t\tfloat interpolated_radius = mix(radius0, radius1, height);\n\t\treturn vec4(vec3(interpolated_radius, 1, interpolated_radius)*pos, 1);\n\t}\n\tvec4 Torus() {\n\t\tvec3 tdir = normalize(vec3(pos.x, 0, pos.z));\n\t\tvec3 pdir = normalize(pos-tdir);\n\t\treturn vec4(radius1*tdir+radius0*pdir, 1);\n\t}\n\tvoid main() {\n\t\tvec4 pos;\n\t\tif(subroutine_index==0) pos = Plane();\n\t\telse if(subroutine_index==1) pos = Sphere();\n\t\telse if(subroutine_index==2) pos = Cylinder();\n\t\telse if(subroutine_index==3) pos = Cone();\n\t\telse if(subroutine_index==4) pos = Torus();\n\t\tgl_Position = proj_matrix*view_matrix*model_matrix*pos;\n\t}\n\t";
    WebGLApp.fsWireGeometryES2 = "#version 100\n\tprecision mediump float;\n\t\n\tuniform vec3 color;\n\n\tvoid main() {\n\t\tgl_FragColor = vec4(color, 0.5);\n\t}\n\t";
    WebGLApp.fsGeometryES2 = "#version 100\n\tprecision mediump float;\n\n\tuniform vec3 color;\n\n\t/*http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-barycentric-coordinates/*/\n\t/*float edgeFactor() { \n\t\tvec3 d=fwidth(bary); \n\t\tvec3 a3=smoothstep(vec3(0.0), d*1.5, bary); \n\t\treturn min(min(a3.x, a3.y), a3.z); \n\t}*/\n\tvoid main() {\n\t\t/*float edge = edgeFactor();\n\t\tif(edge==0.0) discard;\n\t\tgl_FragColor = vec4(mix(color, vec3(0.5), edge), 1.0);*/\n\t\tgl_FragColor = vec4(color, 1.0);\n\t}\n\t";
    return WebGLApp;
}(WebGLAppBase));
