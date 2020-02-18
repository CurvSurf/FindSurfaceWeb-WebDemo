/*!
 * File: webglapp_fs.ts
 * Author: Sunggoo Kim <sg.kim@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */
/* gmath.ts */
class Constants {
	static PI: number = 2.0*Math.acos(0);
}

function isNumber(n: any): n is number {
	return typeof(n)==='number';
}

function is<T>(n: any, ctor: new()=>T): n is T {
	return n instanceof ctor;
}

function max(a: number, b: number): number {
	return a > b ? a : b;
}

function min(a: number, b: number): number {
	return a < b ? a : b;
}

function clamp(value: number, vmin: number, vmax: number): number {
	return max(vmin, min(vmax, value));
}

function lerp(v0: vec4, v1: vec4, t: vec4): vec4;
function lerp(v0: vec4, v1: vec4, t: number): vec4;
function lerp(v0: vec3, v1: vec3, t: vec3): vec3;
function lerp(v0: vec3, v1: vec3, t: number): vec3;
function lerp(v0: vec2, v1: vec2, t: vec2): vec2;
function lerp(v0: vec2, v1: vec2, t: number): vec2;
function lerp(v0: number, v1: number, t: number): number;
function lerp(v0: vec4|vec3|vec2|number, v1: vec4|vec3|vec2|number, t: vec4|vec3|vec2|number): vec4|vec3|vec2|number {
	if(v0 instanceof vec4 && v1 instanceof vec4) {
		if(t instanceof vec4) {
			return v0.mul(t.negate().add(1)).add(v1.mul(t));
		} else {
			return v0.mul(1-<number>t).add(v1.mul(<number>t));
		}
	} else if(v0 instanceof vec3 && v1 instanceof vec3) {
		if(t instanceof vec3) {
			return v0.mul(t.negate().add(1)).add(v1.mul(t));
		} else {
			return v0.mul(1-<number>t).add(v1.mul(<number>t));
		}
	} else if(v0 instanceof vec2 && v1 instanceof vec2) {
		if(t instanceof vec2) {
			return v0.mul(t.negate().add(1)).add(v1.mul(t));
		} else {
			return v0.mul(1-<number>t).add(v1.mul(<number>t));
		}
	} else {
		return <number>v0*(1-<number>t)+<number>v1*<number>t;
	}
}

abstract class vec {
	abstract get length(): number;
	abstract negate(): vec;
	abstract normalize(): vec;
	abstract add(v: vec|number): vec;
	abstract sub(v: vec|number): vec;
	abstract mul(v: vec|number): vec;
	abstract div(v: vec|number): vec;
	abstract dot(v: vec): number;
	abstract clamp(vmin: vec|number, vmax: vec|number): vec;
	abstract sum(): number;
	abstract toArray(): number[];
	abstract greaterThan(v: vec|number): boolean;
	abstract lessThan(v: vec|number): boolean;
	abstract equalTo(v: vec|number): boolean;
	abstract greaterThanOrEqualTo(v: vec|number): boolean;
	abstract lessThanOrEqualTo(v: vec|number): boolean;
	abstract maxElement(): number;
	abstract minElement(): number;
	abstract maxElements(v: vec|number): vec;
	abstract minElements(v: vec|number): vec;
	abstract clone(): vec;
}

class vec2 extends vec {
	private _x: number;
	private _y: number;

	constructor(x: number=0, y: number=0) {
		super();
		this._x=x;
		this._y=y;
	}

	public get x(): number { return this._x; }
	public set x(value: number) { this._x = value; }

	public get y(): number { return this._y; }
	public set y(value: number) { this._y = value; }

	public get length2(): number { return this.dot(this); }
	public get length(): number { return this.dot(this)**0.5; }

	public assign(v: vec2): vec2;
	public assign(x: number, y: number): vec2;
	public assign(arg0: number|vec2, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			this._x=arg0._x; this._y=arg0._y;
		} else {
			this._x=arg0; this._y=arg1;
		}
		return this;
	}

	public negate(): vec2 {
		return new vec2(-this._x, -this._y);
	}

	public normalize(): vec2 {
		return this.div(this.length);
	}

	public add(v: vec2): vec2;
	public add(x: number, y: number): vec2;
	public add(n: number): vec2;
	public add(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ? 	new vec2(this._x+arg0._x, this._y+arg0._y) :
				isNumber(arg1) ? 	new vec2(this._x+arg0, this._y+arg1) :
									new vec2(this._x+arg0, this._y+arg0);
	}

	public sub(v: vec2): vec2;
	public sub(x: number, y: number): vec2;
	public sub(n: number): vec2;
	public sub(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ?	new vec2(this._x-arg0._x, this._y-arg0._y) :
				isNumber(arg1) ?	new vec2(this._x-arg0, this._y-arg1) :
									new vec2(this._x-arg0, this._y-arg0);
	}

	public mul(m: mat2): vec2;
	public mul(v: vec2): vec2;
	public mul(x: number, y: number): vec2;
	public mul(n: number): vec2;
	public mul(arg0: mat2|vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof mat2 ? 	new vec2(this.dot(arg0.column(0)), this.dot(arg0.column(1))) :
			   	arg0 instanceof vec2 ? 	new vec2(this._x*arg0._x, this._y*arg0._y) :
				isNumber(arg1) ?	new vec2(this._x*arg0, this._y*arg1) :
									new vec2(this._x*arg0, this._y*arg0);
	}

	public div(v: vec2): vec2;
	public div(x: number, y: number): vec2;
	public div(n: number): vec2;
	public div(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ?	new vec2(this._x/arg0._x, this._y/arg0._y) :
				isNumber(arg1) ?	new vec2(this._x/arg0, this._y/arg1) :
									new vec2(this._x/arg0, this._y/arg0);
	}

	public dot(v: vec2): number;
	public dot(x: number, y: number): number;
	public dot(arg0: vec2|number, arg1?: number): number {
		return 	arg0 instanceof vec2 ? 	this.mul(arg0).sum() :
									this.mul(arg0, arg1).sum();
	}

	public clamp(vmin: vec2, vmax: vec2): vec2;
	public clamp(vmin: number, vmax: number): vec2;
	public clamp(vmin: vec2|number, vmax: vec2|number): vec2 {
		return 	vmin instanceof vec2 && vmax instanceof vec2 ?
					new vec2(clamp(this._x, vmin._x, vmax._x),
							 clamp(this._y, vmin._y, vmax._y)) :
					new vec2(clamp(this._x, <number>vmin, <number>vmax),
							 clamp(this._y, <number>vmin, <number>vmax));
	}

	public sum(): number { return this._x+this._y; }

	public toArray(): [number, number] {
		return [this._x, this._y];
	}

	public greaterThan(v: vec2): boolean;
	public greaterThan(x: number, y: number): boolean;
	public greaterThan(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this._x>arg0._x&&this._y>arg0._y;
		} else {
			return this._x>arg0&&this._y>arg1;
		}
	}

	public lessThan(v: vec2): boolean;
	public lessThan(x: number, y: number): boolean;
	public lessThan(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this._x<arg0._x&&this._y<arg0._y;
		} else {
			return this._x<arg0&&this._y<arg1;
		}
	}

	public equalTo(v: vec2): boolean;
	public equalTo(x: number, y: number): boolean;
	public equalTo(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return Math.abs(this._x-arg0._x)<Number.EPSILON&&
				   Math.abs(this._y-arg0._y)<Number.EPSILON;
		} else {
			return Math.abs(this._x-arg0)<Number.EPSILON&&
				   Math.abs(this._y-arg1)<Number.EPSILON;
		}
	}

	public greaterThanOrEqualTo(v: vec2): boolean;
	public greaterThanOrEqualTo(x: number, y: number): boolean;
	public greaterThanOrEqualTo(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this.greaterThan(arg0)||this.equalTo(arg0);
		} else {
			return this.greaterThan(arg0, arg1)||this.equalTo(arg0, arg1);
		}
	}

	public lessThanOrEqualTo(v: vec2): boolean;
	public lessThanOrEqualTo(x: number, y: number): boolean;
	public lessThanOrEqualTo(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this.lessThan(arg0)||this.equalTo(arg0);
		} else {
			return this.lessThan(arg0, arg1)||this.equalTo(arg0, arg1);
		}
	}

	public maxElement(): number {
		return Math.max(this._x, this._y);
	}

	public minElement(): number {
		return Math.min(this._x, this._y);
	}

	public maxElements(v: vec2): vec2;
	public maxElements(x: number, y: number): vec2;
	public maxElements(arg0: vec2|number, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			return new vec2(Math.max(this._x, arg0._x),
							Math.max(this._y, arg0._y));
		} else {
			return new vec2(Math.max(this._x, arg0),
							Math.max(this._y, arg1));
		}
	}

	public minElements(v: vec2): vec2;
	public minElements(x: number, y: number): vec2;
	public minElements(arg0: vec2|number, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			return new vec2(Math.min(this._x, arg0._x),
							Math.min(this._y, arg0._y));
		} else {
			return new vec2(Math.min(this._x, arg0),
							Math.min(this._y, arg1));
		}
	}

	public clone(): vec2 { return new vec2().assign(this); }

	public get xx(): vec2 { return new vec2(this._x, this._x); }
	public get xy(): vec2 { return new vec2(this._x, this._y); }
	public get yx(): vec2 { return new vec2(this._y, this._x); }
	public get yy(): vec2 { return new vec2(this._y, this._y); }
}

class vec3 extends vec {
	private _x: number;
	private _y: number;
	private _z: number;

	constructor(x: number=0, y: number=0, z: number=0) {
		super();
		this._x=x;
		this._y=y;
		this._z=z;
	}

	public get x(): number { return this._x; }
	public set x(value: number) { this._x=value; }

	public get y(): number { return this._y; }
	public set y(value: number) { this._y=value; }

	public get z(): number { return this._z; }
	public set z(value: number) { this._z=value; }

	public get length2(): number { return this.dot(this); }
	public get length(): number { return this.dot(this)**0.5; }

	public assign(xyz: vec3): vec3;
	public assign(xy: vec2, z: number): vec3;
	public assign(x: number, yz: vec2): vec3;
	public assign(x: number, y: number, z: number): vec3;
	public assign(arg0: number|vec2|vec3, arg1?: number|vec2, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			this._x=arg0.x; this._y=arg0.y; this._z=arg0.z;
		} else if(arg0 instanceof vec2) {
			this._x=arg0.x; this._y=arg0.y; this._z=<number>arg1;
		} else {
			if(arg1 instanceof vec2) {
				this._x=arg0; this._y=arg1.x; this._z=arg1.y;
			} else {
				this._x=arg0; this._y=arg1; this._z=arg2;
			}
		}
		return this;
	}

	public negate(): vec3 {
		return new vec3(-this._x, -this._y, -this._z);
	}

	public normalize(): vec3 {
		return this.div(this.length);
	}

	public add(v: vec3): vec3;
	public add(xy: vec2, z: number): vec3;
	public add(x: number, yz: vec2): vec3;
	public add(x: number, y: number, z: number): vec3;
	public add(n: number): vec3;
	public add(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(this._x+arg0.x, this._y+arg0.y, this._z+arg0.z);
		} else if(arg0 instanceof vec2) {
			return new vec3(this._x+arg0.x, this._y+arg0.y, this._z+<number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this._x+arg0, this._y+arg1.x, this._z+arg1.y);
			} else if(isNumber(arg2)) {
				return new vec3(this._x+arg0, this._y+arg1, this._z+arg2);
			} else {
				return new vec3(this._x+arg0, this._y+arg0, this._z+arg0);
			}
		}
	}

	public sub(v: vec3): vec3;
	public sub(xy: vec2, z: number): vec3;
	public sub(x: number, yz: vec2): vec3;
	public sub(x: number, y: number, z: number): vec3;
	public sub(n: number): vec3;
	public sub(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(this._x-arg0.x, this._y-arg0.y, this._z-arg0.z);
		} else if(arg0 instanceof vec2) {
			return new vec3(this._x-arg0.x, this._y-arg0.y, this._z-<number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this._x-arg0, this._y-arg1.x, this._z-arg1.y);
			} else if(isNumber(arg2)) {
				return new vec3(this._x-arg0, this._y-arg1, this._z-arg2);
			} else {
				return new vec3(this._x-arg0, this._y-arg0, this._z-arg0);
			}
		}
	}

	public mul(m: mat3): vec3;
	public mul(v: vec3): vec3;
	public mul(xy: vec2, z: number): vec3;
	public mul(x: number, yz: vec2): vec3;
	public mul(x: number, y: number, z: number): vec3;
	public mul(n: number): vec3;
	public mul(arg0: mat3|vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof mat3) {
			return new vec3(this.dot(arg0.column(0)), this.dot(arg0.column(1)), this.dot(arg0.column(2)));
		} else if(arg0 instanceof vec3) {
			return new vec3(this._x*arg0.x, this._y*arg0.y, this._z*arg0.z);
		} else if(arg0 instanceof vec2) {
			return new vec3(this._x*arg0.x, this._y*arg0.y, this._z*<number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this._x*arg0, this._y*arg1.x, this._z*arg1.y);
			} else if(isNumber(arg2)) {
				return new vec3(this._x*arg0, this._y*arg1, this._z*arg2);
			} else {
				return new vec3(this._x*arg0, this._y*arg0, this._z*arg0);
			}
		}
	}

	public div(v: vec3): vec3;
	public div(xy: vec2, z: number): vec3;
	public div(x: number, yz: vec2): vec3;
	public div(x: number, y: number, z: number): vec3;
	public div(n: number): vec3;
	public div(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(this._x/arg0.x, this._y/arg0.y, this._z/arg0.z);
		} else if(arg0 instanceof vec2) {
			return new vec3(this._x/arg0.x, this._y/arg0.y, this._z/<number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this._x/arg0, this._y/arg1.x, this._z/arg1.y);
			} else if(isNumber(arg2)) {
				return new vec3(this._x/arg0, this._y/arg1, this._z/arg2);
			} else {
				return new vec3(this._x/arg0, this._y/arg0, this._z/arg0);
			}
		}
	}

	public dot(v: vec3): number;
	public dot(xy: vec2, z: number): number;
	public dot(x: number, yx: vec2): number;
	public dot(x: number, y: number, z: number): number;
	public dot(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): number {
		if(arg0 instanceof vec3) {
			return this.mul(arg0).sum();
		} else if(arg0 instanceof vec2) {
			return this.mul(arg0, <number>arg1).sum();
		} else {
			if(arg1 instanceof vec2) {
				return this.mul(arg0, arg1).sum();
			} else {
				return this.mul(arg0, arg1, arg2).sum();
			}
		}
	}

	public cross(v: vec3): vec3;
	public cross(xy: vec2, z: number): vec3;
	public cross(x: number, yx: vec2): vec3;
	public cross(x: number, y: number, z: number): vec3;
	public cross(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(this._y*arg0.z-this._z*arg0.y,
							this._z*arg0.x-this._x*arg0.z,
							this._x*arg0.y-this._y*arg0.x);
		} else if(arg0 instanceof vec2) {
			return new vec3(this._y*<number>arg1-this._z*arg0.y,
							this._z*arg0.x-this._x*<number>arg1,
							this._x*arg0.y-this._y*arg0.x);
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this._y*arg1.y-this._z*arg1.x,
								this._z*arg0-this._x*arg1.y,
								this._x*arg1.x-this._y*arg0);
			} else {
				return new vec3(this._y*arg2-this._z*arg1,
								this._z*arg0-this._x*arg2,
								this._x*arg1-this._y*arg0);
			}
		}
	}

	public clamp(vmin: vec3, vmax: vec3): vec3;
	public clamp(vmin: number, vmax: number): vec3;
	public clamp(vmin: vec3|number, vmax: vec3|number): vec3 {
		return 	vmin instanceof vec3 && vmax instanceof vec3 ?
					new vec3(clamp(this._x, vmin.x, vmax.x),
							 clamp(this._y, vmin.y, vmax.y),
							 clamp(this._z, vmin.z, vmax.z)) :
					new vec3(clamp(this._x, <number>vmin, <number>vmax),
							 clamp(this._y, <number>vmin, <number>vmax), 
							 clamp(this._z, <number>vmin, <number>vmax));
	}

	public sum(): number { return this._x+this._y+this._z; }
	
	public toArray(): [number, number, number] {
		return [this._x, this._y, this._z];
	}

	public greaterThan(v: vec3): boolean;
	public greaterThan(xy: vec2, z: number): boolean;
	public greaterThan(x: number, yz: vec2): boolean;
	public greaterThan(x: number, y: number, z: number): boolean;
	public greaterThan(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
		if(arg0 instanceof vec3) {
			return this._x>arg0.x&&this._y>arg0.y&&this._z>arg0.z;
		} else if(arg0 instanceof vec2) {
			return this._x>arg0.x&&this._y>arg0.y&&this._z>arg1;
		} else {
			if(arg1 instanceof vec2) {
				return this._x>arg0&&this._y>arg1.x&&this._z>arg1.y;
			} else {
				return this._x>arg0&&this._y>arg1&&this._z>arg2;
			}
		}
	}

	public lessThan(v: vec3): boolean;
	public lessThan(xy: vec2, z: number): boolean;
	public lessThan(x: number, yz: vec2): boolean;	
	public lessThan(x: number, y: number, z: number): boolean;
	public lessThan(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
		if(arg0 instanceof vec3) {
			return this._x<arg0.x&&this._y<arg0.y&&this._z<arg0.z;
		} else if(arg0 instanceof vec2) {
			return this._x<arg0.x&&this._y<arg0.y&&this._z<arg1;
		} else {
			if(arg1 instanceof vec2) {
				return this._x<arg0&&this._y<arg1.x&&this._z<arg1.y;
			} else {
				return this._x<arg0&&this._y<arg1&&this._z<arg2;
			}
		}
	}

	public equalTo(v: vec3): boolean;
	public equalTo(xy: vec2, z: number): boolean;
	public equalTo(x: number, yz: vec2): boolean;
	public equalTo(x: number, y: number, z: number): boolean;
	public equalTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
		if(arg0 instanceof vec3) {
			return Math.abs(this._x-arg0.x)<Number.EPSILON&&
				   Math.abs(this._y-arg0.y)<Number.EPSILON&&
				   Math.abs(this._z-arg0.z)<Number.EPSILON;
		} else if(arg0 instanceof vec2) {
			return Math.abs(this._x-arg0.x)<Number.EPSILON&&
				   Math.abs(this._y-arg0.y)<Number.EPSILON&&
				   Math.abs(this._z-<number>arg1)<Number.EPSILON;
		} else {
			if(arg1 instanceof vec2) {
				return Math.abs(this._x-arg0)<Number.EPSILON&&
					   Math.abs(this._y-arg1.x)<Number.EPSILON&&
					   Math.abs(this._z-arg1.y)<Number.EPSILON;
			} else {
				return Math.abs(this._x-arg0)<Number.EPSILON&&
					   Math.abs(this._y-arg1)<Number.EPSILON&&
				   	   Math.abs(this._z-arg2)<Number.EPSILON;
			}
		}
	}

	public greaterThanOrEqualTo(v: vec3): boolean;
	public greaterThanOrEqualTo(xy: vec2, z: number): boolean;
	public greaterThanOrEqualTo(x: number, yz: vec2): boolean;
	public greaterThanOrEqualTo(x: number, y: number, z: number): boolean;
	public greaterThanOrEqualTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
		if(arg0 instanceof vec3) {
			return this.greaterThan(arg0)||this.equalTo(arg0);
		} else if(arg0 instanceof vec2) {
			return this.greaterThan(arg0, <number>arg1)||this.equalTo(arg0, <number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return this.greaterThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else {
				return this.greaterThan(arg0, arg1, arg2)||this.equalTo(arg0, arg1, arg2);
			}
		}
	}

	public lessThanOrEqualTo(v: vec3): boolean;
	public lessThanOrEqualTo(xy: vec2, z: number): boolean;
	public lessThanOrEqualTo(x: number, yz: vec2): boolean;
	public lessThanOrEqualTo(x: number, y: number, z: number): boolean;
	public lessThanOrEqualTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
		if(arg0 instanceof vec3) {
			return this.lessThan(arg0)||this.equalTo(arg0);
		} else if(arg0 instanceof vec2) {
			return this.lessThan(arg0, <number>arg1)||this.equalTo(arg0, <number>arg1);
		} else {
			if(arg1 instanceof vec2) {
				return this.lessThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else {
				return this.lessThan(arg0, arg1, arg2)||this.equalTo(arg0, arg1, arg2);			}
		}
	}

	public maxElement(): number {
		return Math.max(this._x, this._y, this._z);
	}

	public minElement(): number {
		return Math.min(this._x, this._y, this._z);
	}

	public maxElements(v: vec3): vec3;
	public maxElements(xy: vec2, z: number): vec3;
	public maxElements(x: number, yz: vec2): vec3;
	public maxElements(x: number, y: number, z: number): vec3;
	public maxElements(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(Math.max(this._x, arg0.x),
							Math.max(this._y, arg0.y),
							Math.max(this._z, arg0.z));
		} else if(arg0 instanceof vec2) {
			return new vec3(Math.max(this._x, arg0.x),
							Math.max(this._y, arg0.y),
							Math.max(this._z, <number>arg1));
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(Math.max(this._x, arg0),
								Math.max(this._y, arg1.x),
								Math.max(this._z, arg1.y));
			} else {
				return new vec3(Math.max(this._x, arg0),
								Math.max(this._y, arg1),
								Math.max(this._z, arg2));
			}
		}
	}

	public minElements(v: vec3): vec3;
	public minElements(xy: vec2, z: number): vec3;
	public minElements(x: number, yz: vec2): vec3;
	public minElements(x: number, y: number, z: number): vec3;
	public minElements(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
		if(arg0 instanceof vec3) {
			return new vec3(Math.min(this._x, arg0.x),
							Math.min(this._y, arg0.y),
							Math.min(this._z, arg0.z));
		} else if(arg0 instanceof vec2) {
			return new vec3(Math.min(this._x, arg0.x),
							Math.min(this._y, arg0.y),
							Math.min(this._z, <number>arg1));
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(Math.min(this._x, arg0),
								Math.min(this._y, arg1.x),
								Math.min(this._z, arg1.y));
			} else {
				return new vec3(Math.min(this._x, arg0),
								Math.min(this._y, arg1),
								Math.min(this._z, arg2));
			}
		}
	}

	public clone(): vec3 { return new vec3().assign(this); }

	public static angleBetween(v0: vec3, v1: vec3): number;
	public static angleBetween(v0: vec3, v1: vec3, ref: vec3): number;
	public static angleBetween(arg0: vec3, arg1: vec3, arg2?: vec3) {
		let v0: vec3 = arg0.normalize();
		let v1: vec3 = arg1.normalize();
		if(typeof arg2 == "undefined") {
			return Math.acos(v0.dot(v1));
		}
		else {
			let sign: number = v0.cross(v1).dot(arg2);
			sign /= Math.abs(sign);
			return Math.acos(v0.dot(v1))*sign;
		}
	}
	
	public static absoluteAngleBetween(v0: vec3, v1: vec3, ref: vec3): number {
		let signedAngle: number = this.angleBetween(v0, v1, ref);
		if (signedAngle < 0.0) return 2*Constants.PI + signedAngle;
		else return signedAngle;
	}

	public get xx(): vec2 { return new vec2(this._x, this._x); }
	public get xy(): vec2 { return new vec2(this._x, this._y); }
	public get xz(): vec2 { return new vec2(this._x, this._z); }
	public get yx(): vec2 { return new vec2(this._y, this._x); }
	public get yy(): vec2 { return new vec2(this._y, this._y); }
	public get yz(): vec2 { return new vec2(this._y, this._z); }
	public get zx(): vec2 { return new vec2(this._z, this._x); }
	public get zy(): vec2 { return new vec2(this._z, this._y); }
	public get zz(): vec2 { return new vec2(this._z, this._z); }
	
	public get xxx(): vec3 { return new vec3(this._x, this._x, this._x); }
	public get xxy(): vec3 { return new vec3(this._x, this._x, this._y); }
	public get xxz(): vec3 { return new vec3(this._x, this._x, this._z); }
	public get xyx(): vec3 { return new vec3(this._x, this._y, this._x); }
	public get xyy(): vec3 { return new vec3(this._x, this._y, this._y); }
	public get xyz(): vec3 { return new vec3(this._x, this._y, this._z); }
	public get xzx(): vec3 { return new vec3(this._x, this._z, this._x); }
	public get xzy(): vec3 { return new vec3(this._x, this._z, this._y); }
	public get xzz(): vec3 { return new vec3(this._x, this._z, this._z); }
	public get yxx(): vec3 { return new vec3(this._y, this._x, this._x); }
	public get yxy(): vec3 { return new vec3(this._y, this._x, this._y); }
	public get yxz(): vec3 { return new vec3(this._y, this._x, this._z); }
	public get yyx(): vec3 { return new vec3(this._y, this._y, this._x); }
	public get yyy(): vec3 { return new vec3(this._y, this._y, this._y); }
	public get yyz(): vec3 { return new vec3(this._y, this._y, this._z); }
	public get yzx(): vec3 { return new vec3(this._y, this._z, this._x); }
	public get yzy(): vec3 { return new vec3(this._y, this._z, this._y); }
	public get yzz(): vec3 { return new vec3(this._y, this._z, this._z); }
	public get zxx(): vec3 { return new vec3(this._z, this._x, this._x); }
	public get zxy(): vec3 { return new vec3(this._z, this._x, this._y); }
	public get zxz(): vec3 { return new vec3(this._z, this._x, this._z); }
	public get zyx(): vec3 { return new vec3(this._z, this._y, this._x); }
	public get zyy(): vec3 { return new vec3(this._z, this._y, this._y); }
	public get zyz(): vec3 { return new vec3(this._z, this._y, this._z); }
	public get zzx(): vec3 { return new vec3(this._z, this._z, this._x); }
	public get zzy(): vec3 { return new vec3(this._z, this._z, this._y); }
	public get zzz(): vec3 { return new vec3(this._z, this._z, this._z); }
}

class vec4 extends vec {
	private _x: number;
	private _y: number;
	private _z: number;
	private _w: number;
	constructor(x: number=0, y: number=0, z: number=0, w: number=0) {
		super();
		this._x=x;
		this._y=y;
		this._z=z;
		this._w=w;
	}

	public get x(): number { return this._x; }
	public set x(value: number) { this._x=value; }

	public get y(): number { return this._y; }
	public set y(value: number) { this._y=value; }

	public get z(): number { return this._z; }
	public set z(value: number) { this._z=value; }

	public get w(): number { return this._w; }
	public set w(value: number) { this._w=value; }

	public get length2(): number { return this.dot(this); }
	public get length(): number { return this.dot(this)**0.5; }

	public assign(xyzw: vec4): vec4;
	public assign(xyz: vec3, w: number): vec4;
	public assign(xy: vec2, zw: vec2): vec4;
	public assign(xy: vec2, z: number, w: number): vec4;
	public assign(x: number, yzw: vec3): vec4;
	public assign(x: number, yz: vec2, w: number): vec4;
	public assign(x: number, y: number, zw: vec2): vec4;
	public assign(x: number, y: number, z: number, w: number): vec4;
	public assign(arg0: number|vec2|vec3|vec4, arg1?: number|vec2|vec3, arg2?: number|vec2, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			this._x=arg0.x; this._y=arg0.y; this._z=arg0.z; this._w=arg0.w;
		} else if(arg0 instanceof vec3) {
			this._x=arg0.x; this._y=arg0.y; this._z=arg0.z; this._w=<number>arg1;
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				this._x=arg0.x; this._y=arg0.y; this._z=arg1.x; this._w=arg1.y;
			} else {
				this._x=arg0.x; this._y=arg0.y; this._z=<number>arg1; this._w=<number>arg2;
			}
		} else {
			if(arg1 instanceof vec3) {
				this._x=arg0; this._y=arg1.x; this._z=arg1.y; this._w=arg1.z;
			} else if(arg1 instanceof vec2) {
				this._x=arg0; this._y=arg1.x; this._z=arg1.y; this._w=<number>arg2;
			} else {
				if(arg2 instanceof vec2) {
					this._x=arg0; this._y=arg1; this._z=arg2.x; this._w=arg2.y;
				} else {
					this._x=arg0; this._y=arg1; this._z=arg2; this._w=arg3;
				}
			}
		}
		return this;
	}

	public negate(): vec4 {
		return new vec4(-this._x, -this._y, -this._z, -this._w);
	}

	public normalize(): vec4 {
		return this.div(this.length);
	}

	public add(v: vec4): vec4;
	public add(xyz: vec3, w: number): vec4;
	public add(xy: vec2, zw: vec2): vec4;
	public add(xy: vec2, z: number, w: number): vec4;
	public add(x: number, yzw: vec3): vec4;
	public add(x: number, yz: vec2, w: number): vec4;
	public add(x: number, y: number, zw: vec2): vec4;
	public add(x: number, y: number, z: number, w: number): vec4;
	public add(n: number): vec4;
	public add(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			return new vec4(this._x+arg0.x, this._y+arg0.y, this._z+arg0.z, this._w+arg0.w);
		} else if(arg0 instanceof vec3) {
			return new vec4(this._x+arg0.x, this._y+arg0.y, this._z+arg0.z, this._w+<number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(this._x+arg0.x, this._y+arg0.y, this._z+arg1.x, this._w+arg1.y);
			} else {
				return new vec4(this._x+arg0.x, this._y+arg0.y, this._z+<number>arg1, this._w+<number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(this._x+arg0, this._y+arg1.x, this._z+arg1.y, this._w+arg1.z);
			} else if(arg1 instanceof vec2) {
				return new vec4(this._x+arg0, this._y+arg1.x, this._z+arg1.y, this._w+<number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(this._x+arg0, this._y+arg1, this._z+arg2.x, this._w+arg2.y);
				} else if(isNumber(arg3)) {
					return new vec4(this._x+arg0, this._y+arg1, this._z+arg2, this._w+arg3);
				} else {
					return new vec4(this._x+arg0, this._y+arg0, this._z+arg0, this._w+arg0);
				}
			}
		}
	}

	public sub(v: vec4): vec4;
	public sub(xyz: vec3, w: number): vec4;
	public sub(xy: vec2, zw: vec2): vec4;
	public sub(xy: vec2, z: number, w: number): vec4;
	public sub(x: number, yzw: vec3): vec4;
	public sub(x: number, yz: vec2, w: number): vec4;
	public sub(x: number, y: number, zw: vec2): vec4;
	public sub(x: number, y: number, z: number, w: number): vec4;
	public sub(n: number): vec4;
	public sub(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			return new vec4(this._x-arg0.x, this._y-arg0.y, this._z-arg0.z, this._w-arg0.w);
		} else if(arg0 instanceof vec3) {
			return new vec4(this._x-arg0.x, this._y-arg0.y, this._z-arg0.z, this._w-<number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(this._x-arg0.x, this._y-arg0.y, this._z-arg1.x, this._w-arg1.y);
			} else {
				return new vec4(this._x-arg0.x, this._y-arg0.y, this._z-<number>arg1, this._w-<number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(this._x-arg0, this._y-arg1.x, this._z-arg1.y, this._w-arg1.z);
			} else if(arg1 instanceof vec2) {
				return new vec4(this._x-arg0, this._y-arg1.x, this._z-arg1.y, this._w-<number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(this._x-arg0, this._y-arg1, this._z-arg2.x, this._w-arg2.y);
				} else if(isNumber(arg3)) {
					return new vec4(this._x-arg0, this._y-arg1, this._z-arg2, this._w-arg3);
				} else {
					return new vec4(this._x-arg0, this._y-arg0, this._z-arg0, this._w-arg0);
				}
			}
		}	
	}

	public mul(m: mat4): vec4;
	public mul(v: vec4): vec4;
	public mul(xyz: vec3, w: number): vec4;
	public mul(xy: vec2, zw: vec2): vec4;
	public mul(xy: vec2, z: number, w: number): vec4;
	public mul(x: number, yzw: vec3): vec4;
	public mul(x: number, yz: vec2, w: number): vec4;
	public mul(x: number, y: number, zw: vec2): vec4;
	public mul(x: number, y: number, z: number, w: number): vec4;
	public mul(n: number): vec4;
	public mul(arg0: mat4|vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof mat4) {
			return new vec4(this.dot(arg0.column(0)), this.dot(arg0.column(1)), this.dot(arg0.column(2)), this.dot(arg0.column(3)));
		} else if(arg0 instanceof vec4) {
			return new vec4(this._x*arg0.x, this._y*arg0.y, this._z*arg0.z, this._w*arg0.w);
		} else if(arg0 instanceof vec3) {
			return new vec4(this._x*arg0.x, this._y*arg0.y, this._z*arg0.z, this._w*<number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(this._x*arg0.x, this._y*arg0.y, this._z*arg1.x, this._w*arg1.y);
			} else {
				return new vec4(this._x*arg0.x, this._y*arg0.y, this._z*<number>arg1, this._w*<number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(this._x*arg0, this._y*arg1.x, this._z*arg1.y, this._w*arg1.z);
			} else if(arg1 instanceof vec2) {
				return new vec4(this._x*arg0, this._y*arg1.x, this._z*arg1.y, this._w*<number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(this._x*arg0, this._y*arg1, this._z*arg2.x, this._w*arg2.y);
				} else if(isNumber(arg3)) {
					return new vec4(this._x*arg0, this._y*arg1, this._z*arg2, this._w*arg3);
				} else {
					return new vec4(this._x*arg0, this._y*arg0, this._z*arg0, this._w*arg0);
				}
			}
		}	
	}

	public div(v: vec4): vec4;
	public div(xyz: vec3, w: number): vec4;
	public div(xy: vec2, zw: vec2): vec4;
	public div(xy: vec2, z: number, w: number): vec4;
	public div(x: number, yzw: vec3): vec4;
	public div(x: number, yz: vec2, w: number): vec4;
	public div(x: number, y: number, zw: vec2): vec4;
	public div(x: number, y: number, z: number, w: number): vec4;
	public div(n: number): vec4;
	public div(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			return new vec4(this._x/arg0.x, this._y/arg0.y, this._z/arg0.z, this._w/arg0.w);
		} else if(arg0 instanceof vec3) {
			return new vec4(this._x/arg0.x, this._y/arg0.y, this._z/arg0.z, this._w/<number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(this._x/arg0.x, this._y/arg0.y, this._z/arg1.x, this._w/arg1.y);
			} else {
				return new vec4(this._x/arg0.x, this._y/arg0.y, this._z/<number>arg1, this._w/<number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(this._x/arg0, this._y/arg1.x, this._z/arg1.y, this._w/arg1.z);
			} else if(arg1 instanceof vec2) {
				return new vec4(this._x/arg0, this._y/arg1.x, this._z/arg1.y, this._w/<number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(this._x/arg0, this._y/arg1, this._z/arg2.x, this._w/arg2.y);
				} else if(isNumber(arg3)) {
					return new vec4(this._x/arg0, this._y/arg1, this._z/arg2, this._w/arg3);
				} else {
					return new vec4(this._x/arg0, this._y/arg0, this._z/arg0, this._w/arg0);
				}
			}
		}	
	}

	public dot(v: vec4): number;
	public dot(xyz: vec3, w: number): number;
	public dot(xy: vec2, zw: vec2): number;
	public dot(xy: vec2, z: number, w: number): number;
	public dot(x: number, yzw: vec3): number;
	public dot(x: number, yz: vec2, w: number): number;
	public dot(x: number, y: number, zw: vec2): number;
	public dot(x: number, y: number, z: number, w: number): number;
	public dot(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): number {
		if(arg0 instanceof vec4) {
			return this._x*arg0.x+this._y*arg0.y+this._z*arg0.z+this._w*arg0.w;
		} else if(arg0 instanceof vec3) {
			return this._x*arg0.x+this._y*arg0.y+this._z*arg0.z+this._w*<number>arg1;
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return this._x*arg0.x+this._y*arg0.y+this._z*arg1.x+this._w*arg1.y;
			} else {
				return this._x*arg0.x+this._y*arg0.y+this._z*<number>arg1+this._w*<number>arg2;
			}
		} else {
			if(arg1 instanceof vec3) {
				return this._x*arg0+this._y*arg1.x+this._z*arg1.y+this._w*arg1.z;
			} else if(arg1 instanceof vec2) {
				return this._x*arg0+this._y*arg1.x+this._z*arg1.y+this._w*<number>arg2;
			} else {
				if(arg2 instanceof vec2) {
					return this._x*arg0+this._y*arg1+this._z*arg2.x+this._w*arg2.y;
				} else {
					return this._x*arg0+this._y*arg1+this._z*arg2+this._w*arg3;
				}
			}
		}	
	}

	public clamp(vmin: vec4, vmax: vec4): vec4;
	public clamp(vmin: number, vmax: number): vec4;
	public clamp(vmin: vec4|number, vmax: vec4|number): vec4 {
		return 	vmin instanceof vec4 && vmax instanceof vec4 ?
					new vec4(clamp(this._x, vmin.x, vmax.x),
							 clamp(this._y, vmin.y, vmax.y),
							 clamp(this._z, vmin.z, vmax.z),
							 clamp(this._w, vmin.w, vmax.w)) :
					new vec4(clamp(this._x, <number>vmin, <number>vmax),
							 clamp(this._y, <number>vmin, <number>vmax),
							 clamp(this._z, <number>vmin, <number>vmax),
							 clamp(this._w, <number>vmin, <number>vmax));
	}

	public sum(): number { return this._x+this._y+this._z+this._w; }
		
	public toArray(): [number, number, number, number] {
		return [this._x, this._y, this._z, this._w];
	}

	public greaterThan(v: vec4): boolean;
	public greaterThan(xyz: vec3, w: number): boolean;
	public greaterThan(xy: vec2, zw: vec2): boolean;
	public greaterThan(xy: vec2, z: number, w: number): boolean;
	public greaterThan(x: number, yzw: vec3): boolean;
	public greaterThan(x: number, yz: vec2, w: number): boolean;
	public greaterThan(x: number, y: number, zw: vec2): boolean;
	public greaterThan(x: number, y: number, z: number, w: number): boolean;
	public greaterThan(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
		if(arg0 instanceof vec4) {
			return this._x>arg0.x&&this._y>arg0.y&&this._z>arg0.z&&this._w>arg0.w;
		} else if(arg0 instanceof vec3) {
			return this._x>arg0.x&&this._y>arg0.y&&this._z>arg0.z&&this._w>arg1;
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return this._x>arg0.x&&this._y>arg0.y&&this._z>arg1.x&&this._w>arg1.y;
			} else {
				return this._x>arg0.x&&this._y>arg0.y&&this._z>arg1&&this._w>arg2;
			}
		} else {
			if(arg1 instanceof vec3) {
				return this._x>arg0&&this._y>arg1.x&&this._z>arg1.y&&this._w>arg1.z;
			} else if(arg1 instanceof vec2) {
				return this._x>arg0&&this._y>arg1.x&&this._z>arg1.y&&this._w>arg2;
			} else {
				if(arg2 instanceof vec2) {
					return this._x>arg0&&this._y>arg1&&this._z>arg2.x&&this._w>arg2.y;
				} else {
					return this._x>arg0&&this._y>arg1&&this._z>arg2&&this._w>arg3;
				}
			}
		}
	}

	public lessThan(v: vec4): boolean;
	public lessThan(xyz: vec3, w: number): boolean;
	public lessThan(xy: vec2, zw: vec2): boolean;
	public lessThan(xy: vec2, z: number, w: number): boolean;
	public lessThan(x: number, yzw: vec3): boolean;
	public lessThan(x: number, yz: vec2, w: number): boolean;
	public lessThan(x: number, y: number, zw: vec2): boolean;
	public lessThan(x: number, y: number, z: number, w: number): boolean;
	public lessThan(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
		if(arg0 instanceof vec4) {
			return this._x<arg0.x&&this._y<arg0.y&&this._z<arg0.z&&this._w<arg0.w;
		} else if(arg0 instanceof vec3) {
			return this._x<arg0.x&&this._y<arg0.y&&this._z<arg0.z&&this._w<arg1;
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return this._x<arg0.x&&this._y<arg0.y&&this._z<arg1.x&&this._w<arg1.y;
			} else {
				return this._x<arg0.x&&this._y<arg0.y&&this._z<arg1&&this._w<arg2;
			}
		} else {
			if(arg1 instanceof vec3) {
				return this._x<arg0&&this._y<arg1.x&&this._z<arg1.y&&this._w<arg1.z;
			} else if(arg1 instanceof vec2) {
				return this._x<arg0&&this._y<arg1.x&&this._z<arg1.y&&this._w<arg2;
			} else {
				if(arg2 instanceof vec2) {
					return this._x<arg0&&this._y<arg1&&this._z<arg2.x&&this._w<arg2.y;
				} else {
					return this._x<arg0&&this._y<arg1&&this._z<arg2&&this._w<arg3;
				}
			}
		}
	}

	public equalTo(v: vec4): boolean;
	public equalTo(xyz: vec3, w: number): boolean;
	public equalTo(xy: vec2, zw: vec2): boolean;
	public equalTo(xy: vec2, z: number, w: number): boolean;
	public equalTo(x: number, yzw: vec3): boolean;
	public equalTo(x: number, yz: vec2, w: number): boolean;
	public equalTo(x: number, y: number, zw: vec2): boolean;
	public equalTo(x: number, y: number, z: number, w: number): boolean;
	public equalTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
		if(arg0 instanceof vec4) {
			return Math.abs(this._x-arg0.x)<Number.EPSILON&&
				   Math.abs(this._y-arg0.y)<Number.EPSILON&&
				   Math.abs(this._z-arg0.z)<Number.EPSILON&&
				   Math.abs(this._w-arg0.w)<Number.EPSILON;
		} else if(arg0 instanceof vec3) {
			return Math.abs(this._x-arg0.x)<Number.EPSILON&&
				   Math.abs(this._y-arg0.y)<Number.EPSILON&&
				   Math.abs(this._z-arg0.z)<Number.EPSILON&&
				   Math.abs(this._w-<number>arg1)<Number.EPSILON;
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return Math.abs(this._x-arg0.x)<Number.EPSILON&&
					   Math.abs(this._y-arg0.y)<Number.EPSILON&&
					   Math.abs(this._z-arg1.x)<Number.EPSILON&&
					   Math.abs(this._w-arg1.y)<Number.EPSILON;
			} else {
				return Math.abs(this._x-arg0.x)<Number.EPSILON&&
					   Math.abs(this._y-arg0.y)<Number.EPSILON&&
					   Math.abs(this._z-<number>arg1)<Number.EPSILON&&
					   Math.abs(this._w-<number>arg2)<Number.EPSILON;
			}
		} else {
			if(arg1 instanceof vec3) {
				return Math.abs(this._x-arg0)<Number.EPSILON&&
					   Math.abs(this._y-arg1.x)<Number.EPSILON&&
					   Math.abs(this._z-arg1.y)<Number.EPSILON&&
					   Math.abs(this._w-arg1.z)<Number.EPSILON;
			} else if(arg1 instanceof vec2) {
				return Math.abs(this._x-arg0)<Number.EPSILON&&
					   Math.abs(this._y-arg1.x)<Number.EPSILON&&
					   Math.abs(this._z-arg1.y)<Number.EPSILON&&
					   Math.abs(this._w-<number>arg2)<Number.EPSILON;
			} else {
				if(arg2 instanceof vec2) {
					return Math.abs(this._x-arg0)<Number.EPSILON&&
						   Math.abs(this._y-arg1)<Number.EPSILON&&
						   Math.abs(this._z-arg2.x)<Number.EPSILON&&
						   Math.abs(this._w-arg2.y)<Number.EPSILON;
				} else {
					return Math.abs(this._x-arg0)<Number.EPSILON&&
						   Math.abs(this._y-arg1)<Number.EPSILON&&
						   Math.abs(this._z-arg2)<Number.EPSILON&&
						   Math.abs(this._w-arg3)<Number.EPSILON;
				}
			}
		}
	}

	public greaterThanOrEqualTo(v: vec4): boolean;
	public greaterThanOrEqualTo(xyz: vec3, w: number): boolean;
	public greaterThanOrEqualTo(xy: vec2, zw: vec2): boolean;
	public greaterThanOrEqualTo(xy: vec2, z: number, w: number): boolean;
	public greaterThanOrEqualTo(x: number, yzw: vec3): boolean;
	public greaterThanOrEqualTo(x: number, yz: vec2, w: number): boolean;
	public greaterThanOrEqualTo(x: number, y: number, zw: vec2): boolean;
	public greaterThanOrEqualTo(x: number, y: number, z: number, w: number): boolean;
	public greaterThanOrEqualTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
		if(arg0 instanceof vec4) {
			return this.greaterThan(arg0)||this.equalTo(arg0);
		} else if(arg0 instanceof vec3) {
			return this.greaterThan(arg0, <number>arg1)||this.equalTo(arg0, <number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return this.greaterThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else {
				return this.greaterThan(arg0, <number>arg1, <number>arg2)||this.equalTo(arg0, <number>arg1, <number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return this.greaterThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else if(arg1 instanceof vec2) {
				return this.greaterThan(arg0, arg1, <number>arg2)||this.equalTo(arg0, arg1, <number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return this.greaterThan(arg0, arg1, arg2)||this.equalTo(arg0, arg1, arg2);
				} else {
					return this.lessThan(arg0, arg1, arg2, arg3)||this.equalTo(arg0, arg1, arg2, arg3);
				}
			}
		}
	}

	public lessThanOrEqualTo(v: vec4): boolean;
	public lessThanOrEqualTo(xyz: vec3, w: number): boolean;
	public lessThanOrEqualTo(xy: vec2, zw: vec2): boolean;
	public lessThanOrEqualTo(xy: vec2, z: number, w: number): boolean;
	public lessThanOrEqualTo(x: number, yzw: vec3): boolean;
	public lessThanOrEqualTo(x: number, yz: vec2, w: number): boolean;
	public lessThanOrEqualTo(x: number, y: number, zw: vec2): boolean;
	public lessThanOrEqualTo(x: number, y: number, z: number, w: number): boolean;
	public lessThanOrEqualTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
		if(arg0 instanceof vec4) {
			return this.lessThan(arg0)||this.equalTo(arg0);
		} else if(arg0 instanceof vec3) {
			return this.lessThan(arg0, <number>arg1)||this.equalTo(arg0, <number>arg1);
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return this.lessThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else {
				return this.lessThan(arg0, <number>arg1, <number>arg2)||this.equalTo(arg0, <number>arg1, <number>arg2);
			}
		} else {
			if(arg1 instanceof vec3) {
				return this.lessThan(arg0, arg1)||this.equalTo(arg0, arg1);
			} else if(arg1 instanceof vec2) {
				return this.lessThan(arg0, arg1, <number>arg2)||this.equalTo(arg0, arg1, <number>arg2);
			} else {
				if(arg2 instanceof vec2) {
					return this.lessThan(arg0, arg1, arg2)||this.equalTo(arg0, arg1, arg2);
				} else {
					return this.lessThan(arg0, arg1, arg2, arg3)||this.equalTo(arg0, arg1, arg2, arg3);
				}
			}
		}
	}

	public maxElement(): number {
		return Math.max(this._x, this._y, this._z, this._w);
	}

	public minElement(): number {
		return Math.min(this._x, this._y, this._z, this._w);
	}

	public maxElements(v: vec4): vec4;
	public maxElements(xyz: vec3, w: number): vec4;
	public maxElements(xy: vec2, zw: vec2): vec4;
	public maxElements(xy: vec2, z: number, w: number): vec4;
	public maxElements(x: number, yzw: vec3): vec4;
	public maxElements(x: number, yz: vec2, w: number): vec4;
	public maxElements(x: number, y: number, zw: vec2): vec4;
	public maxElements(x: number, y: number, z: number, w: number): vec4;
	public maxElements(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			return new vec4(Math.max(this._x, arg0.x),
							Math.max(this._y, arg0.y),
							Math.max(this._z, arg0.z),
							Math.max(this._w, arg0.w));
		} else if(arg0 instanceof vec3) {
			return new vec4(Math.max(this._x, arg0.x),
							Math.max(this._y, arg0.y),
							Math.max(this._z, arg0.z),
							Math.max(this._w, <number>arg1));
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(Math.max(this._x, arg0.x),
								Math.max(this._y, arg0.y),
								Math.max(this._z, arg1.x),
								Math.max(this._w, arg1.y));
			} else {
				return new vec4(Math.max(this._x, arg0.x),
								Math.max(this._y, arg0.y),
								Math.max(this._z, <number>arg1),
								Math.max(this._w, <number>arg2));
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(Math.max(this._x, arg0),
								Math.max(this._y, arg1.x),
								Math.max(this._z, arg1.y),
								Math.max(this._w, arg1.z));
			} else if(arg1 instanceof vec2) {
				return new vec4(Math.max(this._x, arg0),
								Math.max(this._y, arg1.x),
								Math.max(this._z, arg1.y),
								Math.max(this._w, <number>arg2));
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(Math.max(this._x, arg0),
									Math.max(this._y, arg1),
									Math.max(this._z, arg2.x),
									Math.max(this._w, arg2.y));
				} else {
					return new vec4(Math.max(this._x, arg0),
									Math.max(this._y, arg1),
									Math.max(this._z, arg2),
									Math.max(this._w, arg3));
				}
			}
		}
	}

	public minElements(v: vec4): vec4;
	public minElements(xyz: vec3, w: number): vec4;
	public minElements(xy: vec2, zw: vec2): vec4;
	public minElements(xy: vec2, z: number, w: number): vec4;
	public minElements(x: number, yzw: vec3): vec4;
	public minElements(x: number, yz: vec2, w: number): vec4;
	public minElements(x: number, y: number, zw: vec2): vec4;
	public minElements(x: number, y: number, z: number, w: number): vec4;
	public minElements(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
		if(arg0 instanceof vec4) {
			return new vec4(Math.min(this._x, arg0.x),
							Math.min(this._y, arg0.y),
							Math.min(this._z, arg0.z),
							Math.min(this._w, arg0.w));
		} else if(arg0 instanceof vec3) {
			return new vec4(Math.min(this._x, arg0.x),
							Math.min(this._y, arg0.y),
							Math.min(this._z, arg0.z),
							Math.min(this._w, <number>arg1));
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(Math.min(this._x, arg0.x),
								Math.min(this._y, arg0.y),
								Math.min(this._z, arg1.x),
								Math.min(this._w, arg1.y));
			} else {
				return new vec4(Math.min(this._x, arg0.x),
								Math.min(this._y, arg0.y),
								Math.min(this._z, <number>arg1),
								Math.min(this._w, <number>arg2));
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(Math.min(this._x, arg0),
								Math.min(this._y, arg1.x),
								Math.min(this._z, arg1.y),
								Math.min(this._w, arg1.z));
			} else if(arg1 instanceof vec2) {
				return new vec4(Math.min(this._x, arg0),
								Math.min(this._y, arg1.x),
								Math.min(this._z, arg1.y),
								Math.min(this._w, <number>arg2));
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(Math.min(this._x, arg0),
									Math.min(this._y, arg1),
									Math.min(this._z, arg2.x),
									Math.min(this._w, arg2.y));
				} else {
					return new vec4(Math.min(this._x, arg0),
									Math.min(this._y, arg1),
									Math.min(this._z, arg2),
									Math.min(this._w, arg3));
				}
			}
		}
	}

	public clone(): vec4 { return new vec4().assign(this); }

	public get xx(): vec2 { return new vec2(this._x, this._x); }
	public get xy(): vec2 { return new vec2(this._x, this._y); }
	public get xz(): vec2 { return new vec2(this._x, this._z); }
	public get xw(): vec2 { return new vec2(this._x, this._w); }
	public get yx(): vec2 { return new vec2(this._y, this._x); }
	public get yy(): vec2 { return new vec2(this._y, this._y); }
	public get yz(): vec2 { return new vec2(this._y, this._z); }
	public get yw(): vec2 { return new vec2(this._y, this._w); }
	public get zx(): vec2 { return new vec2(this._z, this._x); }
	public get zy(): vec2 { return new vec2(this._z, this._y); }
	public get zz(): vec2 { return new vec2(this._z, this._z); }
	public get zw(): vec2 { return new vec2(this._z, this._w); }
	public get wx(): vec2 { return new vec2(this._w, this._x); }
	public get wy(): vec2 { return new vec2(this._w, this._y); }
	public get wz(): vec2 { return new vec2(this._w, this._z); }
	public get ww(): vec2 { return new vec2(this._w, this._w); }
	
	public get xxx(): vec3 { return new vec3(this._x, this._x, this._x); }
	public get xxy(): vec3 { return new vec3(this._x, this._x, this._y); }
	public get xxz(): vec3 { return new vec3(this._x, this._x, this._z); }
	public get xxw(): vec3 { return new vec3(this._x, this._x, this._w); }
	public get xyx(): vec3 { return new vec3(this._x, this._y, this._x); }
	public get xyy(): vec3 { return new vec3(this._x, this._y, this._y); }
	public get xyz(): vec3 { return new vec3(this._x, this._y, this._z); }
	public get xyw(): vec3 { return new vec3(this._x, this._y, this._w); }
	public get xzx(): vec3 { return new vec3(this._x, this._z, this._x); }
	public get xzy(): vec3 { return new vec3(this._x, this._z, this._y); }
	public get xzz(): vec3 { return new vec3(this._x, this._z, this._z); }
	public get xzw(): vec3 { return new vec3(this._x, this._z, this._w); }
	public get xwx(): vec3 { return new vec3(this._x, this._w, this._x); }
	public get xwy(): vec3 { return new vec3(this._x, this._w, this._y); }
	public get xwz(): vec3 { return new vec3(this._x, this._w, this._z); }
	public get xww(): vec3 { return new vec3(this._x, this._w, this._w); }
	public get yxx(): vec3 { return new vec3(this._y, this._x, this._x); }
	public get yxy(): vec3 { return new vec3(this._y, this._x, this._y); }
	public get yxz(): vec3 { return new vec3(this._y, this._x, this._z); }
	public get yxw(): vec3 { return new vec3(this._y, this._x, this._w); }
	public get yyx(): vec3 { return new vec3(this._y, this._y, this._x); }
	public get yyy(): vec3 { return new vec3(this._y, this._y, this._y); }
	public get yyz(): vec3 { return new vec3(this._y, this._y, this._z); }
	public get yyw(): vec3 { return new vec3(this._y, this._y, this._w); }
	public get yzx(): vec3 { return new vec3(this._y, this._z, this._x); }
	public get yzy(): vec3 { return new vec3(this._y, this._z, this._y); }
	public get yzz(): vec3 { return new vec3(this._y, this._z, this._z); }
	public get yzw(): vec3 { return new vec3(this._y, this._z, this._w); }
	public get ywx(): vec3 { return new vec3(this._y, this._w, this._x); }
	public get ywy(): vec3 { return new vec3(this._y, this._w, this._y); }
	public get ywz(): vec3 { return new vec3(this._y, this._w, this._z); }
	public get yww(): vec3 { return new vec3(this._y, this._w, this._w); }
	public get zxx(): vec3 { return new vec3(this._z, this._x, this._x); }
	public get zxy(): vec3 { return new vec3(this._z, this._x, this._y); }
	public get zxz(): vec3 { return new vec3(this._z, this._x, this._z); }
	public get zxw(): vec3 { return new vec3(this._z, this._x, this._w); }
	public get zyx(): vec3 { return new vec3(this._z, this._y, this._x); }
	public get zyy(): vec3 { return new vec3(this._z, this._y, this._y); }
	public get zyz(): vec3 { return new vec3(this._z, this._y, this._z); }
	public get zyw(): vec3 { return new vec3(this._z, this._y, this._w); }
	public get zzx(): vec3 { return new vec3(this._z, this._z, this._x); }
	public get zzy(): vec3 { return new vec3(this._z, this._z, this._y); }
	public get zzz(): vec3 { return new vec3(this._z, this._z, this._z); }
	public get zzw(): vec3 { return new vec3(this._z, this._z, this._w); }
	public get zwx(): vec3 { return new vec3(this._z, this._w, this._x); }
	public get zwy(): vec3 { return new vec3(this._z, this._w, this._y); }
	public get zwz(): vec3 { return new vec3(this._z, this._w, this._z); }
	public get zww(): vec3 { return new vec3(this._z, this._w, this._w); }
	public get wxx(): vec3 { return new vec3(this._w, this._x, this._x); }
	public get wxy(): vec3 { return new vec3(this._w, this._x, this._y); }
	public get wxz(): vec3 { return new vec3(this._w, this._x, this._z); }
	public get wxw(): vec3 { return new vec3(this._w, this._x, this._w); }
	public get wyx(): vec3 { return new vec3(this._w, this._y, this._x); }
	public get wyy(): vec3 { return new vec3(this._w, this._y, this._y); }
	public get wyz(): vec3 { return new vec3(this._w, this._y, this._z); }
	public get wyw(): vec3 { return new vec3(this._w, this._y, this._w); }
	public get wzx(): vec3 { return new vec3(this._w, this._z, this._x); }
	public get wzy(): vec3 { return new vec3(this._w, this._z, this._y); }
	public get wzz(): vec3 { return new vec3(this._w, this._z, this._z); }
	public get wzw(): vec3 { return new vec3(this._w, this._z, this._w); }
	public get wwx(): vec3 { return new vec3(this._w, this._w, this._x); }
	public get wwy(): vec3 { return new vec3(this._w, this._w, this._y); }
	public get wwz(): vec3 { return new vec3(this._w, this._w, this._z); }
	public get www(): vec3 { return new vec3(this._w, this._w, this._w); }

	public get xxxx(): vec4 { return new vec4(this._x, this._x, this._x, this._x); }
	public get xxxy(): vec4 { return new vec4(this._x, this._x, this._x, this._y); }
	public get xxxz(): vec4 { return new vec4(this._x, this._x, this._x, this._z); }
	public get xxxw(): vec4 { return new vec4(this._x, this._x, this._x, this._w); }
	public get xxyx(): vec4 { return new vec4(this._x, this._x, this._y, this._x); }
	public get xxyy(): vec4 { return new vec4(this._x, this._x, this._y, this._y); }
	public get xxyz(): vec4 { return new vec4(this._x, this._x, this._y, this._z); }
	public get xxyw(): vec4 { return new vec4(this._x, this._x, this._y, this._w); }
	public get xxzx(): vec4 { return new vec4(this._x, this._x, this._z, this._x); }
	public get xxzy(): vec4 { return new vec4(this._x, this._x, this._z, this._y); }
	public get xxzz(): vec4 { return new vec4(this._x, this._x, this._z, this._z); }
	public get xxzw(): vec4 { return new vec4(this._x, this._x, this._z, this._w); }
	public get xxwx(): vec4 { return new vec4(this._x, this._x, this._w, this._x); }
	public get xxwy(): vec4 { return new vec4(this._x, this._x, this._w, this._y); }
	public get xxwz(): vec4 { return new vec4(this._x, this._x, this._w, this._z); }
	public get xxww(): vec4 { return new vec4(this._x, this._x, this._w, this._w); }
	public get xyxx(): vec4 { return new vec4(this._x, this._y, this._x, this._x); }
	public get xyxy(): vec4 { return new vec4(this._x, this._y, this._x, this._y); }
	public get xyxz(): vec4 { return new vec4(this._x, this._y, this._x, this._z); }
	public get xyxw(): vec4 { return new vec4(this._x, this._y, this._x, this._w); }
	public get xyyx(): vec4 { return new vec4(this._x, this._y, this._y, this._x); }
	public get xyyy(): vec4 { return new vec4(this._x, this._y, this._y, this._y); }
	public get xyyz(): vec4 { return new vec4(this._x, this._y, this._y, this._z); }
	public get xyyw(): vec4 { return new vec4(this._x, this._y, this._y, this._w); }
	public get xyzx(): vec4 { return new vec4(this._x, this._y, this._z, this._x); }
	public get xyzy(): vec4 { return new vec4(this._x, this._y, this._z, this._y); }
	public get xyzz(): vec4 { return new vec4(this._x, this._y, this._z, this._z); }
	public get xyzw(): vec4 { return new vec4(this._x, this._y, this._z, this._w); }
	public get xywx(): vec4 { return new vec4(this._x, this._y, this._w, this._x); }
	public get xywy(): vec4 { return new vec4(this._x, this._y, this._w, this._y); }
	public get xywz(): vec4 { return new vec4(this._x, this._y, this._w, this._z); }
	public get xyww(): vec4 { return new vec4(this._x, this._y, this._w, this._w); }
	public get xzxx(): vec4 { return new vec4(this._x, this._z, this._x, this._x); }
	public get xzxy(): vec4 { return new vec4(this._x, this._z, this._x, this._y); }
	public get xzxz(): vec4 { return new vec4(this._x, this._z, this._x, this._z); }
	public get xzxw(): vec4 { return new vec4(this._x, this._z, this._x, this._w); }
	public get xzyx(): vec4 { return new vec4(this._x, this._z, this._y, this._x); }
	public get xzyy(): vec4 { return new vec4(this._x, this._z, this._y, this._y); }
	public get xzyz(): vec4 { return new vec4(this._x, this._z, this._y, this._z); }
	public get xzyw(): vec4 { return new vec4(this._x, this._z, this._y, this._w); }
	public get xzzx(): vec4 { return new vec4(this._x, this._z, this._z, this._x); }
	public get xzzy(): vec4 { return new vec4(this._x, this._z, this._z, this._y); }
	public get xzzz(): vec4 { return new vec4(this._x, this._z, this._z, this._z); }
	public get xzzw(): vec4 { return new vec4(this._x, this._z, this._z, this._w); }
	public get xzwx(): vec4 { return new vec4(this._x, this._z, this._w, this._x); }
	public get xzwy(): vec4 { return new vec4(this._x, this._z, this._w, this._y); }
	public get xzwz(): vec4 { return new vec4(this._x, this._z, this._w, this._z); }
	public get xzww(): vec4 { return new vec4(this._x, this._z, this._w, this._w); }
	public get xwxx(): vec4 { return new vec4(this._x, this._w, this._x, this._x); }
	public get xwxy(): vec4 { return new vec4(this._x, this._w, this._x, this._y); }
	public get xwxz(): vec4 { return new vec4(this._x, this._w, this._x, this._z); }
	public get xwxw(): vec4 { return new vec4(this._x, this._w, this._x, this._w); }
	public get xwyx(): vec4 { return new vec4(this._x, this._w, this._y, this._x); }
	public get xwyy(): vec4 { return new vec4(this._x, this._w, this._y, this._y); }
	public get xwyz(): vec4 { return new vec4(this._x, this._w, this._y, this._z); }
	public get xwyw(): vec4 { return new vec4(this._x, this._w, this._y, this._w); }
	public get xwzx(): vec4 { return new vec4(this._x, this._w, this._z, this._x); }
	public get xwzy(): vec4 { return new vec4(this._x, this._w, this._z, this._y); }
	public get xwzz(): vec4 { return new vec4(this._x, this._w, this._z, this._z); }
	public get xwzw(): vec4 { return new vec4(this._x, this._w, this._z, this._w); }
	public get xwwx(): vec4 { return new vec4(this._x, this._w, this._w, this._x); }
	public get xwwy(): vec4 { return new vec4(this._x, this._w, this._w, this._y); }
	public get xwwz(): vec4 { return new vec4(this._x, this._w, this._w, this._z); }
	public get xwww(): vec4 { return new vec4(this._x, this._w, this._w, this._w); }

	public get yxxx(): vec4 { return new vec4(this._y, this._x, this._x, this._x); }
	public get yxxy(): vec4 { return new vec4(this._y, this._x, this._x, this._y); }
	public get yxxz(): vec4 { return new vec4(this._y, this._x, this._x, this._z); }
	public get yxxw(): vec4 { return new vec4(this._y, this._x, this._x, this._w); }
	public get yxyx(): vec4 { return new vec4(this._y, this._x, this._y, this._x); }
	public get yxyy(): vec4 { return new vec4(this._y, this._x, this._y, this._y); }
	public get yxyz(): vec4 { return new vec4(this._y, this._x, this._y, this._z); }
	public get yxyw(): vec4 { return new vec4(this._y, this._x, this._y, this._w); }
	public get yxzx(): vec4 { return new vec4(this._y, this._x, this._z, this._x); }
	public get yxzy(): vec4 { return new vec4(this._y, this._x, this._z, this._y); }
	public get yxzz(): vec4 { return new vec4(this._y, this._x, this._z, this._z); }
	public get yxzw(): vec4 { return new vec4(this._y, this._x, this._z, this._w); }
	public get yxwx(): vec4 { return new vec4(this._y, this._x, this._w, this._x); }
	public get yxwy(): vec4 { return new vec4(this._y, this._x, this._w, this._y); }
	public get yxwz(): vec4 { return new vec4(this._y, this._x, this._w, this._z); }
	public get yxww(): vec4 { return new vec4(this._y, this._x, this._w, this._w); }
	public get yyxx(): vec4 { return new vec4(this._y, this._y, this._x, this._x); }
	public get yyxy(): vec4 { return new vec4(this._y, this._y, this._x, this._y); }
	public get yyxz(): vec4 { return new vec4(this._y, this._y, this._x, this._z); }
	public get yyxw(): vec4 { return new vec4(this._y, this._y, this._x, this._w); }
	public get yyyx(): vec4 { return new vec4(this._y, this._y, this._y, this._x); }
	public get yyyy(): vec4 { return new vec4(this._y, this._y, this._y, this._y); }
	public get yyyz(): vec4 { return new vec4(this._y, this._y, this._y, this._z); }
	public get yyyw(): vec4 { return new vec4(this._y, this._y, this._y, this._w); }
	public get yyzx(): vec4 { return new vec4(this._y, this._y, this._z, this._x); }
	public get yyzy(): vec4 { return new vec4(this._y, this._y, this._z, this._y); }
	public get yyzz(): vec4 { return new vec4(this._y, this._y, this._z, this._z); }
	public get yyzw(): vec4 { return new vec4(this._y, this._y, this._z, this._w); }
	public get yywx(): vec4 { return new vec4(this._y, this._y, this._w, this._x); }
	public get yywy(): vec4 { return new vec4(this._y, this._y, this._w, this._y); }
	public get yywz(): vec4 { return new vec4(this._y, this._y, this._w, this._z); }
	public get yyww(): vec4 { return new vec4(this._y, this._y, this._w, this._w); }
	public get yzxx(): vec4 { return new vec4(this._y, this._z, this._x, this._x); }
	public get yzxy(): vec4 { return new vec4(this._y, this._z, this._x, this._y); }
	public get yzxz(): vec4 { return new vec4(this._y, this._z, this._x, this._z); }
	public get yzxw(): vec4 { return new vec4(this._y, this._z, this._x, this._w); }
	public get yzyx(): vec4 { return new vec4(this._y, this._z, this._y, this._x); }
	public get yzyy(): vec4 { return new vec4(this._y, this._z, this._y, this._y); }
	public get yzyz(): vec4 { return new vec4(this._y, this._z, this._y, this._z); }
	public get yzyw(): vec4 { return new vec4(this._y, this._z, this._y, this._w); }
	public get yzzx(): vec4 { return new vec4(this._y, this._z, this._z, this._x); }
	public get yzzy(): vec4 { return new vec4(this._y, this._z, this._z, this._y); }
	public get yzzz(): vec4 { return new vec4(this._y, this._z, this._z, this._z); }
	public get yzzw(): vec4 { return new vec4(this._y, this._z, this._z, this._w); }
	public get yzwx(): vec4 { return new vec4(this._y, this._z, this._w, this._x); }
	public get yzwy(): vec4 { return new vec4(this._y, this._z, this._w, this._y); }
	public get yzwz(): vec4 { return new vec4(this._y, this._z, this._w, this._z); }
	public get yzww(): vec4 { return new vec4(this._y, this._z, this._w, this._w); }
	public get ywxx(): vec4 { return new vec4(this._y, this._w, this._x, this._x); }
	public get ywxy(): vec4 { return new vec4(this._y, this._w, this._x, this._y); }
	public get ywxz(): vec4 { return new vec4(this._y, this._w, this._x, this._z); }
	public get ywxw(): vec4 { return new vec4(this._y, this._w, this._x, this._w); }
	public get ywyx(): vec4 { return new vec4(this._y, this._w, this._y, this._x); }
	public get ywyy(): vec4 { return new vec4(this._y, this._w, this._y, this._y); }
	public get ywyz(): vec4 { return new vec4(this._y, this._w, this._y, this._z); }
	public get ywyw(): vec4 { return new vec4(this._y, this._w, this._y, this._w); }
	public get ywzx(): vec4 { return new vec4(this._y, this._w, this._z, this._x); }
	public get ywzy(): vec4 { return new vec4(this._y, this._w, this._z, this._y); }
	public get ywzz(): vec4 { return new vec4(this._y, this._w, this._z, this._z); }
	public get ywzw(): vec4 { return new vec4(this._y, this._w, this._z, this._w); }
	public get ywwx(): vec4 { return new vec4(this._y, this._w, this._w, this._x); }
	public get ywwy(): vec4 { return new vec4(this._y, this._w, this._w, this._y); }
	public get ywwz(): vec4 { return new vec4(this._y, this._w, this._w, this._z); }
	public get ywww(): vec4 { return new vec4(this._y, this._w, this._w, this._w); }

	public get zxxx(): vec4 { return new vec4(this._z, this._x, this._x, this._x); }
	public get zxxy(): vec4 { return new vec4(this._z, this._x, this._x, this._y); }
	public get zxxz(): vec4 { return new vec4(this._z, this._x, this._x, this._z); }
	public get zxxw(): vec4 { return new vec4(this._z, this._x, this._x, this._w); }
	public get zxyx(): vec4 { return new vec4(this._z, this._x, this._y, this._x); }
	public get zxyy(): vec4 { return new vec4(this._z, this._x, this._y, this._y); }
	public get zxyz(): vec4 { return new vec4(this._z, this._x, this._y, this._z); }
	public get zxyw(): vec4 { return new vec4(this._z, this._x, this._y, this._w); }
	public get zxzx(): vec4 { return new vec4(this._z, this._x, this._z, this._x); }
	public get zxzy(): vec4 { return new vec4(this._z, this._x, this._z, this._y); }
	public get zxzz(): vec4 { return new vec4(this._z, this._x, this._z, this._z); }
	public get zxzw(): vec4 { return new vec4(this._z, this._x, this._z, this._w); }
	public get zxwx(): vec4 { return new vec4(this._z, this._x, this._w, this._x); }
	public get zxwy(): vec4 { return new vec4(this._z, this._x, this._w, this._y); }
	public get zxwz(): vec4 { return new vec4(this._z, this._x, this._w, this._z); }
	public get zxww(): vec4 { return new vec4(this._z, this._x, this._w, this._w); }
	public get zyxx(): vec4 { return new vec4(this._z, this._y, this._x, this._x); }
	public get zyxy(): vec4 { return new vec4(this._z, this._y, this._x, this._y); }
	public get zyxz(): vec4 { return new vec4(this._z, this._y, this._x, this._z); }
	public get zyxw(): vec4 { return new vec4(this._z, this._y, this._x, this._w); }
	public get zyyx(): vec4 { return new vec4(this._z, this._y, this._y, this._x); }
	public get zyyy(): vec4 { return new vec4(this._z, this._y, this._y, this._y); }
	public get zyyz(): vec4 { return new vec4(this._z, this._y, this._y, this._z); }
	public get zyyw(): vec4 { return new vec4(this._z, this._y, this._y, this._w); }
	public get zyzx(): vec4 { return new vec4(this._z, this._y, this._z, this._x); }
	public get zyzy(): vec4 { return new vec4(this._z, this._y, this._z, this._y); }
	public get zyzz(): vec4 { return new vec4(this._z, this._y, this._z, this._z); }
	public get zyzw(): vec4 { return new vec4(this._z, this._y, this._z, this._w); }
	public get zywx(): vec4 { return new vec4(this._z, this._y, this._w, this._x); }
	public get zywy(): vec4 { return new vec4(this._z, this._y, this._w, this._y); }
	public get zywz(): vec4 { return new vec4(this._z, this._y, this._w, this._z); }
	public get zyww(): vec4 { return new vec4(this._z, this._y, this._w, this._w); }
	public get zzxx(): vec4 { return new vec4(this._z, this._z, this._x, this._x); }
	public get zzxy(): vec4 { return new vec4(this._z, this._z, this._x, this._y); }
	public get zzxz(): vec4 { return new vec4(this._z, this._z, this._x, this._z); }
	public get zzxw(): vec4 { return new vec4(this._z, this._z, this._x, this._w); }
	public get zzyx(): vec4 { return new vec4(this._z, this._z, this._y, this._x); }
	public get zzyy(): vec4 { return new vec4(this._z, this._z, this._y, this._y); }
	public get zzyz(): vec4 { return new vec4(this._z, this._z, this._y, this._z); }
	public get zzyw(): vec4 { return new vec4(this._z, this._z, this._y, this._w); }
	public get zzzx(): vec4 { return new vec4(this._z, this._z, this._z, this._x); }
	public get zzzy(): vec4 { return new vec4(this._z, this._z, this._z, this._y); }
	public get zzzz(): vec4 { return new vec4(this._z, this._z, this._z, this._z); }
	public get zzzw(): vec4 { return new vec4(this._z, this._z, this._z, this._w); }
	public get zzwx(): vec4 { return new vec4(this._z, this._z, this._w, this._x); }
	public get zzwy(): vec4 { return new vec4(this._z, this._z, this._w, this._y); }
	public get zzwz(): vec4 { return new vec4(this._z, this._z, this._w, this._z); }
	public get zzww(): vec4 { return new vec4(this._z, this._z, this._w, this._w); }
	public get zwxx(): vec4 { return new vec4(this._z, this._w, this._x, this._x); }
	public get zwxy(): vec4 { return new vec4(this._z, this._w, this._x, this._y); }
	public get zwxz(): vec4 { return new vec4(this._z, this._w, this._x, this._z); }
	public get zwxw(): vec4 { return new vec4(this._z, this._w, this._x, this._w); }
	public get zwyx(): vec4 { return new vec4(this._z, this._w, this._y, this._x); }
	public get zwyy(): vec4 { return new vec4(this._z, this._w, this._y, this._y); }
	public get zwyz(): vec4 { return new vec4(this._z, this._w, this._y, this._z); }
	public get zwyw(): vec4 { return new vec4(this._z, this._w, this._y, this._w); }
	public get zwzx(): vec4 { return new vec4(this._z, this._w, this._z, this._x); }
	public get zwzy(): vec4 { return new vec4(this._z, this._w, this._z, this._y); }
	public get zwzz(): vec4 { return new vec4(this._z, this._w, this._z, this._z); }
	public get zwzw(): vec4 { return new vec4(this._z, this._w, this._z, this._w); }
	public get zwwx(): vec4 { return new vec4(this._z, this._w, this._w, this._x); }
	public get zwwy(): vec4 { return new vec4(this._z, this._w, this._w, this._y); }
	public get zwwz(): vec4 { return new vec4(this._z, this._w, this._w, this._z); }
	public get zwww(): vec4 { return new vec4(this._z, this._w, this._w, this._w); }

	public get wxxx(): vec4 { return new vec4(this._w, this._x, this._x, this._x); }
	public get wxxy(): vec4 { return new vec4(this._w, this._x, this._x, this._y); }
	public get wxxz(): vec4 { return new vec4(this._w, this._x, this._x, this._z); }
	public get wxxw(): vec4 { return new vec4(this._w, this._x, this._x, this._w); }
	public get wxyx(): vec4 { return new vec4(this._w, this._x, this._y, this._x); }
	public get wxyy(): vec4 { return new vec4(this._w, this._x, this._y, this._y); }
	public get wxyz(): vec4 { return new vec4(this._w, this._x, this._y, this._z); }
	public get wxyw(): vec4 { return new vec4(this._w, this._x, this._y, this._w); }
	public get wxzx(): vec4 { return new vec4(this._w, this._x, this._z, this._x); }
	public get wxzy(): vec4 { return new vec4(this._w, this._x, this._z, this._y); }
	public get wxzz(): vec4 { return new vec4(this._w, this._x, this._z, this._z); }
	public get wxzw(): vec4 { return new vec4(this._w, this._x, this._z, this._w); }
	public get wxwx(): vec4 { return new vec4(this._w, this._x, this._w, this._x); }
	public get wxwy(): vec4 { return new vec4(this._w, this._x, this._w, this._y); }
	public get wxwz(): vec4 { return new vec4(this._w, this._x, this._w, this._z); }
	public get wxww(): vec4 { return new vec4(this._w, this._x, this._w, this._w); }
	public get wyxx(): vec4 { return new vec4(this._w, this._y, this._x, this._x); }
	public get wyxy(): vec4 { return new vec4(this._w, this._y, this._x, this._y); }
	public get wyxz(): vec4 { return new vec4(this._w, this._y, this._x, this._z); }
	public get wyxw(): vec4 { return new vec4(this._w, this._y, this._x, this._w); }
	public get wyyx(): vec4 { return new vec4(this._w, this._y, this._y, this._x); }
	public get wyyy(): vec4 { return new vec4(this._w, this._y, this._y, this._y); }
	public get wyyz(): vec4 { return new vec4(this._w, this._y, this._y, this._z); }
	public get wyyw(): vec4 { return new vec4(this._w, this._y, this._y, this._w); }
	public get wyzx(): vec4 { return new vec4(this._w, this._y, this._z, this._x); }
	public get wyzy(): vec4 { return new vec4(this._w, this._y, this._z, this._y); }
	public get wyzz(): vec4 { return new vec4(this._w, this._y, this._z, this._z); }
	public get wyzw(): vec4 { return new vec4(this._w, this._y, this._z, this._w); }
	public get wywx(): vec4 { return new vec4(this._w, this._y, this._w, this._x); }
	public get wywy(): vec4 { return new vec4(this._w, this._y, this._w, this._y); }
	public get wywz(): vec4 { return new vec4(this._w, this._y, this._w, this._z); }
	public get wyww(): vec4 { return new vec4(this._w, this._y, this._w, this._w); }
	public get wzxx(): vec4 { return new vec4(this._w, this._z, this._x, this._x); }
	public get wzxy(): vec4 { return new vec4(this._w, this._z, this._x, this._y); }
	public get wzxz(): vec4 { return new vec4(this._w, this._z, this._x, this._z); }
	public get wzxw(): vec4 { return new vec4(this._w, this._z, this._x, this._w); }
	public get wzyx(): vec4 { return new vec4(this._w, this._z, this._y, this._x); }
	public get wzyy(): vec4 { return new vec4(this._w, this._z, this._y, this._y); }
	public get wzyz(): vec4 { return new vec4(this._w, this._z, this._y, this._z); }
	public get wzyw(): vec4 { return new vec4(this._w, this._z, this._y, this._w); }
	public get wzzx(): vec4 { return new vec4(this._w, this._z, this._z, this._x); }
	public get wzzy(): vec4 { return new vec4(this._w, this._z, this._z, this._y); }
	public get wzzz(): vec4 { return new vec4(this._w, this._z, this._z, this._z); }
	public get wzzw(): vec4 { return new vec4(this._w, this._z, this._z, this._w); }
	public get wzwx(): vec4 { return new vec4(this._w, this._z, this._w, this._x); }
	public get wzwy(): vec4 { return new vec4(this._w, this._z, this._w, this._y); }
	public get wzwz(): vec4 { return new vec4(this._w, this._z, this._w, this._z); }
	public get wzww(): vec4 { return new vec4(this._w, this._z, this._w, this._w); }
	public get wwxx(): vec4 { return new vec4(this._w, this._w, this._x, this._x); }
	public get wwxy(): vec4 { return new vec4(this._w, this._w, this._x, this._y); }
	public get wwxz(): vec4 { return new vec4(this._w, this._w, this._x, this._z); }
	public get wwxw(): vec4 { return new vec4(this._w, this._w, this._x, this._w); }
	public get wwyx(): vec4 { return new vec4(this._w, this._w, this._y, this._x); }
	public get wwyy(): vec4 { return new vec4(this._w, this._w, this._y, this._y); }
	public get wwyz(): vec4 { return new vec4(this._w, this._w, this._y, this._z); }
	public get wwyw(): vec4 { return new vec4(this._w, this._w, this._y, this._w); }
	public get wwzx(): vec4 { return new vec4(this._w, this._w, this._z, this._x); }
	public get wwzy(): vec4 { return new vec4(this._w, this._w, this._z, this._y); }
	public get wwzz(): vec4 { return new vec4(this._w, this._w, this._z, this._z); }
	public get wwzw(): vec4 { return new vec4(this._w, this._w, this._z, this._w); }
	public get wwwx(): vec4 { return new vec4(this._w, this._w, this._w, this._x); }
	public get wwwy(): vec4 { return new vec4(this._w, this._w, this._w, this._y); }
	public get wwwz(): vec4 { return new vec4(this._w, this._w, this._w, this._z); }
	public get wwww(): vec4 { return new vec4(this._w, this._w, this._w, this._w); }
}

abstract class mat {
	abstract transpose(): mat;
	abstract column(c: number): vec;
	abstract row(r: number): vec;
	abstract negate(): mat;
	abstract add(m: mat|number): mat;
	abstract sub(m: mat|number): mat;
	abstract mul(m: mat|number): mat;
	abstract mul(v: vec): vec;
	abstract determinant(): number;
	abstract inverse(): mat|null;
	abstract toArray(): number[];
	abstract clone(): mat;
}

interface iMatrixIndexSignature {
	[rowIndex: number]: number[];
}

class mat2 extends mat implements iMatrixIndexSignature {
	[rowIndex: number]: [number, number];
	public "0": [number, number];
	public "1": [number, number];
	constructor(_00: number=1, _01: number=0,
				_10: number=0, _11: number=1) {
		super();
		this[0]=[_00, _01];
		this[1]=[_10, _11];
	}

	identity(): mat2 {
		this[0][0]=this[1][1]=1;
		this[0][1]=this[1][0]=0;
		return this;
	}

	transpose(): mat2 {
		return new mat2(this[0][0], this[1][0],
						this[0][1], this[1][1]);
	}

	column(c: 0|1): vec2 {
		return new vec2(this[0][c], this[1][c]);
	}

	row(r: 0|1): vec2 {
		return new vec2(this[r][0], this[r][1]);
	}

	negate(): mat2 {
		return new mat2(-this[0][0], -this[0][1],
						-this[1][0], -this[0][0]);
	}

	add(m: mat2): mat2;
	add(n: number): mat2;
	add(arg0: mat2|number): mat2 {
		return (arg0 instanceof mat2) ?
			new mat2(this[0][0]+arg0[0][0], this[0][1]+arg0[0][1],
					 this[1][0]+arg0[1][0], this[1][1]+arg0[1][1]) :
			new mat2(this[0][0]+arg0, this[0][1]+arg0,
					 this[1][0]+arg0, this[1][1]+arg0);
	}

	sub(m: mat2): mat2;
	sub(n: number): mat2;
	sub(arg0: mat2|number): mat2 {
		return (arg0 instanceof mat2) ?
			new mat2(this[0][0]-arg0[0][0], this[0][1]-arg0[0][1],
				 	 this[1][0]-arg0[1][0], this[1][1]-arg0[1][1]) :
			new mat2(this[0][0]-arg0, this[0][1]-arg0,
				 	 this[1][0]-arg0, this[1][1]-arg0);
	}

	mul(m: mat2): mat2;
	mul(v: vec2): vec2;
	mul(x: number, y: number): vec2;
	mul(n: number): mat2;
	mul(arg0: vec2|mat2|number, arg1?: number): mat2|vec2 {
		return 	arg0 instanceof mat2 ? 	new mat2(this.row(0).dot(arg0.column(0)), this.row(0).dot(arg0.column(1)),
												 this.row(1).dot(arg0.column(0)), this.row(1).dot(arg0.column(1))) :
				arg0 instanceof vec2 ? 	new vec2(arg0.dot(this.row(0)), arg0.dot(this.row(1))) :
			   	isNumber(arg1) ?		new vec2(this.row(0).dot(arg0, arg1), this.row(1).dot(arg0, arg1)) :
										new mat2(this[0][0]*arg0, this[0][1]*arg0,
												 this[1][0]*arg0, this[1][1]*arg0);
	}

	determinant(): number {
		return this[0][0]*this[1][1]-this[0][1]*this[1][0];
	}

	inverse(): mat2|null {
		let det=this.determinant();
		if(det===0) {
			return null;
		}
		let s=1/det;
		return new mat2( this[1][1], -this[0][1],
						-this[1][0],  this[0][0]).mul(s);
	}

	toArray(): [number, number, number, number] {
		return [this[0][0], this[0][1], 
				this[1][0], this[1][1]];
	}

	clone(): mat2 { return new mat2(this[0][0], this[0][1], this[1][0], this[1][1]); }
}

class mat3 extends mat implements iMatrixIndexSignature {
	[rowIndex: number]: [number, number, number];
	public "0": [number, number, number];
	public "1": [number, number, number];
	public "2": [number, number, number];
	constructor(_00: number=1, _01: number=0, _02: number=0,
				_10: number=0, _11: number=1, _12: number=0,
				_20: number=0, _21: number=0, _22: number=1) {
		super();
		this[0]=[_00, _01, _02];
		this[1]=[_10, _11, _12];
		this[2]=[_20, _21, _22];
	}

	identity(): mat3 {
		this[0][0]=this[1][1]=this[2][2]=1;
		this[0][1]=this[0][2]=this[1][0]=0;
		this[1][2]=this[2][0]=this[2][1]=0;
		return this;
	}

	transpose(): mat3 {
		return new mat3(this[0][0], this[1][0], this[2][0],
						this[0][1], this[1][1], this[2][1],
						this[0][2], this[1][2], this[2][2]);
	}

	column(c: 0|1|2): vec3 {
		return new vec3(this[0][c], this[1][c], this[2][c]);
	}

	row(r: 0|1|2): vec3 {
		return new vec3(this[r][0], this[r][1], this[r][2]);
	}

	negate(): mat3 {
		return new mat3(-this[0][0], -this[0][1], -this[0][2],
						-this[1][0], -this[1][1], -this[1][2],
						-this[2][0], -this[2][1], -this[2][2]);
	}

	add(m: mat3): mat3;
	add(n: number): mat3;
	add(arg0: mat3|number): mat3 {
		return (arg0 instanceof mat3) ?
			new mat3(this[0][0]+arg0[0][0], this[0][1]+arg0[0][1], this[0][2]+arg0[0][2],
					 this[1][0]+arg0[1][0], this[1][1]+arg0[1][1], this[1][2]+arg0[1][2],
					 this[2][0]+arg0[2][0], this[2][1]+arg0[2][1], this[2][2]+arg0[2][2]) :
			new mat3(this[0][0]+arg0, this[0][1]+arg0, this[0][2]+arg0,
					 this[1][0]+arg0, this[1][1]+arg0, this[1][2]+arg0,
					 this[2][0]+arg0, this[2][1]+arg0, this[2][2]+arg0);
	}

	sub(m: mat3): mat3;
	sub(n: number): mat3;
	sub(arg0: mat3|number): mat3 {
		return (arg0 instanceof mat3) ?
		new mat3(this[0][0]-arg0[0][0], this[0][1]-arg0[0][1], this[0][2]-arg0[0][2],
				 this[1][0]-arg0[1][0], this[1][1]-arg0[1][1], this[1][2]-arg0[1][2],
				 this[2][0]-arg0[2][0], this[2][1]-arg0[2][1], this[2][2]-arg0[2][2]) :
		new mat3(this[0][0]-arg0, this[0][1]-arg0, this[0][2]-arg0,
				 this[1][0]-arg0, this[1][1]-arg0, this[1][2]-arg0,
				 this[2][0]-arg0, this[2][1]-arg0, this[2][2]-arg0);
	}

	mul(m: mat3): mat3;
	mul(v: vec3): vec3;
	mul(xy: vec2, z: number): vec3;
	mul(x: number, yz: vec2): vec3;
	mul(x: number, y: number, z: number): vec3;
	mul(n: number): mat3;
	mul(arg0: vec3|mat3|vec2|number, arg1?: vec2|number, arg2?: number): vec3|mat3 {
		if(arg0 instanceof mat3) {
			let r0=this.row(0), r1=this.row(1), r2=this.row(2);
			let c0=arg0.column(0), c1=arg0.column(1), c2=arg0.column(2);
			return new mat3(r0.dot(c0), r0.dot(c1), r0.dot(c2),
							r1.dot(c0), r1.dot(c1), r1.dot(c2),
							r2.dot(c0), r2.dot(c1), r2.dot(c2));
		} else if(arg0 instanceof vec3) {
			return new vec3(this.row(0).dot(arg0), 
							this.row(1).dot(arg0), 
							this.row(2).dot(arg0));
		} else if(arg0 instanceof vec2) {
			return new vec3(this.row(0).dot(arg0, <number>arg1), 
							this.row(1).dot(arg0, <number>arg1), 
							this.row(2).dot(arg0, <number>arg1));
		} else {
			if(arg1 instanceof vec2) {
				return new vec3(this.row(0).dot(arg0, arg1),
								this.row(1).dot(arg0, arg1),
								this.row(2).dot(arg0, arg1));
			} else if(isNumber(arg2)) {
				return new vec3(this.row(0).dot(arg0, arg1, arg2),
								this.row(1).dot(arg0, arg1, arg2),
								this.row(2).dot(arg0, arg1, arg2));
			} else {
				return new vec3(this.row(0).dot(arg0, arg0, arg0),
								this.row(1).dot(arg0, arg0, arg0),
								this.row(2).dot(arg0, arg0, arg0));
			}
		}
	}

	determinant(): number {
		return this[0][0]*(this[1][1]*this[2][2]-this[1][2]*this[2][1]) + 
			   this[0][1]*(this[1][2]*this[2][0]-this[1][0]*this[2][2]) + 
			   this[0][2]*(this[1][0]*this[2][1]-this[1][1]*this[2][0]);
	}

	inverse(): mat3|null {
		let det=this.determinant();
		if(det===0) {
			return null;
		}
		let s=1/det;
		return new mat3((this[1][1]*this[2][2]-this[2][1]*this[1][2])*s, (this[0][2]*this[2][1]-this[0][1]*this[2][2])*s, (this[0][1]*this[1][2]-this[0][2]*this[1][1])*s, 
						(this[1][2]*this[2][0]-this[1][0]*this[2][2])*s, (this[0][0]*this[2][2]-this[0][2]*this[2][0])*s, (this[1][0]*this[0][2]-this[0][0]*this[1][2])*s, 
						(this[1][0]*this[2][1]-this[2][0]*this[1][1])*s, (this[2][0]*this[0][1]-this[0][0]*this[2][1])*s, (this[0][0]*this[1][1]-this[1][0]*this[0][1])*s);
	}

	mat2(row: 0|1=0, col: 0|1=0): mat2 {
		return new mat2(this[row][col], this[row][col+1],
						this[row+1][col], this[row+1][col+1]);
	}

	toArray(): [number, number, number, 
				number, number, number, 
				number, number, number] {
		return [this[0][0], this[0][1], this[0][2],
				this[1][0], this[1][1], this[1][2],
				this[2][0], this[2][1], this[2][2]];
	}

	clone(): mat3 { return new mat3(this[0][0], this[0][1], this[0][2], this[1][0], this[1][1], this[1][2], this[2][0], this[2][1], this[2][2]); }
}

class mat4 extends mat implements iMatrixIndexSignature {
	[rowIndex: number]: [number, number, number, number];
	public "0": [number, number, number, number];
	public "1": [number, number, number, number];
	public "2": [number, number, number, number];
	public "3": [number, number, number, number];
	constructor(_00: number=1, _01: number=0, _02: number=0, _03: number=0,
				_10: number=0, _11: number=1, _12: number=0, _13: number=0,
				_20: number=0, _21: number=0, _22: number=1, _23: number=0,
				_30: number=0, _31: number=0, _32: number=0, _33: number=1) {
		super();
		this[0]=[_00, _01, _02, _03];
		this[1]=[_10, _11, _12, _13];
		this[2]=[_20, _21, _22, _23];
		this[3]=[_30, _31, _32, _33];
	}

	assign(m: mat4): mat4 {
		for(let c=0; c<4; c++) {
			for(let r=0; r<4; r++) {
				this[c][r]=m[c][r];
			}
		}
		
		return this;
	}

	identity(): mat4 {
		this[0][0]=this[1][1]=this[2][2]=this[3][3]=1;
		this[0][1]=this[0][2]=this[0][3]=this[1][0]=0;
		this[1][2]=this[1][3]=this[2][0]=this[2][1]=0;
		this[2][3]=this[3][0]=this[3][1]=this[3][2]=0;
		return this;
	}

	transpose(): mat4 {
		return new mat4(this[0][0], this[1][0], this[2][0], this[3][0],
						this[0][1], this[1][1], this[2][1], this[3][1],
						this[0][2], this[1][2], this[2][2], this[3][2],
						this[0][3], this[1][3], this[2][3], this[3][3]);
	}

	column(c: 0|1|2|3): vec4 {
		return new vec4(this[0][c], this[1][c], this[2][c], this[3][c]);
	}

	row(r: 0|1|2|3): vec4 {
		return new vec4(this[r][0], this[r][1], this[r][2], this[r][3]);
	}

	negate(): mat4 {
		return new mat4(-this[0][0], -this[0][1], -this[0][2], -this[0][3],
						-this[1][0], -this[1][1], -this[1][2], -this[1][3],
						-this[2][0], -this[2][1], -this[2][2], -this[2][3],
						-this[3][0], -this[3][1], -this[3][2], -this[3][3]);
	}

	add(m: mat4): mat4;
	add(n: number): mat4;
	add(arg0: mat4|number): mat4 {
		return (arg0 instanceof mat4) ?
			new mat4(this[0][0]+arg0[0][0], this[0][1]+arg0[0][1], this[0][2]+arg0[0][2], this[0][0]+arg0[0][3],
					 this[1][0]+arg0[1][0], this[1][1]+arg0[1][1], this[1][2]+arg0[1][2], this[1][0]+arg0[1][3],
					 this[2][0]+arg0[2][0], this[2][1]+arg0[2][1], this[2][2]+arg0[2][2], this[2][0]+arg0[2][3],
					 this[3][0]+arg0[3][0], this[3][1]+arg0[3][1], this[3][2]+arg0[3][2], this[3][0]+arg0[3][3]) :
			new mat4(this[0][0]+arg0, this[0][1]+arg0, this[0][2]+arg0, this[0][3]+arg0,
					 this[1][0]+arg0, this[1][1]+arg0, this[1][2]+arg0, this[1][3]+arg0,
					 this[2][0]+arg0, this[2][1]+arg0, this[2][2]+arg0, this[2][3]+arg0,
					 this[3][0]+arg0, this[3][1]+arg0, this[3][2]+arg0, this[3][3]+arg0);
	}

	sub(m: mat4): mat4;
	sub(n: number): mat4;
	sub(arg0: mat4|number): mat4 {
		return (arg0 instanceof mat4) ?
			new mat4(this[0][0]-arg0[0][0], this[0][1]-arg0[0][1], this[0][2]-arg0[0][2], this[0][0]-arg0[0][3],
					 this[1][0]-arg0[1][0], this[1][1]-arg0[1][1], this[1][2]-arg0[1][2], this[1][0]-arg0[1][3],
					 this[2][0]-arg0[2][0], this[2][1]-arg0[2][1], this[2][2]-arg0[2][2], this[2][0]-arg0[2][3],
					 this[3][0]-arg0[3][0], this[3][1]-arg0[3][1], this[3][2]-arg0[3][2], this[3][0]-arg0[3][3]) :
			new mat4(this[0][0]-arg0, this[0][1]-arg0, this[0][2]-arg0, this[0][3]-arg0,
					 this[1][0]-arg0, this[1][1]-arg0, this[1][2]-arg0, this[1][3]-arg0,
					 this[2][0]-arg0, this[2][1]-arg0, this[2][2]-arg0, this[2][3]-arg0,
					 this[3][0]-arg0, this[3][1]-arg0, this[3][2]-arg0, this[3][3]-arg0);
	}

	mul(m: mat4): mat4;
	mul(v: vec4): vec4;
	mul(xyz: vec3, w: number): vec4;
	mul(xy: vec2, zw: vec2): vec4;
	mul(xy: vec2, z: number, w: number): vec4;
	mul(x: number, yzw: vec3): vec4;
	mul(x: number, yz: vec2, w: number): vec4;
	mul(x: number, y: number, zw: vec2): vec4;
	mul(x: number, y: number, z: number, w: number): vec4;
	mul(n: number): mat4;
	mul(arg0: mat4|vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): mat4|vec4 {
		if(arg0 instanceof mat4) {
			let r0=this.row(0), r1=this.row(1), r2=this.row(2), r3=this.row(3);
			let c0=arg0.column(0), c1=arg0.column(1), c2=arg0.column(2), c3=arg0.column(3);
			return new mat4(r0.dot(c0), r0.dot(c1), r0.dot(c2), r0.dot(c3),
							r1.dot(c0), r1.dot(c1), r1.dot(c2), r1.dot(c3),
							r2.dot(c0), r2.dot(c1), r2.dot(c2), r2.dot(c3),
							r3.dot(c0), r3.dot(c1), r3.dot(c2), r3.dot(c3));
		} else if(arg0 instanceof vec4) {
			return new vec4(this.row(0).dot(arg0),
							this.row(1).dot(arg0),
							this.row(2).dot(arg0),
							this.row(3).dot(arg0));
		} else if(arg0 instanceof vec3) {
			return new vec4(this.row(0).dot(arg0, <number>arg1),
							this.row(1).dot(arg0, <number>arg1),
							this.row(2).dot(arg0, <number>arg1),
							this.row(3).dot(arg0, <number>arg1));
		} else if(arg0 instanceof vec2) {
			if(arg1 instanceof vec2) {
				return new vec4(this.row(0).dot(arg0, arg1),
								this.row(1).dot(arg0, arg1),
								this.row(2).dot(arg0, arg1),
								this.row(3).dot(arg0, arg1));
			} else {
				return new vec4(this.row(0).dot(arg0, <number>arg1, <number>arg2),
								this.row(1).dot(arg0, <number>arg1, <number>arg2),
								this.row(2).dot(arg0, <number>arg1, <number>arg2),
								this.row(3).dot(arg0, <number>arg1, <number>arg2));
			}
		} else {
			if(arg1 instanceof vec3) {
				return new vec4(this.row(0).dot(arg0, arg1),
								this.row(1).dot(arg0, arg1),
								this.row(2).dot(arg0, arg1),
								this.row(3).dot(arg0, arg1));
			} else if(arg1 instanceof vec2) {
				return new vec4(this.row(0).dot(arg0, arg1, <number>arg2),
								this.row(1).dot(arg0, arg1, <number>arg2),
								this.row(2).dot(arg0, arg1, <number>arg2),
								this.row(3).dot(arg0, arg1, <number>arg2));
			} else {
				if(arg2 instanceof vec2) {
					return new vec4(this.row(0).dot(arg0, arg1, arg2),
									this.row(1).dot(arg0, arg1, arg2),
									this.row(2).dot(arg0, arg1, arg2),
									this.row(3).dot(arg0, arg1, arg2));
				} else if(isNumber(arg3)) {
					return new vec4(this.row(0).dot(arg0, arg1, arg2, arg3),
									this.row(1).dot(arg0, arg1, arg2, arg3),
									this.row(2).dot(arg0, arg1, arg2, arg3),
									this.row(3).dot(arg0, arg1, arg2, arg3));
				} else {
					return new vec4(this.row(0).dot(arg0, arg0, arg0, arg0),
									this.row(1).dot(arg0, arg0, arg0, arg0),
									this.row(2).dot(arg0, arg0, arg0, arg0),
									this.row(3).dot(arg0, arg0, arg0, arg0));
				}
			}
		}
	}

	determinant(): number {
		return this[3][0]*this[2][1]*this[1][2]*this[0][3]-this[2][0]*this[3][1]*this[1][2]*this[0][3]-
			   this[3][0]*this[1][1]*this[2][2]*this[0][3]+this[1][0]*this[3][1]*this[2][2]*this[0][3]+
			   this[2][0]*this[1][1]*this[3][2]*this[0][3]-this[1][0]*this[2][1]*this[3][2]*this[0][3]-
			   this[3][0]*this[2][1]*this[0][2]*this[1][3]+this[2][0]*this[3][1]*this[0][2]*this[1][3]+
			   this[3][0]*this[0][1]*this[2][2]*this[1][3]-this[0][0]*this[3][1]*this[2][2]*this[1][3]-
			   this[2][0]*this[0][1]*this[3][2]*this[1][3]+this[0][0]*this[2][1]*this[3][2]*this[1][3]+
			   this[3][0]*this[1][1]*this[0][2]*this[2][3]-this[1][0]*this[3][1]*this[0][2]*this[2][3]-
			   this[3][0]*this[0][1]*this[1][2]*this[2][3]+this[0][0]*this[3][1]*this[1][2]*this[2][3]+
			   this[1][0]*this[0][1]*this[3][2]*this[2][3]-this[0][0]*this[1][1]*this[3][2]*this[2][3]-
			   this[2][0]*this[1][1]*this[0][2]*this[3][3]+this[1][0]*this[2][1]*this[0][2]*this[3][3]+
			   this[2][0]*this[0][1]*this[1][2]*this[3][3]-this[0][0]*this[2][1]*this[1][2]*this[3][3]-
			   this[1][0]*this[0][1]*this[2][2]*this[3][3]+this[0][0]*this[1][1]*this[2][2]*this[3][3];
	}

	inverse(): mat4|null {
		let det=this.determinant();
		if(det===0) {
			return null;
		}
		let s=1/det;
		return new mat4(
			(this[2][1]*this[3][2]*this[1][3]-this[3][1]*this[2][2]*this[1][3]+this[3][1]*this[1][2]*this[2][3]-this[1][1]*this[3][2]*this[2][3]-this[2][1]*this[1][2]*this[3][3]+this[1][1]*this[2][2]*this[3][3])*s,
			(this[3][1]*this[2][2]*this[0][3]-this[2][1]*this[3][2]*this[0][3]-this[3][1]*this[0][2]*this[2][3]+this[0][1]*this[3][2]*this[2][3]+this[2][1]*this[0][2]*this[3][3]-this[0][1]*this[2][2]*this[3][3])*s,
			(this[1][1]*this[3][2]*this[0][3]-this[3][1]*this[1][2]*this[0][3]+this[3][1]*this[0][2]*this[1][3]-this[0][1]*this[3][2]*this[1][3]-this[1][1]*this[0][2]*this[3][3]+this[0][1]*this[1][2]*this[3][3])*s,
			(this[2][1]*this[1][2]*this[0][3]-this[1][1]*this[2][2]*this[0][3]-this[2][1]*this[0][2]*this[1][3]+this[0][1]*this[2][2]*this[1][3]+this[1][1]*this[0][2]*this[2][3]-this[0][1]*this[1][2]*this[2][3])*s,
			(this[3][0]*this[2][2]*this[1][3]-this[2][0]*this[3][2]*this[1][3]-this[3][0]*this[1][2]*this[2][3]+this[1][0]*this[3][2]*this[2][3]+this[2][0]*this[1][2]*this[3][3]-this[1][0]*this[2][2]*this[3][3])*s,
			(this[2][0]*this[3][2]*this[0][3]-this[3][0]*this[2][2]*this[0][3]+this[3][0]*this[0][2]*this[2][3]-this[0][0]*this[3][2]*this[2][3]-this[2][0]*this[0][2]*this[3][3]+this[0][0]*this[2][2]*this[3][3])*s,
			(this[3][0]*this[1][2]*this[0][3]-this[1][0]*this[3][2]*this[0][3]-this[3][0]*this[0][2]*this[1][3]+this[0][0]*this[3][2]*this[1][3]+this[1][0]*this[0][2]*this[3][3]-this[0][0]*this[1][2]*this[3][3])*s,
			(this[1][0]*this[2][2]*this[0][3]-this[2][0]*this[1][2]*this[0][3]+this[2][0]*this[0][2]*this[1][3]-this[0][0]*this[2][2]*this[1][3]-this[1][0]*this[0][2]*this[2][3]+this[0][0]*this[1][2]*this[2][3])*s,
			(this[2][0]*this[3][1]*this[1][3]-this[3][0]*this[2][1]*this[1][3]+this[3][0]*this[1][1]*this[2][3]-this[1][0]*this[3][1]*this[2][3]-this[2][0]*this[1][1]*this[3][3]+this[1][0]*this[2][1]*this[3][3])*s,
			(this[3][0]*this[2][1]*this[0][3]-this[2][0]*this[3][1]*this[0][3]-this[3][0]*this[0][1]*this[2][3]+this[0][0]*this[3][1]*this[2][3]+this[2][0]*this[0][1]*this[3][3]-this[0][0]*this[2][1]*this[3][3])*s,
			(this[1][0]*this[3][1]*this[0][3]-this[3][0]*this[1][1]*this[0][3]+this[3][0]*this[0][1]*this[1][3]-this[0][0]*this[3][1]*this[1][3]-this[1][0]*this[0][1]*this[3][3]+this[0][0]*this[1][1]*this[3][3])*s,
			(this[2][0]*this[1][1]*this[0][3]-this[1][0]*this[2][1]*this[0][3]-this[2][0]*this[0][1]*this[1][3]+this[0][0]*this[2][1]*this[1][3]+this[1][0]*this[0][1]*this[2][3]-this[0][0]*this[1][1]*this[2][3])*s,
			(this[3][0]*this[2][1]*this[1][2]-this[2][0]*this[3][1]*this[1][2]-this[3][0]*this[1][1]*this[2][2]+this[1][0]*this[3][1]*this[2][2]+this[2][0]*this[1][1]*this[3][2]-this[1][0]*this[2][1]*this[3][2])*s,
			(this[2][0]*this[3][1]*this[0][2]-this[3][0]*this[2][1]*this[0][2]+this[3][0]*this[0][1]*this[2][2]-this[0][0]*this[3][1]*this[2][2]-this[2][0]*this[0][1]*this[3][2]+this[0][0]*this[2][1]*this[3][2])*s,
			(this[3][0]*this[1][1]*this[0][2]-this[1][0]*this[3][1]*this[0][2]-this[3][0]*this[0][1]*this[1][2]+this[0][0]*this[3][1]*this[1][2]+this[1][0]*this[0][1]*this[3][2]-this[0][0]*this[1][1]*this[3][2])*s,
			(this[1][0]*this[2][1]*this[0][2]-this[2][0]*this[1][1]*this[0][2]+this[2][0]*this[0][1]*this[1][2]-this[0][0]*this[2][1]*this[1][2]-this[1][0]*this[0][1]*this[2][2]+this[0][0]*this[1][1]*this[2][2])*s
		);
	}

	mat2(row: 0|1|2=0, col: 0|1|2=0): mat2 {
		return new mat2(this[row][col], this[row][col+1],
						this[row+1][col], this[row+1][col+1]);
	}

	mat3(row: 0|1=0, col: 0|1=0): mat3 {
		return new mat3(this[row][col], this[row][col+1], this[row][col+2],
						this[row+1][col], this[row+1][col+1], this[row+1][col+2],
						this[row+2][col], this[row+2][col+1], this[row+2][col+2]);
	}

	toArray(): [number, number, number, number, 
				number, number, number, number,
				number, number, number, number,
				number, number, number, number] {
		return [this[0][0], this[0][1], this[0][2], this[0][3],
				this[1][0], this[1][1], this[1][2], this[1][3],
				this[2][0], this[2][1], this[2][2], this[2][3],
				this[3][0], this[3][1], this[3][2], this[3][3]];
	}

	clone(): mat4 { return new mat4(this[0][0], this[0][1], this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]); }

	static translate(offset: vec3): mat4;
	static translate(tx: number, ty: number, tz: number): mat4;
	static translate(arg0: vec3|number, arg1?: number, arg2?: number): mat4 {
		return new mat4(1, 0, 0, (arg0 instanceof vec3) ? arg0.x : arg0,
						0, 1, 0, (arg0 instanceof vec3) ? arg0.y : arg1,
						0, 0, 1, (arg0 instanceof vec3) ? arg0.z : arg2,
						0, 0, 0, 1);
	}

	static scale(scales: vec3): mat4;
	static scale(sx: number, sy: number, sz: number): mat4;
	static scale(arg0: vec3|number, arg1?: number, arg2?: number): mat4 {
		return new mat4((arg0 instanceof vec3) ? arg0.x : arg0, 0, 0, 0,
						0, (arg0 instanceof vec3) ? arg0.y : arg1, 0, 0,
						0, 0, (arg0 instanceof vec3) ? arg0.z : arg2, 0,
						0, 0, 0, 1);
	}

	static rotate(axis: vec3, angle: number): mat4 {
		let c: number=Math.cos(angle);
		let s: number=Math.sin(angle);
		let [x, y, z]=axis.toArray();

		return new mat4(x*x*(1-c)+c, x*y*(1-c)-z*s, x*z*(1-c)+y*s, 0,
						x*y*(1-c)+z*s, y*y*(1-c)+c, y*z*(1-c)-x*s, 0,
						x*z*(1-c)-y*s, y*z*(1-c)+x*s, z*z*(1-c)+c, 0,
						0, 0, 0, 1);
	}

	static rotateX(angle: number): mat4 {
		return mat4.rotate(new vec3(1, 0, 0), angle);
	}

	static rotateY(angle: number): mat4 {
		return mat4.rotate(new vec3(0, 1, 0), angle);
	}

	static rotateZ(angle: number): mat4 {
		return mat4.rotate(new vec3(0, 0, 1), angle);
	}

	static lookAt(eye: vec3, at: vec3, up: vec3): mat4 {
		let n: vec3=eye.sub(at).normalize();
		let u: vec3=up.cross(n).normalize();
		let v: vec3=n.cross(u).normalize();
		return new mat4(u.x, u.y, u.z, -u.dot(eye),
						v.x, v.y, v.z, -v.dot(eye),
						n.x, n.y, n.z, -n.dot(eye),
						0, 0, 0, 1);
	}

	static lookAtInv(eye: vec3, at: vec3, up: vec3): mat4 {
		let n: vec3=eye.sub(at).normalize();
		let u: vec3=up.cross(n).normalize();
		let v: vec3=n.cross(u).normalize();
		return new mat4(u.x, v.x, n.x, eye.x,
						u.y, v.y, n.y, eye.y,
						u.z, v.z, n.z, eye.z,
						0, 0, 0, 1);
	}

	static orthographic(width: number, height: number, near: number, far: number): mat4 {
		return new mat4(2/width, 0, 0, 0,
						0, 2/height, 0, 0,
						0, 0, 2/(near-far), (near+far)/(near-far),
						0, 0, 0, 1);
	}
	static perspective(fovy: number, aspectRatio: number, near: number, far: number): mat4 {
		let oot: number=1/Math.tan(fovy*0.5);
		let nmf: number=near-far;
		return new mat4(oot/aspectRatio, 0, 0, 0,
						0, oot, 0, 0,
						0, 0, (near+far)/nmf, (2.0*near*far)/nmf,
						0, 0, -1, 0);
	}
}

namespace Geometry {

	export class BoundingBox {
		public lowerBound: vec3 = new vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
		public upperBound: vec3 = new vec3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
		public massCenter: vec3 = new vec3();

		public get centerX(): number { return (this.lowerBound.x + this.upperBound.x) * 0.5; }
		public get centerY(): number { return (this.lowerBound.y + this.upperBound.y) * 0.5; }
		public get centerZ(): number { return (this.lowerBound.z + this.upperBound.z) * 0.5; }
		public get center(): vec3 { return new vec3(this.centerX, this.centerY, this.centerZ); }

		public get extentX(): number { return this.upperBound.x - this.lowerBound.x; }
		public get extentY(): number { return this.upperBound.y - this.lowerBound.y; }
		public get extentZ(): number { return this.upperBound.z - this.lowerBound.z; }
		public get extent(): vec3 { return new vec3(this.extentX, this.extentY, this.extentZ); }

		public get radius2(): number {
			let ex: number = this.extentX * 0.5;
			let ey: number = this.extentY * 0.5;
			let ez: number = this.extentZ * 0.5;
			return ex * ex + ey * ey + ez * ez;
		}
		public get radius(): number { return Math.sqrt(this.radius2); }

		public constructor(vertices: number[], comp: number, count: number, offset: number = 0) {
			if (typeof vertices === "undefined") return; 
			if (typeof comp === "undefined") throw new Error("comp must be given.");
			if (typeof count === "undefined") throw new Error("count must be given.");
			this.expand(vertices, comp, count, offset);
		}

		public expand(vertices: number[], comp: number, count: number, offset: number = 0): void {
			if (vertices.length < comp * count) throw new Error("vertices.length must be greater than comp * count.");
			for (let k = 0; k < count; k++) {
				let baseOffset: number = 3 * k;
				let x: number = vertices[baseOffset];
				let y: number = vertices[baseOffset + 1];
				let z: number = vertices[baseOffset + 2];
				this.lowerBound.x = min(this.lowerBound.x, x);
				this.lowerBound.y = min(this.lowerBound.y, y);
				this.lowerBound.z = min(this.lowerBound.z, z);
				this.upperBound.x = max(this.upperBound.x, x);
				this.upperBound.y = max(this.upperBound.y, y);
				this.upperBound.z = max(this.upperBound.z, z);
				this.massCenter.x += x;
				this.massCenter.y += y;
				this.massCenter.z += z;
			}
			this.massCenter.x /= count;
			this.massCenter.y /= count;
			this.massCenter.z /= count;
		}
	}
}

/* gcamera.ts */
namespace Camera {

	class OrthographicCamera {
		public eye: vec3;
		public at: vec3;
		public up: vec3;
		public width: number;
		public height: number;
		public near: number;
		public far: number;
		public zoomFactor: number;

		public view: mat4;
		public proj: mat4;

		public get dir(): vec3 { return this.at.sub(this.eye).normalize(); }
		public get right(): vec3 { return this.dir.cross(this.up).normalize(); }
		
		public constructor(eye: vec3, at: vec3, up: vec3, width: number, height: number, near: number, far: number, zoomFactor: number=1) {
			this.eye = eye;
			this.at = at;
			this.up = up;
			this.near = near;
			this.far = far;

			this.width=width;
			this.height=height;
			this.zoomFactor=zoomFactor;

			this.updateViewMatrix();
			this.updateProjectionMatrix();
		}

		public updateViewMatrix(): void {
			this.view = mat4.lookAt(this.eye, this.at, this.up);
		}

		public updateProjectionMatrix(): void {
			this.proj=mat4.orthographic(this.width*this.zoomFactor, this.height*this.zoomFactor, this.near, this.far);
		}

		public assign(c: OrthographicCamera): OrthographicCamera {
			this.eye.assign(c.eye);
			this.at.assign(c.at);
			this.up.assign(c.up);
			this.near = c.near;
			this.far = c.far;
			
			this.width=c.width;
			this.height=c.height;
			this.zoomFactor=c.zoomFactor;

			this.updateViewMatrix();
			this.updateProjectionMatrix();
			return this;
		}

		public clone(): OrthographicCamera {
			return new OrthographicCamera(this.eye.clone(), this.at.clone(), this.up.clone(), this.width, this.height, this.near, this.far, this.zoomFactor);
		}
	}

	export enum TrackballMode {
		NOTHING,
		CAMERA_ORBITING,
		CAMERA_PANNING,
		CAMERA_ZOOMING,
		CAMERA_ROLLING,
		OBJECT_ROTATING,
		OBJECT_ROLLING
	}
	
	export class Trackball {
		private mode: TrackballMode = TrackballMode.NOTHING;
		private curr: OrthographicCamera;
		private prev: OrthographicCamera;
		private home: OrthographicCamera;
		private frontCam: OrthographicCamera;
		private sideCam: OrthographicCamera;
		private topCam: OrthographicCamera;

		private cursor: vec2 = new vec2();

		public static CAMERA_ORBITING_RATIO: number = 0.75;
		public static CAMERA_PANNING_RATIO: number = 0.1;
		public static CAMERA_ZOOMING_RATIO: number = 0.5;
		public static CAMERA_ROLLING_RATIO: number = 0.75;
		public static OBJECT_ROTATING_RATIO: number = 0.75;
		public static OBJECT_ROLLING_RATIO: number = 0.75;
		
		public constructor(bbox: Geometry.BoundingBox, width: number, height: number) {
			let radius: number = bbox.radius;
			let at: vec3 = bbox.massCenter;
			let eye: vec3 = at.add(0, 0, radius+1);
			let up: vec3 = new vec3(0, 1, 0);
			let zoomFactor: number = 2 * radius / max(width, height);
			let near: number = 0.001;
			let far: number = max(2 * radius + 1, 20.0);
			
			let cam: OrthographicCamera = new OrthographicCamera(eye, at, up, width, height, near, far, zoomFactor);
			
			this.curr = cam;
			this.prev = cam.clone();
			this.home = cam.clone();

			this.frontCam = cam.clone();
			this.sideCam = new OrthographicCamera(at.add(radius+1, 0, 0), at.clone(), up.clone(), width, height, near, far, zoomFactor);
			this.topCam = new OrthographicCamera(at.add(0, radius+1, 0), at.clone(), new vec3(0, 0, -1), width, height, near, far, zoomFactor);
		}

		public get zoomFactor(): number { return this.curr.zoomFactor; }

		public get position(): vec3 { return this.curr.eye; }
		public get viewMatrix(): mat4 { return this.curr.view; }
		public get invViewMatrix(): mat4 { return mat4.lookAtInv(this.curr.eye, this.curr.at, this.curr.up); }
		public get rotationMatrix(): mat4 { return mat4.lookAt(this.curr.eye.sub(this.curr.at), new vec3(), this.curr.up); }
		public get projectionMatrix(): mat4 { return this.curr.proj; }

		public setHome(): void {
			this.curr.assign(this.home);
			this.prev.assign(this.home);
		}
		public setFront(): void {
			this.curr.assign(this.frontCam);
			this.prev.assign(this.frontCam);
			this.home.assign(this.frontCam);
		}
		public setSide(): void {
			this.curr.assign(this.sideCam);
			this.prev.assign(this.sideCam);
			this.home.assign(this.sideCam);
		}
		public setTop(): void {
			this.curr.assign(this.topCam);
			this.prev.assign(this.topCam);
			this.home.assign(this.topCam);
		}

		public mouse(x: number, y: number, mode: TrackballMode): void {
			x = clamp(2*x-1, -1, 1);
			y = -clamp(2*y-1, -1, 1);
			this.prev.assign(this.curr);
			this.cursor.assign(x, y);
			this.mode = mode;
		}

		public motion(x: number, y: number): void {
			x = clamp(2*x-1, -1, 1);
			y = -clamp(2*y-1, -1, 1);
			let d: vec2 = new vec2(x, y).sub(this.cursor);
			if (d.x == 0 && d.y == 0) return;

			switch (this.mode) {
				case TrackballMode.CAMERA_ORBITING: this.cameraOrbit(d); break;
				case TrackballMode.CAMERA_PANNING: this.cameraPan(d); break;
				case TrackballMode.CAMERA_ROLLING: this.cameraRoll(d); break;
				case TrackballMode.CAMERA_ZOOMING: this.cameraZoom(d); break;
				case TrackballMode.OBJECT_ROTATING: this.objectRotate(d); break;
				case TrackballMode.OBJECT_ROLLING: this.objectRoll(d); break;
				default: break;
			}
		}

		public updateViewport(width: number, height: number) {
			this.curr.width = width;
			this.curr.height = height;
			this.prev.width = width;
			this.prev.height = height;
			this.home.width = width;
			this.home.height = height;
			this.frontCam.width = width;
			this.frontCam.height = height;
			this.sideCam.width = width;
			this.sideCam.height = height;
			this.topCam.width = width;
			this.topCam.height = height;
		}

		public update(): void {
			this.curr.updateViewMatrix();
			this.curr.updateProjectionMatrix();
		}

		private cameraOrbit(d: vec2): void {
			const HALF_PI: number = Math.PI * 0.5;
			
			const angle: number = d.length * HALF_PI;
			const axis: vec3 = new vec3(-d.y, d.x, 0).normalize().mul(this.prev.view.mat3());
		
			let R: mat4 = mat4.rotate(axis, angle);
			let eye: vec3 = this.prev.eye.sub(this.prev.at);
			eye = R.mul(eye, 1).xyz;
			eye = eye.add(this.prev.at);

			this.curr.eye.assign(eye);

			this.curr.up.assign(R.mul(this.prev.up, 0).xyz);

			this.curr.updateViewMatrix();
		}

		private cameraPan(d: vec2): void {
			const NORM_FACTOR: number = this.prev.zoomFactor * 0.5;
			const dx: number = d.x * this.prev.width * NORM_FACTOR;
			const dy: number = d.y * this.prev.height * NORM_FACTOR;

			const n: vec3 = this.prev.dir;
			const u: vec3 = this.prev.right;
			const v: vec3 = u.cross(n).normalize();

			const p: vec3 = u.mul(dx).add(v.mul(dy));

			this.curr.eye.assign(this.prev.eye.sub(p));
			this.curr.at.assign(this.prev.at.sub(p));

			this.curr.updateViewMatrix();
		}

		private cameraZoom(d: vec2): void {

			const t: number = Math.pow(2, -d.x);

			this.curr.zoomFactor = this.prev.zoomFactor * t;

			this.curr.updateProjectionMatrix();
		}

		public CameraZoom(delta: number): void {
			const t: number = Math.pow(1.2, delta);

			this.prev.zoomFactor = this.curr.zoomFactor = this.prev.zoomFactor * t;

			this.curr.updateProjectionMatrix();
		}

		private cameraRoll(d: vec2): void {

			const p0: vec3 = new vec3().assign(this.cursor, 0).normalize();
			const p1: vec3 = new vec3().assign(this.cursor.add(d), 0).normalize();
			const angle: number = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));

			this.curr.up.assign(mat4.rotate(this.prev.dir, angle).mul(this.prev.up, 0).xyz);

			this.curr.updateViewMatrix();
		}
		
		private objectRotate(d: vec2): void {
			const HALF_PI: number = Math.PI * 0.5;
			
			const angle: number = -d.length * HALF_PI;
			const axis: vec3 = new vec3(-d.y, d.x, 0).normalize().mul(this.prev.view.mat3());
		
			const R: mat4 = mat4.rotate(axis, angle);

			let eye: vec3 = this.prev.eye.sub(this.home.at);
			eye = R.mul(eye, 1).xyz;
			eye = eye.add(this.home.at);

			this.curr.eye.assign(eye);

			let at: vec3 = this.prev.at.sub(this.home.at);
			at = R.mul(at, 1).xyz;
			at = at.add(this.home.at);

			this.curr.at.assign(at);

			this.curr.up.assign(R.mul(this.prev.up, 0).xyz);
			
			this.curr.updateViewMatrix();
		}

		private objectRoll(d: vec2): void {
			const p0: vec3 = new vec3().assign(this.cursor, 0).normalize();
			const p1: vec3 = new vec3().assign(this.cursor.add(d), 0).normalize();
			const angle: number = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));

			const R: mat4 = mat4.rotate(this.prev.dir, angle);

			let eye: vec3 = this.prev.eye.sub(this.home.at);
			eye = R.mul(eye, 1).xyz;
			eye = eye.add(this.home.at);

			this.curr.eye.assign(eye);

			let at: vec3 = this.prev.at.sub(this.home.at);
			at = R.mul(at, 1).xyz;
			at = at.add(this.home.at);

			this.curr.at.assign(at);
			this.curr.up.assign(R.mul(this.prev.up, 0).xyz);

			this.curr.updateViewMatrix();
		}
	}
}

/* ggeometry.ts */

enum PrimitiveType { Point, Line, Triangle };

interface iVertexData {
	vertices: number[];
	indices?: number[];
}

function GenerateWireSphereVertexData(subdiv: number=4): iVertexData {

	let points: vec3[] = [];
	let vertices: number[] = [];
	let indices: number[] = [];
	let subdivide = function(i0: number, i1: number, i2: number, level: number): void {
		if(level-->0) {
			let p0: vec3 = points[i0];
			let p1: vec3 = points[i1];
			let p2: vec3 = points[i2];
			let p01: vec3 = p0.add(p1).normalize();
			let p12: vec3 = p1.add(p2).normalize();
			let p20: vec3 = p2.add(p0).normalize();

			points.push(p01, p12, p20);
			vertices.push(...p01.toArray(), ...p12.toArray(), ...p20.toArray());

			let i01: number = points.length - 3;
			let i12: number = i01 + 1;
			let i20: number = i12 + 1;

			subdivide(i0, i01, i20, level);
			subdivide(i01, i1, i12, level);
			subdivide(i01, i12, i20, level);
			subdivide(i20, i12, i2, level);
		}
		else {
			indices.push(i0, i1, i1, i2, i2, i0);
		}
	}
	
	points.push(new vec3(1, 0, 0));		vertices.push(1, 0, 0);
	points.push(new vec3(-1, 0, 0));	vertices.push(-1, 0, 0);
	points.push(new vec3(0, 1, 0));		vertices.push(0, 1, 0);
	points.push(new vec3(0, -1, 0));	vertices.push(0, -1, 0);
	points.push(new vec3(0, 0, 1));		vertices.push(0, 0, 1);
	points.push(new vec3(0, 0, -1));	vertices.push(0, 0, -1);

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

function GenerateSphereVertexData(subdiv: number=4): iVertexData {

	let points: vec3[] = [];
	let vertices: number[] = [];
	let indices: number[] = [];
	let subdivide = function(i0: number, i1: number, i2: number, level: number): void {
		if(level-->0) {
			let p0: vec3 = points[i0];
			let p1: vec3 = points[i1];
			let p2: vec3 = points[i2];
			let p01: vec3 = p0.add(p1).normalize();
			let p12: vec3 = p1.add(p2).normalize();
			let p20: vec3 = p2.add(p0).normalize();

			points.push(p01, p12, p20);
			vertices.push(...p01.toArray(), ...p12.toArray(), ...p20.toArray());

			let i01: number = points.length - 3;
			let i12: number = i01 + 1;
			let i20: number = i12 + 1;

			subdivide(i0, i01, i20, level);
			subdivide(i01, i1, i12, level);
			subdivide(i01, i12, i20, level);
			subdivide(i20, i12, i2, level);
		}
		else {
			indices.push(i0, i1, i2);
		}
	};

	points.push(new vec3(1, 0, 0));		vertices.push(1, 0, 0);
	points.push(new vec3(-1, 0, 0));	vertices.push(-1, 0, 0);
	points.push(new vec3(0, 1, 0));		vertices.push(0, 1, 0);
	points.push(new vec3(0, -1, 0));	vertices.push(0, -1, 0);
	points.push(new vec3(0, 0, 1));		vertices.push(0, 0, 1);
	points.push(new vec3(0, 0, -1));	vertices.push(0, 0, -1);

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

function GenerateWireCylinderVertexData(lsubdiv: number=3, rsubdiv: number=36): iVertexData {

	lsubdiv = Math.floor(Math.max(1, lsubdiv));
	rsubdiv = Math.floor(Math.max(3, rsubdiv));

	let vertices: number[] = [];
	let indices: number[] = [];

	let step: number = 2/lsubdiv;

	let unitAngle: number = Math.PI / (rsubdiv/2);
	for(let k = 0; k < rsubdiv; k++) {
		let angle: number = unitAngle*k;
		let c: number = Math.cos(angle);
		let s: number = Math.sin(angle);

		vertices.push(c, 1, s);
		let i00: number = k*(lsubdiv+1);		let i01: number = ((k+1)%rsubdiv)*(lsubdiv+1);
		indices.push(i00, i01);
		for(let t = 1; t<=lsubdiv; t++) {
			vertices.push(c, 1-step*t, s);
			indices.push(i00+t-1, i00+t); indices.push(i01+t-1, i01+t);
			indices.push(i00+t, i01+t);
		}
	}

	return { vertices: vertices, indices: indices };
}

function GenerateCylinderVertexData(lsubdiv: number = 4, rsubdiv: number = 36): iVertexData {

	lsubdiv = Math.floor(Math.max(1, lsubdiv));
	rsubdiv = Math.floor(Math.max(3, rsubdiv));

	let vertices: number[] = [];
	let indices: number[] = [];

	let step: number = 2/lsubdiv;

	let unitAngle: number = Math.PI / (rsubdiv/2);
	for(let k = 0; k < rsubdiv; k++) {
		let angle: number = unitAngle*k;
		let c: number = Math.cos(angle);
		let s: number = Math.sin(angle);

		vertices.push(c, 1, s);
		let i00: number = k*(lsubdiv+1);		let i01: number = ((k+1)%rsubdiv)*(lsubdiv+1);
		for(let t = 1; t<=lsubdiv; t++) {
			vertices.push(c, 1-step*t, s);
			indices.push(i00+t-1, i00+t, i01+t);
			indices.push(i00+t-1, i01+t, i01+t-1);
		}
	}

	return { vertices: vertices, indices: indices };
}

function GenerateWireTorusVertexData(tsubdiv: number = 36, psubdiv: number = 10): iVertexData {
	
	let vertices: number[] = [];
	let indices: number[] = [];

	let tUnitAngle: number = Math.PI / (tsubdiv/2);
	let pUnitAngle: number = Math.PI / (psubdiv/2);

	let mean_radius: number = 1.0;
	let tube_radius: number = 0.5;

	for(let k = 0; k < tsubdiv; k++) {

		let phi: number = tUnitAngle*k;
		let cphi: number = Math.cos(phi);
		let sphi: number = Math.sin(phi);

		for(let s = 0; s < psubdiv; s++) {

			let theta: number = pUnitAngle*s;
			let ctheta: number = Math.cos(theta);
			let stheta: number = Math.sin(theta);

			let x: number = (mean_radius+tube_radius*ctheta)*cphi;
			let y: number = tube_radius*stheta;
			let z: number = -(mean_radius+tube_radius*ctheta)*sphi;

			vertices.push(x, y, z);

			let i0_: number = k*psubdiv;
			let i1_: number = ((k+1)%tsubdiv)*psubdiv;
			let i_0: number = s;
			let i_1: number = (s+1)%psubdiv;
			let i00: number = i0_ + i_0;
			let i01: number = i0_ + i_1;
			let i10: number = i1_ + i_0;
			let i11: number = i1_ + i_1;

			indices.push(i00, i01, i00, i10);
			indices.push(i10, i11, i01, i11);
		}
	}

	return { vertices: vertices, indices: indices };
}

function GenerateTorusVertexData(tsubdiv: number = 36, psubdiv: number = 10) {

	let vertices: number[] = [];
	let indices: number[] = [];

	let tUnitAngle: number = Math.PI / (tsubdiv/2);
	let pUnitAngle: number = Math.PI / (psubdiv/2);

	let mean_radius: number = 1.0;
	let tube_radius: number = 0.5;

	for(let k = 0; k < tsubdiv; k++) {

		let phi: number = tUnitAngle*k;
		let cphi: number = Math.cos(phi);
		let sphi: number = Math.sin(phi);

		for(let s = 0; s < psubdiv; s++) {

			let theta: number = pUnitAngle*s;
			let ctheta: number = Math.cos(theta);
			let stheta: number = Math.sin(theta);

			let x: number = (mean_radius+tube_radius*ctheta)*cphi;
			let y: number = tube_radius*stheta;
			let z: number = -(mean_radius+tube_radius*ctheta)*sphi;

			vertices.push(x, y, z);

			let i0_: number = k*psubdiv;
			let i1_: number = ((k+1)%tsubdiv)*psubdiv;
			let i_0: number = s;
			let i_1: number = (s+1)%psubdiv;
			let i00: number = i0_ + i_0;
			let i01: number = i0_ + i_1;
			let i10: number = i1_ + i_0;
			let i11: number = i1_ + i_1;

			indices.push(i00, i01, i11);
			indices.push(i00, i11, i10);
		}
	}

	return { vertices: vertices, indices: indices };
}

/* webgl_utils.ts */

function CreateShaderProgram(gl: WebGLRenderingContext|WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {

	let vs: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vsSrc);
	gl.compileShader(vs);

	if(gl.getShaderParameter(vs, gl.COMPILE_STATUS)===false) {
		throw new Error(gl.getShaderInfoLog(vs));
	}

	let fs: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fsSrc);
	gl.compileShader(fs);

	if(gl.getShaderParameter(fs, gl.COMPILE_STATUS)===false) {
		throw new Error(gl.getShaderInfoLog(fs));
	}

	let prog: WebGLProgram = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	
	gl.linkProgram(prog);
	if(gl.getProgramParameter(prog, gl.LINK_STATUS)===false) {
		throw new Error(gl.getProgramInfoLog(prog));
	}

	gl.useProgram(prog);

	gl.validateProgram(prog);
	if(gl.getProgramParameter(prog, gl.VALIDATE_STATUS)===false) {
		throw new Error(gl.getProgramInfoLog(prog));
	}

	gl.deleteShader(vs);
	gl.deleteShader(fs);

	return prog;
}

interface iFramebufferObject { fbo: WebGLFramebuffer, rbo: WebGLRenderbuffer, tex: WebGLTexture };

function CreateFramebufferObject(gl: WebGLRenderingContext|WebGL2RenderingContext, width: number, height: number): iFramebufferObject {

	let TEX: WebGLTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, TEX);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);

	let RBO: WebGLRenderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, RBO);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT, width, height);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);

	let FBO: WebGLFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	return { fbo: FBO, rbo: RBO, tex: TEX };
}

function ResizeFramebufferObject(gl: WebGLRenderingContext|WebGL2RenderingContext, width: number, height: number, FBO: iFramebufferObject): void {

	gl.bindTexture(gl.TEXTURE_2D, FBO.tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function BindFramebufferObject(gl: WebGLRenderingContext|WebGL2RenderingContext, FBO: iFramebufferObject): void {

	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO.fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, FBO.tex, 0);
	gl.bindRenderbuffer(gl.RENDERBUFFER, FBO.rbo);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, FBO.rbo);
}

function UnbindFramebufferObject(gl: WebGLRenderingContext|WebGL2RenderingContext): void {

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

// webgl1
interface iVertexBuffer { count: number, vbo: WebGLBuffer };
interface iVertexBufferIndexed extends iVertexBuffer { ibo: WebGLBuffer };

function CreateVertexBuffer(gl: WebGLRenderingContext, vertices: number[]): iVertexBuffer {

	let VBO: WebGLBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return { count: vertices.length/3, vbo: VBO };
}

function CreateVertexBufferIndexed(gl: WebGLRenderingContext, vertices: number[]|iVertexData, indices?: number[]): iVertexBufferIndexed {
	
	if(indices==undefined) {
		indices = (<iVertexData>vertices).indices;
		vertices = (<iVertexData>vertices).vertices;
	}

	let VB: iVertexBuffer = CreateVertexBuffer(gl, <number[]>vertices);

	let IBO: WebGLBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return { count: indices.length, vbo: VB.vbo, ibo: IBO };
}

// webgl2
interface iVertexArrayBuffer { count: number, vao: WebGLVertexArrayObject, vbo: WebGLBuffer };
interface iVertexArrayBufferIndexed extends iVertexArrayBuffer { ibo: WebGLBuffer };

function CreateVertexArrayBuffer(gl: WebGL2RenderingContext, vertices: number[]): iVertexArrayBuffer {
	
	let VAO: WebGLVertexArrayObject = gl.createVertexArray();
	gl.bindVertexArray([VAO]);

	let VBO: WebGLBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	gl.bindVertexArray(null);

	return { vao: VAO, vbo: VBO, count: vertices.length/3 };
} 

function CreateVertexArrayBufferIndexed(gl: WebGL2RenderingContext, vertices: number[]|iVertexData, indices?: number[]): iVertexArrayBufferIndexed {

	if(indices==null) {
		indices = (<iVertexData>vertices).indices;
		vertices = (<iVertexData>vertices).vertices;
	}

	let VAB: iVertexArrayBuffer = CreateVertexArrayBuffer(gl, <number[]>vertices);

	gl.bindVertexArray(VAB.vao);

	let IBO: WebGLBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	gl.bindVertexArray(null);

	return { count: indices.length, vao: VAB.vao, vbo: VAB.vbo, ibo: IBO };
}

/* webglappbase.ts */

abstract class AppBase {

	protected _run: Boolean;

	public width: number;
	public height: number;

	public constructor(canvas: HTMLCanvasElement) {
		this.width = canvas.clientWidth;
		this.height = canvas.clientHeight;
	}

	protected onKeyDown(event: KeyboardEvent): void {}
	protected onKeyUp(event: KeyboardEvent): void {}

	protected onMouseDown(event: MouseEvent): void {}
	protected onMouseUp(event: MouseEvent): void {}
	protected onMouseMove(event: MouseEvent): void {}
	protected onMouseOver(event: MouseEvent): void {}
	protected onMouseOut(event: MouseEvent): void {}
	protected onMouseWheel(event: WheelEvent): void {}

	protected onTouchStart(event: TouchEvent): void {}
	protected onTouchMove(event: TouchEvent): void {}
	protected onTouchEnd(event: TouchEvent): void {}
	protected onTouchCancel(event: TouchEvent): void {}
}

abstract class WebGLAppBase extends AppBase {

	private _glContext: WebGLRenderingContext = null;
	public get WebGLContext(): WebGLRenderingContext { return this._glContext; }
	protected canvas: HTMLCanvasElement = null;
	protected GetNormalizedMousePosition(event: MouseEvent): vec2 {
		return new vec2(event.offsetX / this.canvas.clientWidth, event.offsetY / this.canvas.clientHeight);
	}
	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this._glContext = canvas.getContext("webgl") as WebGLRenderingContext || canvas.getContext("experimental-webgl") as WebGLRenderingContext;
		this.canvas = canvas;
		if(this._glContext !== null) {
			canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
			canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
			canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
			canvas.addEventListener("mouseover", this.onMouseOver.bind(this));
			canvas.addEventListener("mouseout", this.onMouseOut.bind(this));
			canvas.addEventListener("mousewheel", this.onMouseWheel.bind(this), false);
			canvas.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), false);

			canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
			canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
			canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
			canvas.addEventListener("touchcancel", this.onTouchCancel.bind(this));
		}
	}

	public Init(): Boolean {
		return this.init(this.WebGLContext);
	}
	public Run(): void {
		let handle0: number|NodeJS.Timer = setInterval(()=>{
			if (this.initialUpdate(this.WebGLContext)) {
				clearInterval(handle0 as number); 
			}
			}, 1000);
		
		this._run = true;
		this._renderLoop();
	}
	public Stop(): void {
		this._run = false;

		let handle1 = setInterval(()=>{
			if (this.finalUpdate(this.WebGLContext)) {
				clearInterval(handle1);
				this.cleanUp(this.WebGLContext);
			}
		}, 1000);
	}
	private _renderLoop(timeStamp: number=new Date().valueOf(), prevTimeStamp: number=timeStamp): void {
		let dt: number = timeStamp-prevTimeStamp;
		this.WebGLContext.clear(this.WebGLContext.COLOR_BUFFER_BIT|this.WebGLContext.DEPTH_BUFFER_BIT);

		this.update(this.WebGLContext, dt);
		this.render(this.WebGLContext, dt);

		if(this._run) {
			window.requestAnimationFrame((t)=>{this._renderLoop.call(this, t);});
		}
	}
	protected abstract init(gl: WebGLRenderingContext): Boolean;
	protected initialUpdate(gl: WebGLRenderingContext): Boolean { return true; }
	protected update(gl: WebGLRenderingContext, timeElapsed: number): void {}
	protected abstract render(gl: WebGLRenderingContext, timeElapsed: number): void;
	protected finalUpdate(gl: WebGLRenderingContext): Boolean { return true; }
	protected abstract cleanUp(gl: WebGLRenderingContext): void;

}

/* webglapp.ts */

abstract class PrimitiveData {
	public pointVisible: Boolean;
	public geometryVisible: Boolean;
	public pointColor: vec3;
	public geometryColor: vec3;
	public inlierSelected: Boolean;
	public geometrySelected: Boolean;
	public constructor() {
		this.pointVisible = true;
		this.geometryVisible = true;
		this.pointColor = GenerateRainbowColor();
		this.geometryColor = new vec3();
		this.inlierSelected = false;
		this.geometrySelected = false;
	}
	public abstract get modelMatrix(): mat4;
}

interface iPrimitiveDataMap {
	[key: string]: PrimitiveData;
}
interface iVertexArrayBufferMap {
	[key: string]: iVertexArrayBuffer;
}
interface iVertexBufferMap {
	[key: string]: iVertexBuffer;
}

let randomColorIndex: number = 0;
function GenerateRainbowColor(): vec3 {
	let rainbowColors: vec3[] = [
		RGB3f(255, 0, 0),
		RGB3f(255, 128, 0),
		RGB3f(255, 255, 0),
		RGB3f(0, 255, 64),
		RGB3f(0, 128, 255),
		RGB3f(0, 0, 255),
		RGB3f(255, 0, 255)
	];
	let color: vec3 = rainbowColors[randomColorIndex];
	randomColorIndex = (randomColorIndex+1)%7;
	return color;
}

class PlaneData extends PrimitiveData {

	private _ll: vec3;
	private _lr: vec3;
	private _ur: vec3;
	private _ul: vec3;
	private _modelMatrix: mat4;

	public get ll(): vec3 { return this._ll; }
	public get lr(): vec3 { return this._lr; }
	public get ur(): vec3 { return this._ur; }
	public get ul(): vec3 { return this._ul; }
	public get hori(): vec3 { return this._ll.sub(this._lr); }
	public get vert(): vec3 { return this._ll.sub(this._ul); }
	public get width(): number { return this.hori.length; }
	public get height(): number { return this.vert.length; }
	public get normal(): vec3 { return this.vert.cross(this.hori).normalize(); }
	public get area(): number { return this.width*this.height; }
	public get center(): vec3 { return this._ll.add(this._lr).add(this._ur).add(this._ul).mul(0.25); }
	public get modelMatrix(): mat4 { return this._modelMatrix; }

	public constructor(ll: number[], lr: number[], ur: number[], ul: number[]) {
		super();
		this.geometryColor.assign(1, 0, 0);
		this._ll = new vec3(ll[0], ll[1], ll[2]);
		this._lr = new vec3(lr[0], lr[1], lr[2]);
		this._ur = new vec3(ur[0], ur[1], ur[2]);
		this._ul = new vec3(ul[0], ul[1], ul[2]);
		this._modelMatrix = new mat4();
	}
}

class SphereData extends PrimitiveData {
	private _center: vec3;
	private _radius: number;
	private _modelMatrix: mat4;

	public get center(): vec3 { return this._center; }
	public get radius(): number { return this._radius; }
	public get modelMatrix(): mat4 { return this._modelMatrix; }

	public constructor(c: number[], r: number) {
		super();
		this.geometryColor.assign(0, 1, 0);
		this._center = new vec3(c[0], c[1], c[2]);
		this._radius = r;
		this._modelMatrix = mat4.translate(this._center).mul(mat4.scale(this._radius, this._radius, this._radius));
	}
}

class CylinderData extends PrimitiveData {
	private _topcenter: vec3;
	private _bottomcenter: vec3;
	private _radius: number;
	private _modelMatrix: mat4;

	public get topCenter(): vec3 { return this._topcenter; }
	public get bottomCenter(): vec3 { return this._bottomcenter; }
	public get center(): vec3 { return this._topcenter.add(this._bottomcenter).mul(0.5); }
	public get axis(): vec3 { return this._topcenter.sub(this._bottomcenter).normalize(); }
	public get radius(): number { return this._radius; }
	public get height(): number { return this._topcenter.sub(this._bottomcenter).length; }
	public get modelMatrix(): mat4 { return this._modelMatrix; }

	public constructor(tc: number[], bc: number[], r: number) {
		super();
		this.geometryColor.assign(1, 0, 1);
		this._topcenter = new vec3(tc[0], tc[1], tc[2]);
		this._bottomcenter = new vec3(bc[0], bc[1], bc[2]);
		this._radius = r;

		let yAxis: vec3 = new vec3(0, 1, 0);
		let axis: vec3 = this.axis;
		let rotAxis: vec3 = yAxis.cross(axis).normalize();
		let rotAngle: number = vec3.angleBetween(yAxis, axis, rotAxis);
		this._modelMatrix = mat4.translate(this.center).mul(mat4.rotate(rotAxis, rotAngle).mul(mat4.scale(this._radius, this.height*0.5, this._radius)));
	}
}

class ConeData extends PrimitiveData {
	private _topcenter: vec3;
	private _bottomcenter: vec3;
	private _topradius: number;
	private _bottomradius: number;
	private _modelMatrix: mat4;

	public get topCenter(): vec3 { return this._topcenter; }
	public get bottomCenter(): vec3 { return this._bottomcenter; }
	public get center(): vec3 { return this._topcenter.add(this._bottomcenter).mul(0.5); }
	public get topRadius(): number { return this._topradius; }
	public get bottomRadius(): number { return this._bottomradius; }
	public get axis(): vec3 { return this._topcenter.sub(this._bottomcenter).normalize(); }
	public get height(): number { return this._topcenter.sub(this._bottomcenter).length; }
	public get modelMatrix(): mat4 { return this._modelMatrix; }

	public constructor(t: number[], b: number[], tr: number, br: number) {
		super();
		this.geometryColor.assign(0, 1, 1);
		this._topcenter = new vec3(t[0], t[1], t[2]);
		this._bottomcenter = new vec3(b[0], b[1], b[2]);
		this._topradius = tr;
		this._bottomradius = br;

		let yAxis: vec3 = new vec3(0, 1, 0);
		let axis: vec3 = this.axis;
		let rotAxis: vec3 = yAxis.cross(axis).normalize();
		let rotAngle: number = vec3.angleBetween(yAxis, axis, rotAxis);
		this._modelMatrix = mat4.translate(this.center).mul(mat4.rotate(rotAxis, rotAngle).mul(mat4.scale(1, this.height*0.5, 1)))
	}
}

class TorusData extends PrimitiveData {
	private _center: vec3;
	private _axis: vec3;
	private _meanradius: number;
	private _tuberadius: number;
	private _tubebegin: vec3;
	private _tubeangle: number;
	private _modelMatrix: mat4;

	public get center(): vec3 { return this._center; }
	public get axis(): vec3 { return this._axis; }
	public get meanRadius(): number { return this._meanradius; }
	public get tubeRadius(): number { return this._tuberadius; }
	public get tubeAngle(): number { return this._tubeangle; }
	public get modelMatrix(): mat4 { return this._modelMatrix; }

	public constructor(c: number[], n: number[], mr: number, tr: number, tb: number[], ta: number) {
		super();
		this.geometryColor.assign(1, 1, 0);
		this._center = new vec3(c[0], c[1], c[2]);
		this._axis = new vec3(n[0], n[1], n[2]);
		this._meanradius = mr;
		this._tuberadius = tr;
		this._tubebegin = new vec3(tb[0], tb[1], tb[2]);
		this._tubeangle = ta;

		let basis0: vec3 = this._tubebegin.normalize();
		let basis1: vec3 = this._axis.normalize();
		let basis2: vec3 = basis0.cross(basis1).normalize();
		let R: mat4 = new mat4(
			basis0.x, basis1.x, basis2.x, 0,
			basis0.y, basis1.y, basis2.y, 0,
			basis0.z, basis1.z, basis2.z, 0,
			0, 0, 0, 1);
		let T: mat4 = mat4.translate(this._center);
		this._modelMatrix = T.mul(R);
	}
}

interface iObjectInfo {
	type: string;
	rms: number;
	param: {
		ll?: number[];
		lr?: number[];
		ur?: number[];
		ul?: number[];
		c?: number[];
		r?: number;
		t?: number[];
		b?: number[];
		tr?: number;
		br?: number;
		n?: number[];
		mr?: number;
	};
	flags: number[];
}

function RGB3f(r: number, g: number, b: number): vec3 { return new vec3(r, g, b).div(255); }

interface iUnitFrame {
	color: { xaxis: number[], yaxis: number[], zaxis: number[], origin: number[] };
	scale: { origin_radius: number, arrow_tip_radius: number, arrow_radius: number };
	pos: { x: number, y: number };
	size: { width: number, height: number };
}

interface iRuler {
	color: number[];
	scale: { lineWidth: number };
	pos: { x: number, y: number };
	size: { width: number, height: number };
}

class WebGLApp extends WebGLAppBase {

	private static vsDebugES2: string=`#version 100
	attribute vec3 pos;

	uniform vec3 line[2];
	uniform mat4 model_matrix;
	uniform mat4 view_matrix;
	uniform mat4 proj_matrix;

	void main() {
		gl_Position = proj_matrix*view_matrix*model_matrix*vec4(line[int(pos.x)], 1);
	}
	`;

	private static fsDebugES2: string=`#version 100
	precision mediump float;

	void main() {
		gl_FragColor = vec4(1, 0, 0, 1);
	}
	`;

    private static vsPointCloudES2: string=`#version 100
    attribute vec3 pos;
	
    uniform mat4 view_matrix;
	uniform mat4 proj_matrix;
	uniform float pointSize;

    void main() {
        gl_PointSize = pointSize;
        gl_Position = proj_matrix*view_matrix*vec4(pos, 1);
    }
    `;

    private static fsPointCloudES2: string=`#version 100
    precision mediump float;

    uniform vec3 color;

    void main() {
        gl_FragColor = vec4(color, 1.0);
    }
    `;

	private static vsWireGeometryES2: string=`#version 100
	attribute vec3 pos;

	uniform int subroutine_index;	// 0: plane, 1: sphere, 2: cylinder, 3: cone, 4: torus
	uniform vec3 quad[4];	// ll, lr, ur, ul
	uniform float radius0;	// bottom or tube
	uniform float radius1;	// top or mean
	uniform mat4 model_matrix;
	uniform mat4 view_matrix;
	uniform mat4 proj_matrix;

	vec4 Plane() { return vec4(quad[int(pos.x)], 1); }
	vec4 Sphere() { return vec4(pos, 1); }
	vec4 Cylinder() { return vec4(pos, 1); }
	vec4 Cone() {
		float height = (pos.y + 1.0)*0.5;
		float interpolated_radius = mix(radius0, radius1, height);
		return vec4(vec3(interpolated_radius, 1, interpolated_radius)*pos, 1);
	}
	vec4 Torus() {
		vec3 tdir = normalize(vec3(pos.x, 0, pos.z));
		vec3 pdir = normalize(pos-tdir);
		return vec4(radius1*tdir+radius0*pdir, 1);
	}
	void main() {
		vec4 pos;
		if(subroutine_index==0) pos = Plane();
		else if(subroutine_index==1) pos = Sphere();
		else if(subroutine_index==2) pos = Cylinder();
		else if(subroutine_index==3) pos = Cone();
		else if(subroutine_index==4) pos = Torus();
		gl_Position = proj_matrix*view_matrix*model_matrix*pos;
	}
	`;

	private static vsGeometryES2: string=`#version 100
	attribute vec3 pos;
	
	uniform int subroutine_index;	// 0: plane, 1: sphere, 2: cylinder, 3: cone, 4: torus
	uniform vec3 quad[4];	// ll, lr, ur, ul
	uniform float radius0;	// bottom or tube
	uniform float radius1;	// top or mean
	uniform mat4 model_matrix;
	uniform mat4 view_matrix;
	uniform mat4 proj_matrix;

	vec4 Plane() { return vec4(quad[int(pos.x)], 1); }
	vec4 Sphere() { return vec4(pos, 1); }
	vec4 Cylinder() { return vec4(pos, 1); }
	vec4 Cone() {
		float height = (pos.y + 1.0)*0.5;
		float interpolated_radius = mix(radius0, radius1, height);
		return vec4(vec3(interpolated_radius, 1, interpolated_radius)*pos, 1);
	}
	vec4 Torus() {
		vec3 tdir = normalize(vec3(pos.x, 0, pos.z));
		vec3 pdir = normalize(pos-tdir);
		return vec4(radius1*tdir+radius0*pdir, 1);
	}
	void main() {
		vec4 pos;
		if(subroutine_index==0) pos = Plane();
		else if(subroutine_index==1) pos = Sphere();
		else if(subroutine_index==2) pos = Cylinder();
		else if(subroutine_index==3) pos = Cone();
		else if(subroutine_index==4) pos = Torus();
		gl_Position = proj_matrix*view_matrix*model_matrix*pos;
	}
	`;

	private static fsWireGeometryES2: string=`#version 100
	precision mediump float;
	
	uniform vec3 color;

	void main() {
		gl_FragColor = vec4(color, 0.5);
	}
	`;

	private static fsGeometryES2: string=`#version 100
	precision mediump float;

	uniform vec3 color;

	/*http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-barycentric-coordinates/*/
	/*float edgeFactor() { 
		vec3 d=fwidth(bary); 
		vec3 a3=smoothstep(vec3(0.0), d*1.5, bary); 
		return min(min(a3.x, a3.y), a3.z); 
	}*/
	void main() {
		/*float edge = edgeFactor();
		if(edge==0.0) discard;
		gl_FragColor = vec4(mix(color, vec3(0.5), edge), 1.0);*/
		gl_FragColor = vec4(color, 1.0);
	}
	`;

	private static vsCircleES2: string=`#version 100
	#define PI 3.141592653589793
	attribute float vertexID;

	uniform vec2 pos;
	uniform float radius;
	uniform int vertexCount; // ex) 38 = 36(points on circle) + 1(center) + 1(point enclosing circle)
	uniform mat4 proj_matrix;

	varying float alphaFactor;
  
	void main() {
		
		int ID = int(vertexID) - 1;
		if (ID == 0) {
			vec4 npos = proj_matrix * vec4(pos, -1, 1);
			gl_Position = vec4(npos.xy, 0, 1);
			alphaFactor = 0.0;
		} else {
			int count = vertexCount - 2;
			int index = int(mod(float(ID - 1), float(count)));
			float angle = 2.0 * float(PI) * float(index) / float(count);
			float x = radius * cos(angle);
			float y = radius * sin(angle);
			vec4 npos = proj_matrix * vec4(pos.x + x, pos.y + y, -1, 1);
			gl_Position = vec4(npos.xy, 0, 1);
			alphaFactor = 1.0;
		}
	}
	`;

	private static fsCircleES2: string=`#version 100
	precision mediump float;
	
	uniform vec3 color;
	uniform float alphaExp;
	uniform float alphaMin;
	uniform float alphaMax;
	varying float alphaFactor;

	void main() {
		gl_FragColor = vec4(color, clamp(pow(alphaFactor, alphaExp), alphaMin, alphaMax));
	}
	`;

	private trackball: Camera.Trackball;
	
	private programDebug: WebGLProgram = null;
	private programPointCloud: WebGLProgram = null;
	private programWireGeometry: WebGLProgram = null;
	private programCircle: WebGLProgram = null;
	
	private plane: iVertexBufferIndexed = null;
	private sphere: iVertexBufferIndexed = null;
	private cylinder: iVertexBufferIndexed = null;
	private cone: iVertexBufferIndexed = null;
	private torus: iVertexBufferIndexed = null;
	
	private pointcloud: iVertexBuffer;
	private attributeLessIndices: iVertexBuffer;
	private objectNames: string[] = [];
	private inlierVAO: iVertexBufferMap = {};
	private inlierObjects: iPrimitiveDataMap = {};

	private programGeometry: WebGLProgram = null;
	private arrowCylinder: iVertexBufferIndexed = null;
	private originSphere: iVertexBufferIndexed = null;
	private frame: iUnitFrame;
	public GetFrameOriginColor(): number[] { return [...this.frame.color.origin]; }
	public SetFrameOriginColor(r: number, g: number, b: number): void { this.frame.color.origin = [ r, g, b ]; }
	public GetFrameAxisXColor(): number[] { return [...this.frame.color.xaxis]; }
	public SetFrameAxisXColor(r: number, g: number, b: number): void { this.frame.color.xaxis = [ r, g, b ]; }
	public GetFrameAxisYColor(): number[] { return [...this.frame.color.yaxis]; }
	public SetFrameAxisYColor(r: number, g: number, b: number): void { this.frame.color.yaxis = [ r, g, b ]; }
	public GetFrameAxisZColor(): number[] { return [...this.frame.color.zaxis]; }
	public SetFrameAxisZColor(r: number, g: number, b: number): void { this.frame.color.zaxis = [ r, g, b ]; }
	public GetOriginRadius(): number { return this.frame.scale.origin_radius; }
	public SetOriginRadius(radius: number): void { this.frame.scale.origin_radius = radius; }
	public GetAxisTipRadius(): number { return this.frame.scale.arrow_tip_radius; }
	public SetAxisTipRadius(radius: number): void { this.frame.scale.arrow_tip_radius = radius; }
	public GetAxisRadius(): number { return this.frame.scale.arrow_radius; }
	public SetAxisRadius(radius: number): void { this.frame.scale.arrow_radius = radius; }
	public GetFramePos(): { x: number, y: number } { return { x: this.frame.pos.x, y: this.frame.pos.y }; }
	public SetFramePos(x: number, y: number): void { this.frame.pos.x = x; this.frame.pos.y = y; }
	public GetFrameSize(): { width: number, height: number } { return { width: this.frame.size.width, height: this.frame.size.height }; }
	public SetFrameSize(w: number, h: number): void { this.frame.size.width = w; this.frame.size.height = h; }

	private rulerQuad: iVertexBufferIndexed = null;
	private ruler: iRuler;
	public GetRulerBarColor(): number[] { return [...this.ruler.color]; }
	public SetRulerBarColor(r: number, g: number, b: number): void { this.ruler.color = [ r, g, b ]; }
	public GetRulerPos(): { x: number, y: number } { return { x: this.ruler.pos.x, y: this.ruler.pos.y }; }
	public SetRulerPos(x: number, y: number): void { this.ruler.pos.x = x; this.ruler.pos.y = y; }
	public GetRulerSize(): { width: number, height: number } { return { width: this.ruler.size.width, height: this.ruler.size.height }; }
	public SetRulerSize(w: number, h: number): void { this.ruler.size.width = w; this.ruler.size.height = h; }
	public GetRulerLineWidth(): number { return this.ruler.scale.lineWidth; }
	public SetRulerLineWidth(width: number): void { this.ruler.scale.lineWidth = width; }

	private outlierPointSize: number;
	public GetOutlierPointSize(): number { return this.outlierPointSize; }
	public SetOutlierPointSize(size: number): void { this.outlierPointSize = Math.max(size, 1.0); }
	private inlierPointSize: number;
	public GetInlierPointSize(): number { return this.inlierPointSize; }
	public SetInlierPointSize(size: number): void { this.inlierPointSize = Math.max(size, 1.0); }
	private selectedPointSize: number;
	public GetSelectedPointSize(): number { return this.inlierPointSize; }
	public SetSelectedPointSize(size: number): void { this.selectedPointSize = Math.max(size, 1.0); }

	private bbox: Geometry.BoundingBox;
	private _vertexDataBackup: number[] = null;
	private _vertexData: number[] = null;
	public get vertexData(): number[] { return this._vertexData; }

	private picked_point: vec3 = null;
	private ray_org: vec3 = null;
	private ray_dir: vec3 = null;
	private probeRadius: number = 4;
	public GetProbeRadius(): number { return this.probeRadius; }
	public SetProbeRadius(radiusInPixels: number) { this.probeRadius = radiusInPixels; }

	private touchID: number = 0;
	private touchStartTime: number = 0;
	private touchStartPos: vec2 = new vec2();

	private trackballMode: Camera.TrackballMode = Camera.TrackballMode.NOTHING;
	public SetTrackballRotate(): void { this.trackballMode = Camera.TrackballMode.OBJECT_ROTATING; }
	public SetTrackballZoom(): void { this.trackballMode = Camera.TrackballMode.CAMERA_ZOOMING; }
	public SetTrackballPan(): void { this.trackballMode = Camera.TrackballMode.CAMERA_PANNING; }
	public SetTrackballStop(): void { this.trackballMode = Camera.TrackballMode.NOTHING; }
	
	private text: CanvasRenderingContext2D = null;	

	private touchRadius: number=0.1;
	public SetTouchRadius(radius: number): void {
		this.touchRadius = radius;
	}
	private bTouchAreaVisible: boolean=false;
	public ShowTouchArea(show: boolean, radius?: number): void {
		if(typeof radius !== "undefined") {
			this.touchRadius = radius;
		}
		this.bTouchAreaVisible = show;
	}

	private showTouchRadiusCircle: boolean = true;
	private touchRadiusCircleExp: number = 32;
	private touchRadiusCircleMin: number = 0.1;
	private touchRadiusCircleMax: number = 1.0;
	private touchRadiusCircleColor: vec3 = new vec3(0.7, 0.7, 0);
	public ShowTouchRadiusCircle(visible: boolean): void { this.showTouchRadiusCircle = visible; }
	public ShouldShowTouchRadiusCircle(): boolean { return this.showTouchRadiusCircle; }
	public SetTouchRadiusCircleExp(exp: number): void { this.touchRadiusCircleExp = exp; }
	public GetTouchRadiusCircleExp(): number { return this.touchRadiusCircleExp; }
	public SetTouchRadiusCircleMin(min: number): void { this.touchRadiusCircleMin = min; }
	public GetTouchRadiusCircleMin(): number { return this.touchRadiusCircleMin; }
	public SetTouchRadiusCircleMax(max: number): void { this.touchRadiusCircleMax = max; }
	public GetTouchRadiusCircleMax(): number { return this.touchRadiusCircleMax; }
	public SetTouchRadiusCircleColor(r: number, g: number, b: number): void { this.touchRadiusCircleColor.assign(r, g, b); }
	public GetTouchRadiusCircleColor(): number[] { return this.touchRadiusCircleColor.toArray(); }

	private showProbeRadiusCircle: boolean = true;
	private probeRadiusCircleExp: number = 16;
	private probeRadiusCircleMin: number = 0.1;
	private probeRadiusCircleMax: number = 1.0;
	private probeRadiusCircleColor: vec3 = new vec3(0, 1, 1);
	public ShowProbeRadiusCircle(visible: boolean): void { this.showProbeRadiusCircle = visible; }
	public ShouldShowProbeRadiusCircle(): boolean { return this.showProbeRadiusCircle; }
	public SetProbeRadiusCircleExp(exp: number): void { this.probeRadiusCircleExp = exp; }
	public GetProbeRadiusCircleExp(): number { return this.probeRadiusCircleExp; }
	public SetProbeRadiusCircleMin(min: number): void { this.probeRadiusCircleMin = min; }
	public GetProbeRadiusCircleMin(): number { return this.probeRadiusCircleMin; }
	public SetProbeRadiusCircleMax(max: number): void { this.probeRadiusCircleMax = max; }
	public GetProbeRadiusCircleMax(): number { return this.probeRadiusCircleMax; }
	public SetProbeRadiusCircleColor(r: number, g: number, b: number): void { this.probeRadiusCircleColor.assign(r, g, b); }
	public GetProbeRadiusCircleColor(): number[] { return this.probeRadiusCircleColor.toArray(); }

	public Resize(width: number, height: number) { 
		this.width = width; this.height = height;
		this.trackball.updateViewport(width, height);
		this.WebGLContext.viewport(0, 0, width, height);

		this.text.font="20px Arial";
	}

    public constructor(canvas: HTMLCanvasElement, vertices: number[], textCanvas: HTMLCanvasElement) {
		super(canvas);

		this.text=textCanvas instanceof HTMLCanvasElement ? textCanvas.getContext("2d") : document.createElement("canvas").getContext("2d");

		this.text.font="20px Arial";

		this._vertexData = vertices;

		this.bbox = new Geometry.BoundingBox(vertices, 3, vertices.length / 3, 0);
		const shouldCenterPoints: boolean = true;
		if (shouldCenterPoints) {
			const mcx: number = this.bbox.massCenter.x;
			const mcy: number = this.bbox.massCenter.y;
			const mcz: number = this.bbox.massCenter.z;
			for (let k = 0; k < vertices.length; k += 3) {
				vertices[k] -= mcx
				vertices[k + 1] -= mcy;
				vertices[k + 2] -= mcz;
			}
			this.bbox.lowerBound = this.bbox.lowerBound.sub(this.bbox.massCenter);
			this.bbox.upperBound = this.bbox.upperBound.sub(this.bbox.massCenter);
			this.bbox.massCenter.assign(0, 0, 0);
		}

		this._vertexDataBackup = vertices.slice();

		this.outlierPointSize = 1.0;
		this.inlierPointSize = 3.0;
		this.selectedPointSize = 5.0;

		this.frame = { 
			color: { 
				origin: [ 0.5, 0.5, 0.5 ],
				xaxis: [ 1, 0, 0 ],
				yaxis: [ 0, 1, 0 ],
				zaxis: [ 0, 0, 1 ]
			},
			scale: { 
				origin_radius: 0.1,
				arrow_radius: 0.05,
				arrow_tip_radius: 0.1
			},
			pos: { x: 20, y: 20 },
			size: { width: 100, height: 100 }
		};
		this.ruler = {
			color: [ 1, 1, 1 ],
			scale: { lineWidth: 3 },
			pos: { x: 10, y: 10 },
			size: { width: 100, height: 10 }
		};
    }

    protected init(gl: WebGLRenderingContext): Boolean {

		// trackball camera 
		this.trackball = new Camera.Trackball(this.bbox, this.width, this.height);

		if(gl===null) return false;

		// shaders and program
		this.programDebug = CreateShaderProgram(gl, WebGLApp.vsDebugES2, WebGLApp.fsDebugES2);
		this.programCircle = CreateShaderProgram(gl, WebGLApp.vsCircleES2, WebGLApp.fsCircleES2);
		this.programPointCloud = CreateShaderProgram(gl, WebGLApp.vsPointCloudES2, WebGLApp.fsPointCloudES2);
		this.programWireGeometry = CreateShaderProgram(gl, WebGLApp.vsWireGeometryES2, WebGLApp.fsWireGeometryES2);

		this.programGeometry = CreateShaderProgram(gl, WebGLApp.vsGeometryES2, WebGLApp.fsGeometryES2);

		// VAO and VBOs
		this.pointcloud = CreateVertexBuffer(gl, this.vertexData);
		this.attributeLessIndices = CreateVertexBuffer(gl, Array.apply(0, {length: 38}).map((_:number, i: number) => i + 1));
		this.attributeLessIndices.count = 38;
		this.plane = CreateVertexBufferIndexed(gl, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], [0, 1, 1, 2, 2, 3, 3, 0]);
		this.sphere = CreateVertexBufferIndexed(gl, GenerateWireSphereVertexData(2));
		this.cylinder = CreateVertexBufferIndexed(gl, GenerateWireCylinderVertexData(3, 18));
		this.cone = CreateVertexBufferIndexed(gl, GenerateWireCylinderVertexData(2, 18))
		this.torus = CreateVertexBufferIndexed(gl, GenerateWireTorusVertexData(18, 18));

		this.arrowCylinder = CreateVertexBufferIndexed(gl, GenerateCylinderVertexData(1)); 
		this.originSphere = CreateVertexBufferIndexed(gl, GenerateSphereVertexData(3)); 
		this.rulerQuad = CreateVertexBufferIndexed(gl, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], [0, 1, 2, 0, 2, 3]);

		// OpenGL state
		let t: number = 30/255;
		gl.clearColor(t, t, t, 1.0);
		gl.viewport(0, 0, this.width, this.height);
		gl.enable(gl.DEPTH_TEST);
        return true;
	}

	public SetCameraFront(): void { this.trackball.setFront(); }
	public SetCameraSide(): void { this.trackball.setSide(); }
	public SetCameraTop(): void { this.trackball.setTop(); }

	private extractInlier(flags: number[]): number[] {
		let inlier: number[] = [];
		let outlier: number[] = [];
		for(let k=0; k<flags.length; k++) {
			let tk: number = 3*k;
			let x: number = this._vertexData[tk];
			let y: number = this._vertexData[tk+1];
			let z: number = this._vertexData[tk+2];
			(flags[k]==0 ? inlier : outlier).push(x, y, z);
		}

		this._vertexData = outlier;
		let gl: WebGLRenderingContext = this.WebGLContext;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(outlier), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this.pointcloud.count = outlier.length/3;

		return inlier;
	}

	public AppendObject(key: string, objInfo: iObjectInfo): void {
		this.pickedPointIndex = -1;
		let inlier: number[] = this.extractInlier(objInfo.flags);
		this.inlierVAO[key] = CreateVertexBuffer(this.WebGLContext, inlier);

		this.objectNames.push(key);

		switch(objInfo.type) {
			case "plane": this.inlierObjects[key] = new PlaneData(objInfo.param.ll, objInfo.param.lr, objInfo.param.ur, objInfo.param.ul); break;
			case "sphere": this.inlierObjects[key] = new SphereData(objInfo.param.c, objInfo.param.r); break;
			case "cylinder": this.inlierObjects[key] = new CylinderData(objInfo.param.t, objInfo.param.b, objInfo.param.r); break;
			case "cone": this.inlierObjects[key] = new ConeData(objInfo.param.t, objInfo.param.b, objInfo.param.tr, objInfo.param.br); break;
			case "torus": 
			let t: { tb: number[], ta: number } = this.calculateElbowJoint(inlier, objInfo.param.c, objInfo.param.n);
			this.inlierObjects[key] = new TorusData(objInfo.param.c, objInfo.param.n, objInfo.param.mr, objInfo.param.tr, t.tb, t.ta); 
			break;
		}
	}

	public RemoveObject(key: string): void {
		let index: number = this.objectNames.indexOf(key);
		if( index!=-1) {
			this.objectNames.splice(index, 1);
			this.WebGLContext.deleteBuffer(this.inlierVAO[key].vbo);
			delete this.inlierObjects[key];
			delete this.inlierVAO[key];
		}
	}

	public Reset(): void {
		
		this._vertexData = this._vertexDataBackup.slice();
		this.objectNames.forEach(name=>{
			this.WebGLContext.deleteBuffer(this.inlierVAO[name].vbo);
		});
		this.inlierObjects={};
		this.inlierVAO = {};
		this.objectNames = [];
		this.pickedPointIndex = -1;

		let gl: WebGLRenderingContext = this.WebGLContext;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertexData), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this.pointcloud.count = this._vertexData.length/3;
	}

	public SetObjectVisible(key: string, visible: Boolean): void {
		this.inlierObjects[key].geometryVisible = visible;
		this.inlierObjects[key].pointVisible = visible;
	}
	public SetInlierVisible(key: string, visible: Boolean): void {
		this.inlierObjects[key].pointVisible = visible;
	}
	public SetAllInlierVisible(visible: Boolean): void {
		for(let k = 0; k < this.objectNames.length; k++) {
			this.inlierObjects[this.objectNames[k]].pointVisible = visible;
		}
	}
	public SetMeshVisible(key: string, visible: Boolean): void {
		this.inlierObjects[key].geometryVisible = visible;
	}
	public SetAllMeshVisible(visible: Boolean): void {
		for(let k = 0; k < this.objectNames.length; k++) {
			this.inlierObjects[this.objectNames[k]].geometryVisible = visible;
		}
	}
	
	public GetInlierColor(key: string): number[] {
		return [ this.inlierObjects[key].pointColor.x, this.inlierObjects[key].pointColor.y, this.inlierObjects[key].pointColor.z ];
	}
	public SetInlierColor(key: string, color: number[]): void {
		this.inlierObjects[key].pointColor.x = color[0];
		this.inlierObjects[key].pointColor.y = color[1];
		this.inlierObjects[key].pointColor.z = color[2];
	}

	public GetMeshColor(key: string): number[] {
		return [ this.inlierObjects[key].geometryColor.x, this.inlierObjects[key].geometryColor.y, this.inlierObjects[key].geometryColor.z ];
	}
	public SetMeshColor(key: string, color: number[]): void {
		this.inlierObjects[key].geometryColor.x = color[0];
		this.inlierObjects[key].geometryColor.y = color[1];
		this.inlierObjects[key].geometryColor.z = color[2];
	}

	public SelectObject(key: string): void {
		this.inlierObjects[key].inlierSelected = true;
		this.inlierObjects[key].geometrySelected = true;
	}
	public SelectObjectMesh(key: string): void {
		this.inlierObjects[key].geometrySelected = true;
	}
	public SelectObjectInlier(key: string): void {
		this.inlierObjects[key].inlierSelected = true;
	}
	public DeselectAll(): void {
		this.objectNames.forEach(name=>{
			this.inlierObjects[name].inlierSelected = false;
			this.inlierObjects[name].geometrySelected = false;
		});
	}

	private calculateElbowJoint(inliers: number[], center: number[], axis: number[]): { tb: number[], ta: number } {

		let c: vec3 = new vec3(center[0], center[1], center[2]);
		let n: vec3 = new vec3(axis[0], axis[1], axis[2]);
		let inlierPoints: vec3[] = [];
		for(let k = 0; k < inliers.length; k+=3) {
			let v: vec3 = new vec3(inliers[k], inliers[k+1], inliers[k+2]).sub(c);
			inlierPoints.push(n.cross(v).cross(n).normalize());
		}

		let barycentric: vec3 = new vec3();
		inlierPoints.forEach(v=>{
			barycentric.x += v.x;
			barycentric.y += v.y;
			barycentric.z += v.z;
		});
		barycentric = barycentric.div(inlierPoints.length);

		if (barycentric.length==0) return { tb: [0, 0, 0], ta: Constants.PI*2.0 };

		let elbowMiddle: vec3 = barycentric.normalize();

		let angles: number[] = [];
		inlierPoints.forEach(v=>{
			angles.push(vec3.angleBetween(elbowMiddle, v, n));
		});

		let min_index: number = -1;
		let max_index: number = -1;
		let min_angle: number = Number.MAX_VALUE;
		let max_angle: number = -Number.MAX_VALUE;
		angles.forEach((angle, i)=>{
			if(angle<min_angle) {
				min_angle = angle;
				min_index = i;
			}
			if(angle>max_angle) {
				max_angle = angle;
				max_index = i;
			}
		});

		return { tb: inlierPoints[min_index].toArray(), ta: vec3.absoluteAngleBetween(inlierPoints[min_index], inlierPoints[max_index], n) };
	}

    protected initialUpdate(gl: WebGLRenderingContext): Boolean {
        
        return true;
    }

    protected update(gl: WebGLRenderingContext, timeElapsed: number): void {
		
		this.trackball.update();
    }

    protected render(gl: WebGLRenderingContext, timeElapsed: number): void {
		
		this.text.clearRect(0, 0, this.text.canvas.width, this.text.canvas.height);
		this.text.fillStyle="white";

		gl.viewport(0, 0, this.width, this.height);
		this.renderPointCloud(gl, this.pickedPointIndex, this.selectedPointSize, this.pickedPointColor);
		this.renderInliers(gl);

		// TODO: is it okay to remove this?
		//       since we draw a circle on mouse cursor instead of this.
		//
		if(this.bTouchAreaVisible&&this.picked_point instanceof vec3) {
			gl.useProgram(this.programWireGeometry);

			gl.uniformMatrix4fv(
				gl.getUniformLocation(this.programWireGeometry, "model_matrix"), 
				false, 
				mat4.translate(this.picked_point).mul(
					mat4.scale( this.touchRadius, this.touchRadius, this.touchRadius  )
					).transpose().toArray()
				);	
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
		if (this.isMouseOut == false) {
			if (this.showTouchRadiusCircle == true) {
				this.renderCircles(gl, this.touchRadius, this.touchRadiusCircleColor, this.touchRadiusCircleExp, this.touchRadiusCircleMin, this.touchRadiusCircleMax);
			}
			if (this.showProbeRadiusCircle == true) {
				this.renderCircles(gl, this.probeRadius * this.trackball.zoomFactor, this.probeRadiusCircleColor, this.probeRadiusCircleExp, this.probeRadiusCircleMin, this.probeRadiusCircleMax);
			}
		}
		this.renderUnitFrame(gl);
		this.renderRuler(gl);
	}
	
	private pickedPointIndex: number = -1;
	private pickedPointColor: vec3 = new vec3(1, 0, 0);
	public SetPickedPointColor(r: number, g: number, b: number): void { this.pickedPointColor.assign(r, g, b); }
	public GetPickedPointColor(): number[] { return this.pickedPointColor.toArray(); }
	private renderPointCloud(gl: WebGLRenderingContext, pickedIndex: number, pickedSize: number, pickedColor: vec3): void {
		gl.useProgram(this.programPointCloud);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointcloud.vbo);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
		gl.uniform1f(gl.getUniformLocation(this.programPointCloud, "pointSize"), this.outlierPointSize);
		gl.uniform3f(gl.getUniformLocation(this.programPointCloud, "color"), 1, 1, 1);

		gl.drawArrays(gl.POINTS, 0, this.pointcloud.count);

		if (pickedIndex != -1) {
			let depthTest: GLboolean = gl.getParameter(gl.DEPTH_TEST);
			gl.disable(gl.DEPTH_TEST);

			gl.uniform1f(gl.getUniformLocation(this.programPointCloud, "pointSize"), this.selectedPointSize);
			gl.uniform3f(gl.getUniformLocation(this.programPointCloud, "color"), pickedColor.x, pickedColor.y, pickedColor.z);

			gl.drawArrays(gl.POINTS, pickedIndex, 1);

			if (depthTest == true) gl.enable(gl.DEPTH_TEST);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.useProgram(null);
	}

	private renderInliers(gl: WebGLRenderingContext): void {
		this.objectNames.forEach(name=>{
			
			let objectData: PrimitiveData = this.inlierObjects[name];
			let objectVBO: iVertexBuffer = this.inlierVAO[name];
			
			if(objectData.pointVisible) {
				gl.useProgram(this.programPointCloud);
				gl.bindBuffer(gl.ARRAY_BUFFER, objectVBO.vbo);
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
				gl.uniform1f(gl.getUniformLocation(this.programPointCloud, "pointSize"), objectData.inlierSelected ? this.selectedPointSize : this.inlierPointSize);
				gl.uniform3fv(gl.getUniformLocation(this.programPointCloud, "color"), objectData.pointColor.toArray());

				gl.drawArrays(gl.POINTS, 0, objectVBO.count);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				gl.useProgram(null);
			}

			if(objectData.geometryVisible) {
				gl.enable(gl.BLEND);
				gl.disable(gl.DEPTH_TEST);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.useProgram(this.programWireGeometry);

				gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "model_matrix"), false, objectData.modelMatrix.transpose().toArray());	
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
				gl.uniform3fv(gl.getUniformLocation(this.programWireGeometry, "color"), objectData.geometryColor.toArray());

				switch(true) {
					case objectData instanceof PlaneData:
					gl.bindBuffer(gl.ARRAY_BUFFER, this.plane.vbo);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.plane.ibo);
					gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
					gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 0);
					gl.uniform3fv(gl.getUniformLocation(this.programWireGeometry, "quad[0]"), (<PlaneData>objectData).ll.toArray());
					gl.uniform3fv(gl.getUniformLocation(this.programWireGeometry, "quad[1]"), (<PlaneData>objectData).lr.toArray());
					gl.uniform3fv(gl.getUniformLocation(this.programWireGeometry, "quad[2]"), (<PlaneData>objectData).ur.toArray());
					gl.uniform3fv(gl.getUniformLocation(this.programWireGeometry, "quad[3]"), (<PlaneData>objectData).ul.toArray());

					gl.drawElements(gl.LINES, this.plane.count, gl.UNSIGNED_SHORT, 0);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					break;

					case objectData instanceof SphereData:
					gl.bindBuffer(gl.ARRAY_BUFFER, this.sphere.vbo);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphere.ibo);
					gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
					gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 1);
					//gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, (<SphereData>objectData).modelMatrix.transpose().toArray());

					gl.drawElements(gl.LINES, this.sphere.count, gl.UNSIGNED_SHORT, 0);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					break;

					case objectData instanceof CylinderData:
					gl.bindBuffer(gl.ARRAY_BUFFER, this.cylinder.vbo);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cylinder.ibo);
					gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
					gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 2);
					//gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, (<CylinderData>objectData).modelMatrix.transpose().toArray());

					gl.drawElements(gl.LINES, this.cylinder.count, gl.UNSIGNED_SHORT, 0);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					break;

					case objectData instanceof ConeData:
					gl.bindBuffer(gl.ARRAY_BUFFER, this.cone.vbo);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cone.ibo);
					gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
					gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 3);
					//gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, (<ConeData>objectData).modelMatrix.transpose().toArray());
					gl.uniform1f(gl.getUniformLocation(this.programWireGeometry, "radius0"), (<ConeData>objectData).bottomRadius);
					gl.uniform1f(gl.getUniformLocation(this.programWireGeometry, "radius1"), (<ConeData>objectData).topRadius);

					gl.drawElements(gl.LINES, this.cone.count, gl.UNSIGNED_SHORT, 0);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					break;

					case objectData instanceof TorusData:
					gl.bindBuffer(gl.ARRAY_BUFFER, this.torus.vbo);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.torus.ibo);
					gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
					gl.uniform1i(gl.getUniformLocation(this.programWireGeometry, "subroutine_index"), 4);
					//gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, (<TorusData>objectData).modelMatrix.transpose().toArray());
					gl.uniform1f(gl.getUniformLocation(this.programWireGeometry, "radius0"), (<TorusData>objectData).tubeRadius);
					gl.uniform1f(gl.getUniformLocation(this.programWireGeometry, "radius1"), (<TorusData>objectData).meanRadius);

					// 8 = psubdiv at ggeometry.ts
					let ipr: number = 8*10; // each quad of subdiv. has 8 wire points.
					let ratio: number = (<TorusData>objectData).tubeAngle / (2*Math.PI);
					let count: number = ipr * (Math.floor(ratio*this.torus.count / ipr) + 1);
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
	}

	private renderUnitFrame(gl: WebGLRenderingContext): void {

		gl.viewport(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height, this.frame.size.width, this.frame.size.height);

		gl.useProgram(this.programGeometry);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this.trackball.rotationMatrix.transpose().toArray());
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "proj_matrix"), false, mat4.orthographic(2, 2, 0.001, 200).transpose().toArray());

		// draw origin sphere
		gl.bindBuffer(gl.ARRAY_BUFFER, this.originSphere.vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.originSphere.ibo);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 1);			
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.origin);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, mat4.scale(this.frame.scale.origin_radius, this.frame.scale.origin_radius, this.frame.scale.origin_radius).transpose().toArray());
		
		gl.drawElements(gl.TRIANGLES, this.originSphere.count, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// draw axis
		gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowCylinder.vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.arrowCylinder.ibo);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		//let textTransform: mat4 = this.trackball.projectionMatrix.mul(this.trackball.viewMatrix.mul(this.trackball.transformMatrix));

		// cylinder transformation
		let cylTS: mat4 = mat4.translate(0, 0.45, 0).mul(mat4.scale(this.frame.scale.arrow_radius, 0.45, this.frame.scale.arrow_radius));
		
		// cone transformation
		let conTS: mat4 = mat4.translate(0, 0.9, 0).mul(mat4.scale(1, 0.1, 1));
		gl.uniform1f(gl.getUniformLocation(this.programGeometry, "radius0"), this.frame.scale.arrow_tip_radius);
		gl.uniform1f(gl.getUniformLocation(this.programGeometry, "radius1"), 0);
		
		// x-axis
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.xaxis);
		let RX: mat4 = mat4.rotateZ(-Math.PI/2);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);			
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, RX.mul(cylTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, RX.mul(conTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		//let posX: vec4 = textTransform.mul(new vec4(0.7, 0, 0, 0));
		//let posXcoord: vec2 = posX.xy.mul(1,-1).add(1).mul(0.5).mul(this.frame.size.width, this.frame.size.height).add(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height);
		//this.text.fillText("X", posXcoord.x, posXcoord.y);

		// y-axis
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.yaxis);
		//let R: mat4 = mat4.rotateZ(-Math.PI/2);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);			
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, cylTS.transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, conTS.transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		//let posY: vec4 = textTransform.mul(new vec4(0, 0.7, 0, 0));
		//let posYcoord: vec2 = posY.xy.mul(1,-1).add(1).mul(0.5).mul(this.frame.size.width, this.frame.size.height).add(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height);
		//this.text.fillText("Y", posYcoord.x, posYcoord.y);

		// z-axis
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.zaxis);
		let RZ: mat4 = mat4.rotateX(Math.PI/2);
		
		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);			
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, RZ.mul(cylTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, RZ.mul(conTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		//let posZ: vec4 = textTransform.mul(new vec4(0, 0, 0.7, 0));
		//let posZcoord: vec2 = posZ.xy.mul(1,-1).add(1).mul(0.5).mul(this.frame.size.width, this.frame.size.height).add(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height);
		//this.text.fillText("Z", posZcoord.x, posZcoord.y);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.useProgram(null);
	}

	private toSuperscriptString(digitstr: string): string {
		let superscript: string="";
		for(let k=0; k<digitstr.length; k++) {
			let code=digitstr.charCodeAt(k);
			switch(code) {
				case 43: /*+*/ break;
				case 45: /*-*/ superscript += String.fromCharCode(0x207B); break;
				case 48: /*0*/ superscript += String.fromCharCode(0x2070); break;
				case 49: /*1*/ superscript += String.fromCharCode(0x00B9); break;
				case 50: /*2*/ superscript += String.fromCharCode(0x00B2); break;
				case 51: /*3*/ superscript += String.fromCharCode(0x00B3); break;
				case 52: /*4*/ 
				case 53: /*5*/
				case 54: /*6*/
				case 55: /*7*/
				case 56: /*8*/
				case 57: /*9*/	
					superscript += String.fromCharCode(0x2074+code-53); break;
			}
		}
		return superscript;
	}

	private convertToScientific(value: number, fractionDigits: number=1): string {
		
		let expstr = value.toExponential(fractionDigits);
		let [significand, exponent] = expstr.split("e");
		return significand + (Number(exponent)!=0 ? " " + String.fromCharCode(0x00D7) + "10" + this.toSuperscriptString(exponent) : "" );
	} 

	private renderRuler(gl: WebGLRenderingContext): void {

		let widthlength=this.width*this.trackball.zoomFactor;
		
		let x=this.ruler.pos.x;
		let y=this.height-this.ruler.pos.y-this.ruler.size.height;
		let w=this.ruler.size.width;
		let h=this.ruler.size.height;
		let l=this.ruler.scale.lineWidth;

		// bottom line
		let bx=x;
		let by=y+h-l;
		let bw=w;
		let bh=l;
		this.text.fillRect(bx, by, bw, bh);
		let lineLength=widthlength*bw/this.width;
		let [sig, exp]=lineLength.toExponential(1).split("e");
		let numTicks=Math.floor(Number(sig));
		this.text.strokeStyle="white";
		this.text.beginPath();
		for(let k=0; k<numTicks; k++) {
			let tickLength=bw*Number((k+1)+"e"+exp)/lineLength;
			this.text.moveTo(bx+tickLength, y+l);
			this.text.lineTo(bx+tickLength, y+h);
		}
		this.text.stroke();
		//
		// 
		this.text.fillText(this.convertToScientific(lineLength, 2), bx, by-20);

		// left bar
		let lx=x;
		let ly=y;
		let lw=l;
		let lh=h;
		this.text.fillRect(lx, ly, lw, lh);

		// right bar
		let rx=x+w-l;
		let ry=y;
		let rw=l;
		let rh=h;
		this.text.fillRect(rx, ry, rw, rh);
		
	}

	private renderCircles(gl: WebGLRenderingContext, radius: number, color: vec3, aExp: number, aMin: number, aMax: number): void {
		let vertexCount: number = 38;
		let depthTest: GLboolean = gl.getParameter(gl.DEPTH_TEST);
		gl.disable(gl.DEPTH_TEST);
		let blend: GLboolean = gl.getParameter(gl.BLEND);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.useProgram(this.programCircle);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programCircle, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());

		gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeLessIndices.vbo);
		gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);

		gl.uniform2f(gl.getUniformLocation(this.programCircle, "pos"), this.mouseX * 0.5 * this.width * this.trackball.zoomFactor, this.mouseY * 0.5 * this.height * this.trackball.zoomFactor);
		gl.uniform1f(gl.getUniformLocation(this.programCircle, "radius"), radius);
		gl.uniform1i(gl.getUniformLocation(this.programCircle, "vertexCount"), this.attributeLessIndices.count);
		gl.uniform3f(gl.getUniformLocation(this.programCircle, "color"), color.x, color.y, color.z);
		
		gl.uniform1f(gl.getUniformLocation(this.programCircle, "alphaExp"), aExp);
		gl.uniform1f(gl.getUniformLocation(this.programCircle, "alphaMin"), aMin);
		gl.uniform1f(gl.getUniformLocation(this.programCircle, "alphaMax"), aMax);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, this.attributeLessIndices.count);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.useProgram(null);

		if (blend==false) {
			gl.disable(gl.BLEND);
		}
		if (depthTest==true) {
			gl.enable(gl.DEPTH_TEST);
		}
	}

    protected finalUpdate(gl: WebGLRenderingContext): Boolean {
        
        return true;
    }

    protected cleanUp(gl: WebGLRenderingContext): void {
        
		gl.deleteProgram(this.programPointCloud);
		gl.deleteBuffer(this.pointcloud.vbo);

		this.objectNames.forEach(name=>{
			gl.deleteBuffer(this.inlierVAO[name].vbo);
		});
		
		gl.deleteBuffer(this.sphere.vbo);
		gl.deleteBuffer(this.sphere.ibo);

		gl.deleteBuffer(this.cylinder.vbo);
		gl.deleteBuffer(this.cylinder.ibo);

		gl.deleteBuffer(this.cone.vbo);
		gl.deleteBuffer(this.cone.ibo);

		gl.deleteBuffer(this.torus.vbo);
		gl.deleteBuffer(this.torus.ibo);
	}
	
	private count: number = 0;
	public PickPoint(x: number, y: number): number {
		let pixel_length: number = this.trackball.zoomFactor;

		// projection matrix multiply (orthographic projection)
		x*=this.width*0.5*this.trackball.zoomFactor;
		y*=this.height*0.5*this.trackball.zoomFactor;

		let invView: mat4 = this.trackball.invViewMatrix;
		let ray_org: vec3 = invView.mul(new vec4(x, y, 0, 1)).xyz;
		let ray_dir: vec3 = invView.mul(new vec4(0, 0, -1, 0)).xyz.normalize();
		let ray_radius: number = pixel_length*this.probeRadius; // 4 px radius
		let ray_radius2: number = ray_radius * ray_radius;

		let min_index: number = -1;
		let min_dist2: number = Number.MAX_VALUE;
		
		let min_px: number;
		let min_py: number;
		let min_pz: number;

		// circle-sweeping along the ray (cylinder).
		let candidate_point_indices: { index: number, px: number, py: number, pz: number }[] = [];
		for(let k=0; k < this.vertexData.length; k+=3) {
			let px: number = this.vertexData[k];
			let py: number = this.vertexData[k+1];
			let pz: number = this.vertexData[k+2];
			let ptox: number = px - ray_org.x;
			let ptoy: number = py - ray_org.y;
			let ptoz: number = pz - ray_org.z;
			
			let dirDotPto: number = ptox * ray_dir.x + ptoy * ray_dir.y + ptoz * ray_dir.z;
			
			//let is_behind_cam: boolean = pto.dot(ray_dir) < 0;
			let is_behind_cam: boolean = dirDotPto < 0;
			if (is_behind_cam) continue; // discards points if it is behind the camera.

			let dx: number = ptox - ray_dir.x * dirDotPto;
			let dy: number = ptoy - ray_dir.y * dirDotPto;
			let dz: number = ptoz - ray_dir.z * dirDotPto;

			let dist2: number = dx * dx + dy * dy + dz * dz;
			if(dist2 < ray_radius2) {
				candidate_point_indices.push({ index: k/3, px: px, py: py, pz: pz });
			}
			if(dist2 < min_dist2) {
				min_index = k/3;
				min_dist2 = dist2;
				
				min_px = px;
				min_py = py;
				min_pz = pz;
			}
		}
		
		// pick one nearest to the ray if no points in the cylinder.
		if(candidate_point_indices.length==0) {
			this.ray_org = ray_org;
			this.ray_dir = ray_dir;
			
			this.picked_point = new vec3(min_px, min_py, min_pz);
			return min_index;
		}

		// pick one nearest to the camera among points in the cylinder.
		let closest_index: number = -1;
		let closest_px: number;
		let closest_py: number;
		let closest_pz: number;
		let closest_dist2: number = Number.MAX_VALUE;
		for(let k=0; k < candidate_point_indices.length; k++) {
			let candidate: { index: number, px: number, py: number, pz: number } = candidate_point_indices[k];
			
			let dx: number = this.trackball.position.x - candidate.px;
			let dy: number = this.trackball.position.y - candidate.py;
			let dz: number = this.trackball.position.z - candidate.pz;
			let dist2: number = dx * dx + dy * dy + dz * dz;
			if(dist2 < closest_dist2) {
				closest_index = candidate.index;
				closest_px = candidate.px;
				closest_py = candidate.py;
				closest_pz = candidate.pz;
				closest_dist2 = dist2;
			}			
		}

		this.ray_org = ray_org;
		this.ray_dir = ray_dir;
		this.picked_point = new vec3(closest_px, closest_py, closest_pz);
		return closest_index;
	}

	public GetOutliers(): number[] {
		return this._vertexData;
	}

   	protected onMouseDown(event: MouseEvent): void {
		let pos: vec2 = this.GetNormalizedMousePosition(event);
		let x: number = pos.x;
		let y: number = pos.y;

		if(event.button==0) {
			this.trackball.mouse(x, y, this.trackballMode);
		}
    }
	protected onMouseUp(event: MouseEvent): void {
		let pos: vec2 = this.GetNormalizedMousePosition(event);
		let x: number = pos.x;
		let y: number = pos.y;

		if(event.button==0) {
			this.trackball.mouse(x, y, Camera.TrackballMode.NOTHING);
		}
	}
	private mouseX: number;
	private mouseY: number;
	private isMouseOut: boolean = true;
	protected onMouseMove(event: MouseEvent): void {
		let pos: vec2 = this.GetNormalizedMousePosition(event);
		let x: number = pos.x;
		let y: number = pos.y;
		this.mouseX = clamp(2 * x - 1, -1, 1);
		this.mouseY = clamp(1 - 2 * y, -1, 1);
		this.trackball.motion(x, y);
		this.isMouseOut = false;

		this.pickedPointIndex = this.PickPoint(this.mouseX, this.mouseY);
	}
	
	protected onMouseOut(event: MouseEvent): void {
		let pos: vec2 = this.GetNormalizedMousePosition(event);
		let x: number = pos.x;
		let y: number = pos.y;
		if(event.button==0) {
			this.trackball.mouse(x, y, Camera.TrackballMode.NOTHING);
		}
		this.isMouseOut = true;
	}

	protected onMouseWheel(event: WheelEvent): void {
		if (event.deltaY == 0) return;
		let deltaY: number = typeof event.deltaY === 'undefined' ? event.detail : event.deltaY;
		deltaY = Math.sign(deltaY);
		if (!Number.isNaN(deltaY)) this.trackball.CameraZoom(deltaY);
	}

	private _TouchScreen2Client(t: Touch): vec2{
		let canvasBB: DOMRect = this.canvas.getBoundingClientRect();
		return new vec2(
			t.clientX - canvasBB.left,
			t.clientY - canvasBB.top
		);
	}

	protected onTouchStart(event: TouchEvent): void {
		event.preventDefault();

		if(event.touches.length==1) {
			this.touchID = event.touches[0].identifier;
			this.touchStartTime = (new Date()).getTime();

			let pos: vec2 = this._TouchScreen2Client(event.touches[0]);
			this.touchStartPos.assign(pos.x, pos.y);

			this.trackball.mouse(pos.x/this.width, pos.y/this.height, this.trackballMode);
		}
	}

	protected onTouchMove(event: TouchEvent): void {
		event.preventDefault();

		for(let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let pos: vec2 = this._TouchScreen2Client(touch);

				this.trackball.motion(pos.x/this.width, pos.y/this.height);

				return;
			}
		}
	}

	protected onTouchEnd(event: TouchEvent): void {
		event.preventDefault();

		for( let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let pos: vec2 = this._TouchScreen2Client(touch);
				
				this.trackball.mouse(pos.x/this.width, pos.y/this.height, Camera.TrackballMode.NOTHING);

				let diffTime = (new Date()).getTime() - this.touchStartTime;
				let diffDist = this.touchStartPos.sub(pos.x, pos.y).length;
				
				if(diffTime < 500 && diffDist < 4) {
					let eventInit: MouseEventInit = {
						bubbles: true, cancelable: true, view: window, detail: 1,
						screenX: touch.screenX, screenY: touch.screenY,
						clientX: touch.clientX, clientY: touch.clientY,
						ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
						button: 0, relatedTarget: null
					};
					let mouseEvent = new MouseEvent("click", eventInit);
					if(!(mouseEvent instanceof MouseEvent)) {
						mouseEvent = document.createEvent("MouseEvent");
						let e = eventInit;
						mouseEvent.initMouseEvent("click", 
							e.bubbles, e.cancelable, e.view, e.detail,
							e.screenX, e.screenY,
							e.clientX, e.clientY,
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
							e.button, e.relatedTarget
						);
					}
					event.target.dispatchEvent(mouseEvent);
				}
				return;
			}
		}
	}

	protected onTouchCancel(event: TouchEvent): void {
		event.preventDefault();

		for(let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let pos: vec2 = this._TouchScreen2Client(touch);

				this.trackball.mouse(pos.x/this.width, pos.y/this.height, Camera.TrackballMode.NOTHING);
			}
		}
	}
}
