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
	public x: number;
	public y: number;
	constructor(x: number=0, y: number=0) {
		super();
		this.x=x;
		this.y=y;
	}

	public get length(): number { return this.dot(this)**0.5; }

	public assign(v: vec2): vec2;
	public assign(x: number, y: number): vec2;
	public assign(arg0: number|vec2, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			this.x=arg0.x; this.y=arg0.y;
		} else {
			this.x=arg0; this.y=arg1;
		}
		return this;
	}

	public negate(): vec2 {
		return new vec2(-this.x, -this.y);
	}

	public normalize(): vec2 {
		return this.div(this.length);
	}

	public add(v: vec2): vec2;
	public add(x: number, y: number): vec2;
	public add(n: number): vec2;
	public add(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ? 	new vec2(this.x+arg0.x, this.y+arg0.y) :
				isNumber(arg1) ? 	new vec2(this.x+arg0, this.y+arg1) :
									new vec2(this.x+arg0, this.y+arg0);
	}

	public sub(v: vec2): vec2;
	public sub(x: number, y: number): vec2;
	public sub(n: number): vec2;
	public sub(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ?	new vec2(this.x-arg0.x, this.y-arg0.y) :
				isNumber(arg1) ?	new vec2(this.x-arg0, this.y-arg1) :
									new vec2(this.x-arg0, this.y-arg0);
	}

	public mul(m: mat2): vec2;
	public mul(v: vec2): vec2;
	public mul(x: number, y: number): vec2;
	public mul(n: number): vec2;
	public mul(arg0: mat2|vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof mat2 ? 	new vec2(this.dot(arg0.column(0)), this.dot(arg0.column(1))) :
			   	arg0 instanceof vec2 ? 	new vec2(this.x*arg0.x, this.y*arg0.y) :
				isNumber(arg1) ?	new vec2(this.x*arg0, this.y*arg1) :
									new vec2(this.x*arg0, this.y*arg0);
	}

	public div(v: vec2): vec2;
	public div(x: number, y: number): vec2;
	public div(n: number): vec2;
	public div(arg0: vec2|number, arg1?: number): vec2 {
		return 	arg0 instanceof vec2 ?	new vec2(this.x/arg0.x, this.y/arg0.y) :
				isNumber(arg1) ?	new vec2(this.x/arg0, this.y/arg1) :
									new vec2(this.x/arg0, this.y/arg0);
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
					new vec2(clamp(this.x, vmin.x, vmax.x),
							 clamp(this.y, vmin.y, vmax.y)) :
					new vec2(clamp(this.x, <number>vmin, <number>vmax),
							 clamp(this.y, <number>vmin, <number>vmax));
	}

	public sum(): number { return this.x+this.y; }

	public toArray(): [number, number] {
		return [this.x, this.y];
	}

	public greaterThan(v: vec2): boolean;
	public greaterThan(x: number, y: number): boolean;
	public greaterThan(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this.x>arg0.x&&this.y>arg0.y;
		} else {
			return this.x>arg0&&this.y>arg1;
		}
	}

	public lessThan(v: vec2): boolean;
	public lessThan(x: number, y: number): boolean;
	public lessThan(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return this.x<arg0.x&&this.y<arg0.y;
		} else {
			return this.x<arg0&&this.y<arg1;
		}
	}

	public equalTo(v: vec2): boolean;
	public equalTo(x: number, y: number): boolean;
	public equalTo(arg0: vec2|number, arg1?: number): boolean {
		if(arg0 instanceof vec2) {
			return Math.abs(this.x-arg0.x)<Number.EPSILON&&
				   Math.abs(this.y-arg0.y)<Number.EPSILON;
		} else {
			return Math.abs(this.x-arg0)<Number.EPSILON&&
				   Math.abs(this.y-arg1)<Number.EPSILON;
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
		return Math.max(this.x, this.y);
	}

	public minElement(): number {
		return Math.min(this.x, this.y);
	}

	public maxElements(v: vec2): vec2;
	public maxElements(x: number, y: number): vec2;
	public maxElements(arg0: vec2|number, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			return new vec2(Math.max(this.x, arg0.x),
							Math.max(this.y, arg0.y));
		} else {
			return new vec2(Math.max(this.x, arg0),
							Math.max(this.y, arg1));
		}
	}

	public minElements(v: vec2): vec2;
	public minElements(x: number, y: number): vec2;
	public minElements(arg0: vec2|number, arg1?: number): vec2 {
		if(arg0 instanceof vec2) {
			return new vec2(Math.min(this.x, arg0.x),
							Math.min(this.y, arg0.y));
		} else {
			return new vec2(Math.min(this.x, arg0),
							Math.min(this.y, arg1));
		}
	}

	public clone(): vec2 { return new vec2().assign(this); }

	public get xx(): vec2 { return new vec2(this.x, this.x); }
	public get xy(): vec2 { return new vec2(this.x, this.y); }
	public get yx(): vec2 { return new vec2(this.y, this.x); }
	public get yy(): vec2 { return new vec2(this.y, this.y); }
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

	get x(): number { return this._x; }
	set x(value: number) { this._x=value; }

	get y(): number { return this._y; }
	set y(value: number) { this._y=value; }

	get z(): number { return this._z; }
	set z(value: number) { this._z=value; }

	get length(): number { return this.dot(this)**0.5; }

	assign(xyz: vec3): vec3;
	assign(xy: vec2, z: number): vec3;
	assign(x: number, yz: vec2): vec3;
	assign(x: number, y: number, z: number): vec3;
	assign(arg0: number|vec2|vec3, arg1?: number|vec2, arg2?: number): vec3 {
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

	negate(): vec3 {
		return new vec3(-this._x, -this._y, -this._z);
	}

	normalize(): vec3 {
		return this.div(this.length);
	}

	add(v: vec3): vec3;
	add(xy: vec2, z: number): vec3;
	add(x: number, yz: vec2): vec3;
	add(x: number, y: number, z: number): vec3;
	add(n: number): vec3;
	add(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	sub(v: vec3): vec3;
	sub(xy: vec2, z: number): vec3;
	sub(x: number, yz: vec2): vec3;
	sub(x: number, y: number, z: number): vec3;
	sub(n: number): vec3;
	sub(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	mul(m: mat3): vec3;
	mul(v: vec3): vec3;
	mul(xy: vec2, z: number): vec3;
	mul(x: number, yz: vec2): vec3;
	mul(x: number, y: number, z: number): vec3;
	mul(n: number): vec3;
	mul(arg0: mat3|vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	div(v: vec3): vec3;
	div(xy: vec2, z: number): vec3;
	div(x: number, yz: vec2): vec3;
	div(x: number, y: number, z: number): vec3;
	div(n: number): vec3;
	div(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	dot(v: vec3): number;
	dot(xy: vec2, z: number): number;
	dot(x: number, yx: vec2): number;
	dot(x: number, y: number, z: number): number;
	dot(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): number {
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

	cross(v: vec3): vec3;
	cross(xy: vec2, z: number): vec3;
	cross(x: number, yx: vec2): vec3;
	cross(x: number, y: number, z: number): vec3;
	cross(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	clamp(vmin: vec3, vmax: vec3): vec3;
	clamp(vmin: number, vmax: number): vec3;
	clamp(vmin: vec3|number, vmax: vec3|number): vec3 {
		return 	vmin instanceof vec3 && vmax instanceof vec3 ?
					new vec3(clamp(this._x, vmin.x, vmax.x),
							 clamp(this._y, vmin.y, vmax.y),
							 clamp(this._z, vmin.z, vmax.z)) :
					new vec3(clamp(this._x, <number>vmin, <number>vmax),
							 clamp(this._y, <number>vmin, <number>vmax), 
							 clamp(this._z, <number>vmin, <number>vmax));
	}

	sum(): number { return this._x+this._y+this._z; }
	
	toArray(): [number, number, number] {
		return [this._x, this._y, this._z];
	}

	greaterThan(v: vec3): boolean;
	greaterThan(xy: vec2, z: number): boolean;
	greaterThan(x: number, yz: vec2): boolean;
	greaterThan(x: number, y: number, z: number): boolean;
	greaterThan(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
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

	lessThan(v: vec3): boolean;
	lessThan(xy: vec2, z: number): boolean;
	lessThan(x: number, yz: vec2): boolean;	
	lessThan(x: number, y: number, z: number): boolean;
	lessThan(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
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

	equalTo(v: vec3): boolean;
	equalTo(xy: vec2, z: number): boolean;
	equalTo(x: number, yz: vec2): boolean;
	equalTo(x: number, y: number, z: number): boolean;
	equalTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
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

	greaterThanOrEqualTo(v: vec3): boolean;
	greaterThanOrEqualTo(xy: vec2, z: number): boolean;
	greaterThanOrEqualTo(x: number, yz: vec2): boolean;
	greaterThanOrEqualTo(x: number, y: number, z: number): boolean;
	greaterThanOrEqualTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
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

	lessThanOrEqualTo(v: vec3): boolean;
	lessThanOrEqualTo(xy: vec2, z: number): boolean;
	lessThanOrEqualTo(x: number, yz: vec2): boolean;
	lessThanOrEqualTo(x: number, y: number, z: number): boolean;
	lessThanOrEqualTo(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): boolean {
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

	maxElement(): number {
		return Math.max(this._x, this._y, this._z);
	}

	minElement(): number {
		return Math.min(this._x, this._y, this._z);
	}

	maxElements(v: vec3): vec3;
	maxElements(xy: vec2, z: number): vec3;
	maxElements(x: number, yz: vec2): vec3;
	maxElements(x: number, y: number, z: number): vec3;
	maxElements(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	minElements(v: vec3): vec3;
	minElements(xy: vec2, z: number): vec3;
	minElements(x: number, yz: vec2): vec3;
	minElements(x: number, y: number, z: number): vec3;
	minElements(arg0: vec3|vec2|number, arg1?: vec2|number, arg2?: number): vec3 {
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

	static angleBetween(v0: vec3, v1: vec3): number;
	static angleBetween(v0: vec3, v1: vec3, ref: vec3): number;
	static angleBetween(arg0: vec3, arg1: vec3, arg2?: vec3) {
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
	
	static absoluteAngleBetween(v0: vec3, v1: vec3, ref: vec3): number {
		let signedAngle: number = this.angleBetween(v0, v1, ref);
		if (signedAngle < 0.0) return 2*Constants.PI + signedAngle;
		else return signedAngle;
	}

	get xx(): vec2 { return new vec2(this._x, this._x); }
	get xy(): vec2 { return new vec2(this._x, this._y); }
	get xz(): vec2 { return new vec2(this._x, this._z); }
	get yx(): vec2 { return new vec2(this._y, this._x); }
	get yy(): vec2 { return new vec2(this._y, this._y); }
	get yz(): vec2 { return new vec2(this._y, this._z); }
	get zx(): vec2 { return new vec2(this._z, this._x); }
	get zy(): vec2 { return new vec2(this._z, this._y); }
	get zz(): vec2 { return new vec2(this._z, this._z); }
	
	get xxx(): vec3 { return new vec3(this._x, this._x, this._x); }
	get xxy(): vec3 { return new vec3(this._x, this._x, this._y); }
	get xxz(): vec3 { return new vec3(this._x, this._x, this._z); }
	get xyx(): vec3 { return new vec3(this._x, this._y, this._x); }
	get xyy(): vec3 { return new vec3(this._x, this._y, this._y); }
	get xyz(): vec3 { return new vec3(this._x, this._y, this._z); }
	get xzx(): vec3 { return new vec3(this._x, this._z, this._x); }
	get xzy(): vec3 { return new vec3(this._x, this._z, this._y); }
	get xzz(): vec3 { return new vec3(this._x, this._z, this._z); }
	get yxx(): vec3 { return new vec3(this._y, this._x, this._x); }
	get yxy(): vec3 { return new vec3(this._y, this._x, this._y); }
	get yxz(): vec3 { return new vec3(this._y, this._x, this._z); }
	get yyx(): vec3 { return new vec3(this._y, this._y, this._x); }
	get yyy(): vec3 { return new vec3(this._y, this._y, this._y); }
	get yyz(): vec3 { return new vec3(this._y, this._y, this._z); }
	get yzx(): vec3 { return new vec3(this._y, this._z, this._x); }
	get yzy(): vec3 { return new vec3(this._y, this._z, this._y); }
	get yzz(): vec3 { return new vec3(this._y, this._z, this._z); }
	get zxx(): vec3 { return new vec3(this._z, this._x, this._x); }
	get zxy(): vec3 { return new vec3(this._z, this._x, this._y); }
	get zxz(): vec3 { return new vec3(this._z, this._x, this._z); }
	get zyx(): vec3 { return new vec3(this._z, this._y, this._x); }
	get zyy(): vec3 { return new vec3(this._z, this._y, this._y); }
	get zyz(): vec3 { return new vec3(this._z, this._y, this._z); }
	get zzx(): vec3 { return new vec3(this._z, this._z, this._x); }
	get zzy(): vec3 { return new vec3(this._z, this._z, this._y); }
	get zzz(): vec3 { return new vec3(this._z, this._z, this._z); }
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

	get x(): number { return this._x; }
	set x(value: number) { this._x=value; }

	get y(): number { return this._y; }
	set y(value: number) { this._y=value; }

	get z(): number { return this._z; }
	set z(value: number) { this._z=value; }

	get w(): number { return this._w; }
	set w(value: number) { this._w=value; }

	get length(): number { return this.dot(this)**0.5; }

	assign(xyzw: vec4): vec4;
	assign(xyz: vec3, w: number): vec4;
	assign(xy: vec2, zw: vec2): vec4;
	assign(xy: vec2, z: number, w: number): vec4;
	assign(x: number, yzw: vec3): vec4;
	assign(x: number, yz: vec2, w: number): vec4;
	assign(x: number, y: number, zw: vec2): vec4;
	assign(x: number, y: number, z: number, w: number): vec4;
	assign(arg0: number|vec2|vec3|vec4, arg1?: number|vec2|vec3, arg2?: number|vec2, arg3?: number): vec4 {
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

	negate(): vec4 {
		return new vec4(-this._x, -this._y, -this._z, -this._w);
	}

	normalize(): vec4 {
		return this.div(this.length);
	}

	add(v: vec4): vec4;
	add(xyz: vec3, w: number): vec4;
	add(xy: vec2, zw: vec2): vec4;
	add(xy: vec2, z: number, w: number): vec4;
	add(x: number, yzw: vec3): vec4;
	add(x: number, yz: vec2, w: number): vec4;
	add(x: number, y: number, zw: vec2): vec4;
	add(x: number, y: number, z: number, w: number): vec4;
	add(n: number): vec4;
	add(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	sub(v: vec4): vec4;
	sub(xyz: vec3, w: number): vec4;
	sub(xy: vec2, zw: vec2): vec4;
	sub(xy: vec2, z: number, w: number): vec4;
	sub(x: number, yzw: vec3): vec4;
	sub(x: number, yz: vec2, w: number): vec4;
	sub(x: number, y: number, zw: vec2): vec4;
	sub(x: number, y: number, z: number, w: number): vec4;
	sub(n: number): vec4;
	sub(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	mul(m: mat4): vec4;
	mul(v: vec4): vec4;
	mul(xyz: vec3, w: number): vec4;
	mul(xy: vec2, zw: vec2): vec4;
	mul(xy: vec2, z: number, w: number): vec4;
	mul(x: number, yzw: vec3): vec4;
	mul(x: number, yz: vec2, w: number): vec4;
	mul(x: number, y: number, zw: vec2): vec4;
	mul(x: number, y: number, z: number, w: number): vec4;
	mul(n: number): vec4;
	mul(arg0: mat4|vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	div(v: vec4): vec4;
	div(xyz: vec3, w: number): vec4;
	div(xy: vec2, zw: vec2): vec4;
	div(xy: vec2, z: number, w: number): vec4;
	div(x: number, yzw: vec3): vec4;
	div(x: number, yz: vec2, w: number): vec4;
	div(x: number, y: number, zw: vec2): vec4;
	div(x: number, y: number, z: number, w: number): vec4;
	div(n: number): vec4;
	div(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	dot(v: vec4): number;
	dot(xyz: vec3, w: number): number;
	dot(xy: vec2, zw: vec2): number;
	dot(xy: vec2, z: number, w: number): number;
	dot(x: number, yzw: vec3): number;
	dot(x: number, yz: vec2, w: number): number;
	dot(x: number, y: number, zw: vec2): number;
	dot(x: number, y: number, z: number, w: number): number;
	dot(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): number {
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

	clamp(vmin: vec4, vmax: vec4): vec4;
	clamp(vmin: number, vmax: number): vec4;
	clamp(vmin: vec4|number, vmax: vec4|number): vec4 {
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

	sum(): number { return this._x+this._y+this._z+this._w; }
		
	toArray(): [number, number, number, number] {
		return [this._x, this._y, this._z, this._w];
	}

	greaterThan(v: vec4): boolean;
	greaterThan(xyz: vec3, w: number): boolean;
	greaterThan(xy: vec2, zw: vec2): boolean;
	greaterThan(xy: vec2, z: number, w: number): boolean;
	greaterThan(x: number, yzw: vec3): boolean;
	greaterThan(x: number, yz: vec2, w: number): boolean;
	greaterThan(x: number, y: number, zw: vec2): boolean;
	greaterThan(x: number, y: number, z: number, w: number): boolean;
	greaterThan(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
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

	lessThan(v: vec4): boolean;
	lessThan(xyz: vec3, w: number): boolean;
	lessThan(xy: vec2, zw: vec2): boolean;
	lessThan(xy: vec2, z: number, w: number): boolean;
	lessThan(x: number, yzw: vec3): boolean;
	lessThan(x: number, yz: vec2, w: number): boolean;
	lessThan(x: number, y: number, zw: vec2): boolean;
	lessThan(x: number, y: number, z: number, w: number): boolean;
	lessThan(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
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

	equalTo(v: vec4): boolean;
	equalTo(xyz: vec3, w: number): boolean;
	equalTo(xy: vec2, zw: vec2): boolean;
	equalTo(xy: vec2, z: number, w: number): boolean;
	equalTo(x: number, yzw: vec3): boolean;
	equalTo(x: number, yz: vec2, w: number): boolean;
	equalTo(x: number, y: number, zw: vec2): boolean;
	equalTo(x: number, y: number, z: number, w: number): boolean;
	equalTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
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

	greaterThanOrEqualTo(v: vec4): boolean;
	greaterThanOrEqualTo(xyz: vec3, w: number): boolean;
	greaterThanOrEqualTo(xy: vec2, zw: vec2): boolean;
	greaterThanOrEqualTo(xy: vec2, z: number, w: number): boolean;
	greaterThanOrEqualTo(x: number, yzw: vec3): boolean;
	greaterThanOrEqualTo(x: number, yz: vec2, w: number): boolean;
	greaterThanOrEqualTo(x: number, y: number, zw: vec2): boolean;
	greaterThanOrEqualTo(x: number, y: number, z: number, w: number): boolean;
	greaterThanOrEqualTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
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

	lessThanOrEqualTo(v: vec4): boolean;
	lessThanOrEqualTo(xyz: vec3, w: number): boolean;
	lessThanOrEqualTo(xy: vec2, zw: vec2): boolean;
	lessThanOrEqualTo(xy: vec2, z: number, w: number): boolean;
	lessThanOrEqualTo(x: number, yzw: vec3): boolean;
	lessThanOrEqualTo(x: number, yz: vec2, w: number): boolean;
	lessThanOrEqualTo(x: number, y: number, zw: vec2): boolean;
	lessThanOrEqualTo(x: number, y: number, z: number, w: number): boolean;
	lessThanOrEqualTo(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): boolean {
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

	maxElement(): number {
		return Math.max(this._x, this._y, this._z, this._w);
	}

	minElement(): number {
		return Math.min(this._x, this._y, this._z, this._w);
	}

	maxElements(v: vec4): vec4;
	maxElements(xyz: vec3, w: number): vec4;
	maxElements(xy: vec2, zw: vec2): vec4;
	maxElements(xy: vec2, z: number, w: number): vec4;
	maxElements(x: number, yzw: vec3): vec4;
	maxElements(x: number, yz: vec2, w: number): vec4;
	maxElements(x: number, y: number, zw: vec2): vec4;
	maxElements(x: number, y: number, z: number, w: number): vec4;
	maxElements(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	minElements(v: vec4): vec4;
	minElements(xyz: vec3, w: number): vec4;
	minElements(xy: vec2, zw: vec2): vec4;
	minElements(xy: vec2, z: number, w: number): vec4;
	minElements(x: number, yzw: vec3): vec4;
	minElements(x: number, yz: vec2, w: number): vec4;
	minElements(x: number, y: number, zw: vec2): vec4;
	minElements(x: number, y: number, z: number, w: number): vec4;
	minElements(arg0: vec4|vec3|vec2|number, arg1?: vec3|vec2|number, arg2?: vec2|number, arg3?: number): vec4 {
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

	get xx(): vec2 { return new vec2(this._x, this._x); }
	get xy(): vec2 { return new vec2(this._x, this._y); }
	get xz(): vec2 { return new vec2(this._x, this._z); }
	get xw(): vec2 { return new vec2(this._x, this._w); }
	get yx(): vec2 { return new vec2(this._y, this._x); }
	get yy(): vec2 { return new vec2(this._y, this._y); }
	get yz(): vec2 { return new vec2(this._y, this._z); }
	get yw(): vec2 { return new vec2(this._y, this._w); }
	get zx(): vec2 { return new vec2(this._z, this._x); }
	get zy(): vec2 { return new vec2(this._z, this._y); }
	get zz(): vec2 { return new vec2(this._z, this._z); }
	get zw(): vec2 { return new vec2(this._z, this._w); }
	get wx(): vec2 { return new vec2(this._w, this._x); }
	get wy(): vec2 { return new vec2(this._w, this._y); }
	get wz(): vec2 { return new vec2(this._w, this._z); }
	get ww(): vec2 { return new vec2(this._w, this._w); }
	
	get xxx(): vec3 { return new vec3(this._x, this._x, this._x); }
	get xxy(): vec3 { return new vec3(this._x, this._x, this._y); }
	get xxz(): vec3 { return new vec3(this._x, this._x, this._z); }
	get xxw(): vec3 { return new vec3(this._x, this._x, this._w); }
	get xyx(): vec3 { return new vec3(this._x, this._y, this._x); }
	get xyy(): vec3 { return new vec3(this._x, this._y, this._y); }
	get xyz(): vec3 { return new vec3(this._x, this._y, this._z); }
	get xyw(): vec3 { return new vec3(this._x, this._y, this._w); }
	get xzx(): vec3 { return new vec3(this._x, this._z, this._x); }
	get xzy(): vec3 { return new vec3(this._x, this._z, this._y); }
	get xzz(): vec3 { return new vec3(this._x, this._z, this._z); }
	get xzw(): vec3 { return new vec3(this._x, this._z, this._w); }
	get xwx(): vec3 { return new vec3(this._x, this._w, this._x); }
	get xwy(): vec3 { return new vec3(this._x, this._w, this._y); }
	get xwz(): vec3 { return new vec3(this._x, this._w, this._z); }
	get xww(): vec3 { return new vec3(this._x, this._w, this._w); }
	get yxx(): vec3 { return new vec3(this._y, this._x, this._x); }
	get yxy(): vec3 { return new vec3(this._y, this._x, this._y); }
	get yxz(): vec3 { return new vec3(this._y, this._x, this._z); }
	get yxw(): vec3 { return new vec3(this._y, this._x, this._w); }
	get yyx(): vec3 { return new vec3(this._y, this._y, this._x); }
	get yyy(): vec3 { return new vec3(this._y, this._y, this._y); }
	get yyz(): vec3 { return new vec3(this._y, this._y, this._z); }
	get yyw(): vec3 { return new vec3(this._y, this._y, this._w); }
	get yzx(): vec3 { return new vec3(this._y, this._z, this._x); }
	get yzy(): vec3 { return new vec3(this._y, this._z, this._y); }
	get yzz(): vec3 { return new vec3(this._y, this._z, this._z); }
	get yzw(): vec3 { return new vec3(this._y, this._z, this._w); }
	get ywx(): vec3 { return new vec3(this._y, this._w, this._x); }
	get ywy(): vec3 { return new vec3(this._y, this._w, this._y); }
	get ywz(): vec3 { return new vec3(this._y, this._w, this._z); }
	get yww(): vec3 { return new vec3(this._y, this._w, this._w); }
	get zxx(): vec3 { return new vec3(this._z, this._x, this._x); }
	get zxy(): vec3 { return new vec3(this._z, this._x, this._y); }
	get zxz(): vec3 { return new vec3(this._z, this._x, this._z); }
	get zxw(): vec3 { return new vec3(this._z, this._x, this._w); }
	get zyx(): vec3 { return new vec3(this._z, this._y, this._x); }
	get zyy(): vec3 { return new vec3(this._z, this._y, this._y); }
	get zyz(): vec3 { return new vec3(this._z, this._y, this._z); }
	get zyw(): vec3 { return new vec3(this._z, this._y, this._w); }
	get zzx(): vec3 { return new vec3(this._z, this._z, this._x); }
	get zzy(): vec3 { return new vec3(this._z, this._z, this._y); }
	get zzz(): vec3 { return new vec3(this._z, this._z, this._z); }
	get zzw(): vec3 { return new vec3(this._z, this._z, this._w); }
	get zwx(): vec3 { return new vec3(this._z, this._w, this._x); }
	get zwy(): vec3 { return new vec3(this._z, this._w, this._y); }
	get zwz(): vec3 { return new vec3(this._z, this._w, this._z); }
	get zww(): vec3 { return new vec3(this._z, this._w, this._w); }
	get wxx(): vec3 { return new vec3(this._w, this._x, this._x); }
	get wxy(): vec3 { return new vec3(this._w, this._x, this._y); }
	get wxz(): vec3 { return new vec3(this._w, this._x, this._z); }
	get wxw(): vec3 { return new vec3(this._w, this._x, this._w); }
	get wyx(): vec3 { return new vec3(this._w, this._y, this._x); }
	get wyy(): vec3 { return new vec3(this._w, this._y, this._y); }
	get wyz(): vec3 { return new vec3(this._w, this._y, this._z); }
	get wyw(): vec3 { return new vec3(this._w, this._y, this._w); }
	get wzx(): vec3 { return new vec3(this._w, this._z, this._x); }
	get wzy(): vec3 { return new vec3(this._w, this._z, this._y); }
	get wzz(): vec3 { return new vec3(this._w, this._z, this._z); }
	get wzw(): vec3 { return new vec3(this._w, this._z, this._w); }
	get wwx(): vec3 { return new vec3(this._w, this._w, this._x); }
	get wwy(): vec3 { return new vec3(this._w, this._w, this._y); }
	get wwz(): vec3 { return new vec3(this._w, this._w, this._z); }
	get www(): vec3 { return new vec3(this._w, this._w, this._w); }

	get xxxx(): vec4 { return new vec4(this._x, this._x, this._x, this._x); }
	get xxxy(): vec4 { return new vec4(this._x, this._x, this._x, this._y); }
	get xxxz(): vec4 { return new vec4(this._x, this._x, this._x, this._z); }
	get xxxw(): vec4 { return new vec4(this._x, this._x, this._x, this._w); }
	get xxyx(): vec4 { return new vec4(this._x, this._x, this._y, this._x); }
	get xxyy(): vec4 { return new vec4(this._x, this._x, this._y, this._y); }
	get xxyz(): vec4 { return new vec4(this._x, this._x, this._y, this._z); }
	get xxyw(): vec4 { return new vec4(this._x, this._x, this._y, this._w); }
	get xxzx(): vec4 { return new vec4(this._x, this._x, this._z, this._x); }
	get xxzy(): vec4 { return new vec4(this._x, this._x, this._z, this._y); }
	get xxzz(): vec4 { return new vec4(this._x, this._x, this._z, this._z); }
	get xxzw(): vec4 { return new vec4(this._x, this._x, this._z, this._w); }
	get xxwx(): vec4 { return new vec4(this._x, this._x, this._w, this._x); }
	get xxwy(): vec4 { return new vec4(this._x, this._x, this._w, this._y); }
	get xxwz(): vec4 { return new vec4(this._x, this._x, this._w, this._z); }
	get xxww(): vec4 { return new vec4(this._x, this._x, this._w, this._w); }
	get xyxx(): vec4 { return new vec4(this._x, this._y, this._x, this._x); }
	get xyxy(): vec4 { return new vec4(this._x, this._y, this._x, this._y); }
	get xyxz(): vec4 { return new vec4(this._x, this._y, this._x, this._z); }
	get xyxw(): vec4 { return new vec4(this._x, this._y, this._x, this._w); }
	get xyyx(): vec4 { return new vec4(this._x, this._y, this._y, this._x); }
	get xyyy(): vec4 { return new vec4(this._x, this._y, this._y, this._y); }
	get xyyz(): vec4 { return new vec4(this._x, this._y, this._y, this._z); }
	get xyyw(): vec4 { return new vec4(this._x, this._y, this._y, this._w); }
	get xyzx(): vec4 { return new vec4(this._x, this._y, this._z, this._x); }
	get xyzy(): vec4 { return new vec4(this._x, this._y, this._z, this._y); }
	get xyzz(): vec4 { return new vec4(this._x, this._y, this._z, this._z); }
	get xyzw(): vec4 { return new vec4(this._x, this._y, this._z, this._w); }
	get xywx(): vec4 { return new vec4(this._x, this._y, this._w, this._x); }
	get xywy(): vec4 { return new vec4(this._x, this._y, this._w, this._y); }
	get xywz(): vec4 { return new vec4(this._x, this._y, this._w, this._z); }
	get xyww(): vec4 { return new vec4(this._x, this._y, this._w, this._w); }
	get xzxx(): vec4 { return new vec4(this._x, this._z, this._x, this._x); }
	get xzxy(): vec4 { return new vec4(this._x, this._z, this._x, this._y); }
	get xzxz(): vec4 { return new vec4(this._x, this._z, this._x, this._z); }
	get xzxw(): vec4 { return new vec4(this._x, this._z, this._x, this._w); }
	get xzyx(): vec4 { return new vec4(this._x, this._z, this._y, this._x); }
	get xzyy(): vec4 { return new vec4(this._x, this._z, this._y, this._y); }
	get xzyz(): vec4 { return new vec4(this._x, this._z, this._y, this._z); }
	get xzyw(): vec4 { return new vec4(this._x, this._z, this._y, this._w); }
	get xzzx(): vec4 { return new vec4(this._x, this._z, this._z, this._x); }
	get xzzy(): vec4 { return new vec4(this._x, this._z, this._z, this._y); }
	get xzzz(): vec4 { return new vec4(this._x, this._z, this._z, this._z); }
	get xzzw(): vec4 { return new vec4(this._x, this._z, this._z, this._w); }
	get xzwx(): vec4 { return new vec4(this._x, this._z, this._w, this._x); }
	get xzwy(): vec4 { return new vec4(this._x, this._z, this._w, this._y); }
	get xzwz(): vec4 { return new vec4(this._x, this._z, this._w, this._z); }
	get xzww(): vec4 { return new vec4(this._x, this._z, this._w, this._w); }
	get xwxx(): vec4 { return new vec4(this._x, this._w, this._x, this._x); }
	get xwxy(): vec4 { return new vec4(this._x, this._w, this._x, this._y); }
	get xwxz(): vec4 { return new vec4(this._x, this._w, this._x, this._z); }
	get xwxw(): vec4 { return new vec4(this._x, this._w, this._x, this._w); }
	get xwyx(): vec4 { return new vec4(this._x, this._w, this._y, this._x); }
	get xwyy(): vec4 { return new vec4(this._x, this._w, this._y, this._y); }
	get xwyz(): vec4 { return new vec4(this._x, this._w, this._y, this._z); }
	get xwyw(): vec4 { return new vec4(this._x, this._w, this._y, this._w); }
	get xwzx(): vec4 { return new vec4(this._x, this._w, this._z, this._x); }
	get xwzy(): vec4 { return new vec4(this._x, this._w, this._z, this._y); }
	get xwzz(): vec4 { return new vec4(this._x, this._w, this._z, this._z); }
	get xwzw(): vec4 { return new vec4(this._x, this._w, this._z, this._w); }
	get xwwx(): vec4 { return new vec4(this._x, this._w, this._w, this._x); }
	get xwwy(): vec4 { return new vec4(this._x, this._w, this._w, this._y); }
	get xwwz(): vec4 { return new vec4(this._x, this._w, this._w, this._z); }
	get xwww(): vec4 { return new vec4(this._x, this._w, this._w, this._w); }

	get yxxx(): vec4 { return new vec4(this._y, this._x, this._x, this._x); }
	get yxxy(): vec4 { return new vec4(this._y, this._x, this._x, this._y); }
	get yxxz(): vec4 { return new vec4(this._y, this._x, this._x, this._z); }
	get yxxw(): vec4 { return new vec4(this._y, this._x, this._x, this._w); }
	get yxyx(): vec4 { return new vec4(this._y, this._x, this._y, this._x); }
	get yxyy(): vec4 { return new vec4(this._y, this._x, this._y, this._y); }
	get yxyz(): vec4 { return new vec4(this._y, this._x, this._y, this._z); }
	get yxyw(): vec4 { return new vec4(this._y, this._x, this._y, this._w); }
	get yxzx(): vec4 { return new vec4(this._y, this._x, this._z, this._x); }
	get yxzy(): vec4 { return new vec4(this._y, this._x, this._z, this._y); }
	get yxzz(): vec4 { return new vec4(this._y, this._x, this._z, this._z); }
	get yxzw(): vec4 { return new vec4(this._y, this._x, this._z, this._w); }
	get yxwx(): vec4 { return new vec4(this._y, this._x, this._w, this._x); }
	get yxwy(): vec4 { return new vec4(this._y, this._x, this._w, this._y); }
	get yxwz(): vec4 { return new vec4(this._y, this._x, this._w, this._z); }
	get yxww(): vec4 { return new vec4(this._y, this._x, this._w, this._w); }
	get yyxx(): vec4 { return new vec4(this._y, this._y, this._x, this._x); }
	get yyxy(): vec4 { return new vec4(this._y, this._y, this._x, this._y); }
	get yyxz(): vec4 { return new vec4(this._y, this._y, this._x, this._z); }
	get yyxw(): vec4 { return new vec4(this._y, this._y, this._x, this._w); }
	get yyyx(): vec4 { return new vec4(this._y, this._y, this._y, this._x); }
	get yyyy(): vec4 { return new vec4(this._y, this._y, this._y, this._y); }
	get yyyz(): vec4 { return new vec4(this._y, this._y, this._y, this._z); }
	get yyyw(): vec4 { return new vec4(this._y, this._y, this._y, this._w); }
	get yyzx(): vec4 { return new vec4(this._y, this._y, this._z, this._x); }
	get yyzy(): vec4 { return new vec4(this._y, this._y, this._z, this._y); }
	get yyzz(): vec4 { return new vec4(this._y, this._y, this._z, this._z); }
	get yyzw(): vec4 { return new vec4(this._y, this._y, this._z, this._w); }
	get yywx(): vec4 { return new vec4(this._y, this._y, this._w, this._x); }
	get yywy(): vec4 { return new vec4(this._y, this._y, this._w, this._y); }
	get yywz(): vec4 { return new vec4(this._y, this._y, this._w, this._z); }
	get yyww(): vec4 { return new vec4(this._y, this._y, this._w, this._w); }
	get yzxx(): vec4 { return new vec4(this._y, this._z, this._x, this._x); }
	get yzxy(): vec4 { return new vec4(this._y, this._z, this._x, this._y); }
	get yzxz(): vec4 { return new vec4(this._y, this._z, this._x, this._z); }
	get yzxw(): vec4 { return new vec4(this._y, this._z, this._x, this._w); }
	get yzyx(): vec4 { return new vec4(this._y, this._z, this._y, this._x); }
	get yzyy(): vec4 { return new vec4(this._y, this._z, this._y, this._y); }
	get yzyz(): vec4 { return new vec4(this._y, this._z, this._y, this._z); }
	get yzyw(): vec4 { return new vec4(this._y, this._z, this._y, this._w); }
	get yzzx(): vec4 { return new vec4(this._y, this._z, this._z, this._x); }
	get yzzy(): vec4 { return new vec4(this._y, this._z, this._z, this._y); }
	get yzzz(): vec4 { return new vec4(this._y, this._z, this._z, this._z); }
	get yzzw(): vec4 { return new vec4(this._y, this._z, this._z, this._w); }
	get yzwx(): vec4 { return new vec4(this._y, this._z, this._w, this._x); }
	get yzwy(): vec4 { return new vec4(this._y, this._z, this._w, this._y); }
	get yzwz(): vec4 { return new vec4(this._y, this._z, this._w, this._z); }
	get yzww(): vec4 { return new vec4(this._y, this._z, this._w, this._w); }
	get ywxx(): vec4 { return new vec4(this._y, this._w, this._x, this._x); }
	get ywxy(): vec4 { return new vec4(this._y, this._w, this._x, this._y); }
	get ywxz(): vec4 { return new vec4(this._y, this._w, this._x, this._z); }
	get ywxw(): vec4 { return new vec4(this._y, this._w, this._x, this._w); }
	get ywyx(): vec4 { return new vec4(this._y, this._w, this._y, this._x); }
	get ywyy(): vec4 { return new vec4(this._y, this._w, this._y, this._y); }
	get ywyz(): vec4 { return new vec4(this._y, this._w, this._y, this._z); }
	get ywyw(): vec4 { return new vec4(this._y, this._w, this._y, this._w); }
	get ywzx(): vec4 { return new vec4(this._y, this._w, this._z, this._x); }
	get ywzy(): vec4 { return new vec4(this._y, this._w, this._z, this._y); }
	get ywzz(): vec4 { return new vec4(this._y, this._w, this._z, this._z); }
	get ywzw(): vec4 { return new vec4(this._y, this._w, this._z, this._w); }
	get ywwx(): vec4 { return new vec4(this._y, this._w, this._w, this._x); }
	get ywwy(): vec4 { return new vec4(this._y, this._w, this._w, this._y); }
	get ywwz(): vec4 { return new vec4(this._y, this._w, this._w, this._z); }
	get ywww(): vec4 { return new vec4(this._y, this._w, this._w, this._w); }

	get zxxx(): vec4 { return new vec4(this._z, this._x, this._x, this._x); }
	get zxxy(): vec4 { return new vec4(this._z, this._x, this._x, this._y); }
	get zxxz(): vec4 { return new vec4(this._z, this._x, this._x, this._z); }
	get zxxw(): vec4 { return new vec4(this._z, this._x, this._x, this._w); }
	get zxyx(): vec4 { return new vec4(this._z, this._x, this._y, this._x); }
	get zxyy(): vec4 { return new vec4(this._z, this._x, this._y, this._y); }
	get zxyz(): vec4 { return new vec4(this._z, this._x, this._y, this._z); }
	get zxyw(): vec4 { return new vec4(this._z, this._x, this._y, this._w); }
	get zxzx(): vec4 { return new vec4(this._z, this._x, this._z, this._x); }
	get zxzy(): vec4 { return new vec4(this._z, this._x, this._z, this._y); }
	get zxzz(): vec4 { return new vec4(this._z, this._x, this._z, this._z); }
	get zxzw(): vec4 { return new vec4(this._z, this._x, this._z, this._w); }
	get zxwx(): vec4 { return new vec4(this._z, this._x, this._w, this._x); }
	get zxwy(): vec4 { return new vec4(this._z, this._x, this._w, this._y); }
	get zxwz(): vec4 { return new vec4(this._z, this._x, this._w, this._z); }
	get zxww(): vec4 { return new vec4(this._z, this._x, this._w, this._w); }
	get zyxx(): vec4 { return new vec4(this._z, this._y, this._x, this._x); }
	get zyxy(): vec4 { return new vec4(this._z, this._y, this._x, this._y); }
	get zyxz(): vec4 { return new vec4(this._z, this._y, this._x, this._z); }
	get zyxw(): vec4 { return new vec4(this._z, this._y, this._x, this._w); }
	get zyyx(): vec4 { return new vec4(this._z, this._y, this._y, this._x); }
	get zyyy(): vec4 { return new vec4(this._z, this._y, this._y, this._y); }
	get zyyz(): vec4 { return new vec4(this._z, this._y, this._y, this._z); }
	get zyyw(): vec4 { return new vec4(this._z, this._y, this._y, this._w); }
	get zyzx(): vec4 { return new vec4(this._z, this._y, this._z, this._x); }
	get zyzy(): vec4 { return new vec4(this._z, this._y, this._z, this._y); }
	get zyzz(): vec4 { return new vec4(this._z, this._y, this._z, this._z); }
	get zyzw(): vec4 { return new vec4(this._z, this._y, this._z, this._w); }
	get zywx(): vec4 { return new vec4(this._z, this._y, this._w, this._x); }
	get zywy(): vec4 { return new vec4(this._z, this._y, this._w, this._y); }
	get zywz(): vec4 { return new vec4(this._z, this._y, this._w, this._z); }
	get zyww(): vec4 { return new vec4(this._z, this._y, this._w, this._w); }
	get zzxx(): vec4 { return new vec4(this._z, this._z, this._x, this._x); }
	get zzxy(): vec4 { return new vec4(this._z, this._z, this._x, this._y); }
	get zzxz(): vec4 { return new vec4(this._z, this._z, this._x, this._z); }
	get zzxw(): vec4 { return new vec4(this._z, this._z, this._x, this._w); }
	get zzyx(): vec4 { return new vec4(this._z, this._z, this._y, this._x); }
	get zzyy(): vec4 { return new vec4(this._z, this._z, this._y, this._y); }
	get zzyz(): vec4 { return new vec4(this._z, this._z, this._y, this._z); }
	get zzyw(): vec4 { return new vec4(this._z, this._z, this._y, this._w); }
	get zzzx(): vec4 { return new vec4(this._z, this._z, this._z, this._x); }
	get zzzy(): vec4 { return new vec4(this._z, this._z, this._z, this._y); }
	get zzzz(): vec4 { return new vec4(this._z, this._z, this._z, this._z); }
	get zzzw(): vec4 { return new vec4(this._z, this._z, this._z, this._w); }
	get zzwx(): vec4 { return new vec4(this._z, this._z, this._w, this._x); }
	get zzwy(): vec4 { return new vec4(this._z, this._z, this._w, this._y); }
	get zzwz(): vec4 { return new vec4(this._z, this._z, this._w, this._z); }
	get zzww(): vec4 { return new vec4(this._z, this._z, this._w, this._w); }
	get zwxx(): vec4 { return new vec4(this._z, this._w, this._x, this._x); }
	get zwxy(): vec4 { return new vec4(this._z, this._w, this._x, this._y); }
	get zwxz(): vec4 { return new vec4(this._z, this._w, this._x, this._z); }
	get zwxw(): vec4 { return new vec4(this._z, this._w, this._x, this._w); }
	get zwyx(): vec4 { return new vec4(this._z, this._w, this._y, this._x); }
	get zwyy(): vec4 { return new vec4(this._z, this._w, this._y, this._y); }
	get zwyz(): vec4 { return new vec4(this._z, this._w, this._y, this._z); }
	get zwyw(): vec4 { return new vec4(this._z, this._w, this._y, this._w); }
	get zwzx(): vec4 { return new vec4(this._z, this._w, this._z, this._x); }
	get zwzy(): vec4 { return new vec4(this._z, this._w, this._z, this._y); }
	get zwzz(): vec4 { return new vec4(this._z, this._w, this._z, this._z); }
	get zwzw(): vec4 { return new vec4(this._z, this._w, this._z, this._w); }
	get zwwx(): vec4 { return new vec4(this._z, this._w, this._w, this._x); }
	get zwwy(): vec4 { return new vec4(this._z, this._w, this._w, this._y); }
	get zwwz(): vec4 { return new vec4(this._z, this._w, this._w, this._z); }
	get zwww(): vec4 { return new vec4(this._z, this._w, this._w, this._w); }

	get wxxx(): vec4 { return new vec4(this._w, this._x, this._x, this._x); }
	get wxxy(): vec4 { return new vec4(this._w, this._x, this._x, this._y); }
	get wxxz(): vec4 { return new vec4(this._w, this._x, this._x, this._z); }
	get wxxw(): vec4 { return new vec4(this._w, this._x, this._x, this._w); }
	get wxyx(): vec4 { return new vec4(this._w, this._x, this._y, this._x); }
	get wxyy(): vec4 { return new vec4(this._w, this._x, this._y, this._y); }
	get wxyz(): vec4 { return new vec4(this._w, this._x, this._y, this._z); }
	get wxyw(): vec4 { return new vec4(this._w, this._x, this._y, this._w); }
	get wxzx(): vec4 { return new vec4(this._w, this._x, this._z, this._x); }
	get wxzy(): vec4 { return new vec4(this._w, this._x, this._z, this._y); }
	get wxzz(): vec4 { return new vec4(this._w, this._x, this._z, this._z); }
	get wxzw(): vec4 { return new vec4(this._w, this._x, this._z, this._w); }
	get wxwx(): vec4 { return new vec4(this._w, this._x, this._w, this._x); }
	get wxwy(): vec4 { return new vec4(this._w, this._x, this._w, this._y); }
	get wxwz(): vec4 { return new vec4(this._w, this._x, this._w, this._z); }
	get wxww(): vec4 { return new vec4(this._w, this._x, this._w, this._w); }
	get wyxx(): vec4 { return new vec4(this._w, this._y, this._x, this._x); }
	get wyxy(): vec4 { return new vec4(this._w, this._y, this._x, this._y); }
	get wyxz(): vec4 { return new vec4(this._w, this._y, this._x, this._z); }
	get wyxw(): vec4 { return new vec4(this._w, this._y, this._x, this._w); }
	get wyyx(): vec4 { return new vec4(this._w, this._y, this._y, this._x); }
	get wyyy(): vec4 { return new vec4(this._w, this._y, this._y, this._y); }
	get wyyz(): vec4 { return new vec4(this._w, this._y, this._y, this._z); }
	get wyyw(): vec4 { return new vec4(this._w, this._y, this._y, this._w); }
	get wyzx(): vec4 { return new vec4(this._w, this._y, this._z, this._x); }
	get wyzy(): vec4 { return new vec4(this._w, this._y, this._z, this._y); }
	get wyzz(): vec4 { return new vec4(this._w, this._y, this._z, this._z); }
	get wyzw(): vec4 { return new vec4(this._w, this._y, this._z, this._w); }
	get wywx(): vec4 { return new vec4(this._w, this._y, this._w, this._x); }
	get wywy(): vec4 { return new vec4(this._w, this._y, this._w, this._y); }
	get wywz(): vec4 { return new vec4(this._w, this._y, this._w, this._z); }
	get wyww(): vec4 { return new vec4(this._w, this._y, this._w, this._w); }
	get wzxx(): vec4 { return new vec4(this._w, this._z, this._x, this._x); }
	get wzxy(): vec4 { return new vec4(this._w, this._z, this._x, this._y); }
	get wzxz(): vec4 { return new vec4(this._w, this._z, this._x, this._z); }
	get wzxw(): vec4 { return new vec4(this._w, this._z, this._x, this._w); }
	get wzyx(): vec4 { return new vec4(this._w, this._z, this._y, this._x); }
	get wzyy(): vec4 { return new vec4(this._w, this._z, this._y, this._y); }
	get wzyz(): vec4 { return new vec4(this._w, this._z, this._y, this._z); }
	get wzyw(): vec4 { return new vec4(this._w, this._z, this._y, this._w); }
	get wzzx(): vec4 { return new vec4(this._w, this._z, this._z, this._x); }
	get wzzy(): vec4 { return new vec4(this._w, this._z, this._z, this._y); }
	get wzzz(): vec4 { return new vec4(this._w, this._z, this._z, this._z); }
	get wzzw(): vec4 { return new vec4(this._w, this._z, this._z, this._w); }
	get wzwx(): vec4 { return new vec4(this._w, this._z, this._w, this._x); }
	get wzwy(): vec4 { return new vec4(this._w, this._z, this._w, this._y); }
	get wzwz(): vec4 { return new vec4(this._w, this._z, this._w, this._z); }
	get wzww(): vec4 { return new vec4(this._w, this._z, this._w, this._w); }
	get wwxx(): vec4 { return new vec4(this._w, this._w, this._x, this._x); }
	get wwxy(): vec4 { return new vec4(this._w, this._w, this._x, this._y); }
	get wwxz(): vec4 { return new vec4(this._w, this._w, this._x, this._z); }
	get wwxw(): vec4 { return new vec4(this._w, this._w, this._x, this._w); }
	get wwyx(): vec4 { return new vec4(this._w, this._w, this._y, this._x); }
	get wwyy(): vec4 { return new vec4(this._w, this._w, this._y, this._y); }
	get wwyz(): vec4 { return new vec4(this._w, this._w, this._y, this._z); }
	get wwyw(): vec4 { return new vec4(this._w, this._w, this._y, this._w); }
	get wwzx(): vec4 { return new vec4(this._w, this._w, this._z, this._x); }
	get wwzy(): vec4 { return new vec4(this._w, this._w, this._z, this._y); }
	get wwzz(): vec4 { return new vec4(this._w, this._w, this._z, this._z); }
	get wwzw(): vec4 { return new vec4(this._w, this._w, this._z, this._w); }
	get wwwx(): vec4 { return new vec4(this._w, this._w, this._w, this._x); }
	get wwwy(): vec4 { return new vec4(this._w, this._w, this._w, this._y); }
	get wwwz(): vec4 { return new vec4(this._w, this._w, this._w, this._z); }
	get wwww(): vec4 { return new vec4(this._w, this._w, this._w, this._w); }
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
		let v3: mat3 = mat4.lookAt(eye, at, up).mat3().transpose();
		let v4: mat4 = new mat4(v3[0][0], v3[0][1], v3[0][2], 0,
								v3[1][0], v3[1][1], v3[1][2], 0,
								v3[2][0], v3[2][1], v3[2][2], 0,
								0, 0, 0, 1);
		return mat4.translate(eye).mul(v4);
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

/* gcamera.ts */
abstract class Camera {
	public eye: vec3;
	public at: vec3;
	public up: vec3;
	public near: number;
	public far: number;
	public view: mat4;
	public proj: mat4;

	public constructor(eye: vec3, at: vec3, up: vec3, near: number, far: number) {
		this.eye = eye;
		this.at = at;
		this.up = up;
		this.near = near;
		this.far = far;
		this.updateViewMatrix();
	}

	public updateViewMatrix(): void {
		this.view = mat4.lookAt(this.eye, this.at, this.up);
	}

	public abstract updateProjMatrix(): void;

	public assign(c: Camera): Camera {
		this.eye.assign(c.eye);
		this.at.assign(c.at);
		this.up.assign(c.up);
		this.near = c.near;
		this.far = c.far;
		this.updateViewMatrix();
		return this;
	}

	public abstract clone(): Camera;
}

class OrthographicCamera extends Camera {

	public width: number;
	public height: number;
	public zoomFactor: number;

	constructor(eye: vec3, at: vec3, up: vec3, width: number, height: number, near: number, far: number, zoomFactor: number=1) {
		super(eye, at, up, near, far);

		this.width=width;
		this.height=height;
		this.zoomFactor=zoomFactor;
		this.updateProjMatrix();
	}

	public updateProjMatrix(): void {
		this.proj=mat4.orthographic(this.width*this.zoomFactor, this.height*this.zoomFactor, this.near, this.far);
	}

	public assign(c: OrthographicCamera): OrthographicCamera {
		super.assign(c);

		this.width=c.width;
		this.height=c.height;
		this.zoomFactor=c.zoomFactor;
		this.updateProjMatrix();
		return this;
	}

	public clone(): OrthographicCamera {
		return new OrthographicCamera(new vec3().assign(this.eye), new vec3().assign(this.at), new vec3().assign(this.up), this.width, this.height, this.near, this.far, this.zoomFactor);
	}
}

class PerspectiveCamera extends Camera {

	public fovy: number;
	public aspectRatio: number;

	constructor(eye: vec3, at: vec3, up: vec3, fovy: number, aspectRatio: number, near: number, far: number) {
		super(eye, at, up, near, far);
		
		this.fovy=fovy;
		this.aspectRatio=aspectRatio;
		this.updateProjMatrix();
	}

	public updateProjMatrix(): void {
		this.proj=mat4.perspective(this.fovy, this.aspectRatio, this.near, this.far);
	}

	public assign(c: PerspectiveCamera): PerspectiveCamera {
		super.assign(c);

		this.fovy=c.fovy;
		this.aspectRatio=c.aspectRatio;
		this.updateProjMatrix();
		return this;
	}

	public clone(): PerspectiveCamera {
		return new PerspectiveCamera(new vec3().assign(this.eye), new vec3().assign(this.at), new vec3().assign(this.up), this.fovy, this.aspectRatio, this.near, this.far);
	}
}

enum CameraBehavior {
	NOTHING,
	CAMERA_ORBITING,
	CAMERA_PANNING,
	CAMERA_ZOOMING,
	CAMERA_ROLLING,
	OBJECT_ROTATING,
	OBJECT_SCALING,
	OBJECT_ROLLING
}

class CameraMovement {
	up: boolean=false;
	down: boolean=false;
	left: boolean=false;
	right: boolean=false;
	forward: boolean=false;
	backward: boolean=false;

	reset(): void {
		this.up=false;
		this.down=false;
		this.left=false;
		this.right=false;
		this.forward=false;
		this.backward=false;
	}

	any(): boolean {
		return this.up||this.down||this.left||this.right||this.forward||this.backward;
	}
}

interface iTrackballSpeed {
	zooming: number;
	panning: number;
	rotation: number;
	translation: number;
}

class Trackball<CameraType extends Camera> {
	private _mode: CameraBehavior;
	private _move: CameraMovement;
	private _curr: Camera;
	private _prev: Camera;
	private _home: Camera;

	private _transform: mat4;
	private _bUpdateTransform: Boolean;
	private _objRotate: mat4;
	private _objScale: mat4;
	private _objRoll: mat4;

	private _mouse: vec2;
	private _speed: iTrackballSpeed;

	public get eye(): vec3 { return this._curr.eye.add(0); }
	public get at(): vec3 { return this._curr.at.add(0); }
	public get up(): vec3 { return this._curr.up.add(0); }
	public get zoomFactor(): number { return (<OrthographicCamera>this._curr).zoomFactor; }

	public get zoomingSpeed(): number { return this._speed.zooming; }
	public set zoomingSpeed(value: number) { this._speed.zooming=value; }
	public get panningSpeed(): number { return this._speed.panning; }
	public set panningSpeed(value: number) { this._speed.panning=value; }
	public get rotationSpeed(): number { return this._speed.rotation; }
	public set rotationSpeed(value: number) { this._speed.rotation=value; }
	public get translationSpeed(): number { return this._speed.translation; }
	public set translationSpeed(value: number) { this._speed.translation=value; }

	public get movement(): CameraMovement { return this._move; }

	//public get transformViewMatrix(): mat4 { return this._curr.view.mul(this.transformMatrix); }
	public get viewMatrix(): mat4 { return this._curr.view; }
	public get projectionMatrix(): mat4 { return this._curr.proj; }

	public get transformMatrix(): mat4 { return this._bUpdateTransform ? this._objScale.mul(this._objRoll.mul(this._objRotate.mul(this._transform))) : this._transform; }
	//public set transformMatrix(m: mat4) { this._transform.assign(m); }
	public set updateTransform(b: Boolean) { this._bUpdateTransform = b; }

	public constructor(currentCam: CameraType) {
		this._mode=CameraBehavior.NOTHING;
		this._move=new CameraMovement();
		this._curr=currentCam.clone();
		this._prev=currentCam.clone();
		this._home=currentCam.clone();
		this._mouse=new vec2();
		this._speed={zooming:0.5, panning:0.1, rotation: 0.75, translation: 0.0005};

		this._transform = new mat4();
		this._objRoll = new mat4();
		this._objRotate = new mat4();
		this._objScale = new mat4();
		this._bUpdateTransform = false;
	}

	private cameraOrbit(d: vec2): void {

		let eye: vec3 = this._prev.eye;
		let center: vec3 = this._prev.at;
		let up: vec3 = this._prev.up;

		let yawPitch: vec2 = d.mul(Math.PI*0.5);

		let yawAxis: vec3 = up;
		let pitchAxis: vec3 = center.sub(eye).cross(yawAxis).normalize();

		let T: mat4 = mat4.translate(center);
		let Y: mat4 = mat4.rotate(yawAxis, yawPitch.x);
		let P: mat4 = mat4.rotate(pitchAxis, yawPitch.y);
		let invT: mat4 = mat4.translate(center.negate());

		this._curr.eye.assign(T.mul(P.mul(Y.mul(invT.mul(new vec4(eye.x, eye.y, eye.z, 1))))).xyz);

		this._curr.updateViewMatrix();
	}

	private cameraPan(d: vec2): void {
		
		let eye: vec3 = this._prev.eye;
		let center: vec3 = this._prev.at;
		let up: vec3 = this._prev.up;

		let dir: vec3 = eye.sub(center);
		//d.assign(d.mul(dir.length)); perspective
		let ocam: OrthographicCamera = <OrthographicCamera>this._curr;

		let ds: vec2 = d.mul(ocam.width, ocam.height).mul(0.5*ocam.zoomFactor);

		let n: vec3 = dir.normalize();
		let u: vec3 = up.cross(n).normalize();
		let v: vec3 = n.cross(u).normalize();

		let o: vec3 = u.mul(ds.x).add(v.mul(ds.y));

		this._curr.eye.assign(eye.sub(o));
		this._curr.at.assign(center.sub(o));

		this._curr.updateViewMatrix();
	}	

	private cameraZoom(d: vec2): void {

		let t: number = Math.pow(2, -d.x);		
		
		let eye: vec3 = this._prev.eye;
		let center: vec3 = this._prev.at;
		
		if(this._curr instanceof OrthographicCamera) {
			this._curr.zoomFactor = (<OrthographicCamera>this._prev).zoomFactor*t;
		} else if(this._curr instanceof PerspectiveCamera) {
			let dist: number = eye.sub(center).length;

			if(dist < this._curr.near && t < 1) return;
			if(dist > this._curr.far && t > 1) return;

			this._curr.eye.assign(lerp(center, eye, t));
		}
		
		this._curr.updateViewMatrix();
	}

	private cameraRoll(d: vec2): void {

		let eye: vec3 = this._prev.eye;
		let center: vec3 = this._prev.at;
		let up: vec3 = this._prev.up;

		let n: vec3 = center.sub(eye).normalize();
		let u: vec3 = up.cross(n).normalize();
		let v: vec3 = n.cross(u).normalize();

		let p0: vec3 = new vec3().assign(this._mouse, 0).normalize();
		let p1: vec3 = new vec3().assign(this._mouse.add(d), 0).normalize();
		let angle: number = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));

		this._curr.up.assign(mat4.rotate(n, angle).mul(up, 0).xyz);

		this._curr.updateViewMatrix();
	}

	private objectRotate(d: vec2): void {

		let angle: number = d.length*Math.PI*0.5;
		let n: vec3 = new vec3(-d.y, d.x, 0).normalize().mul(this._prev.view.mat3());
		
		this._objRotate = mat4.rotate(n, angle);
		this._bUpdateTransform = true;
	}

	private objectScale(d: vec2): void {

		let t: number = 9*Math.pow(10, -d.y);
		this._objScale = mat4.scale(t, t, t);
		this._bUpdateTransform = true;
	}

	private objectRoll(d: vec2): void {

		let eye: vec3 = this._prev.eye;
		let center: vec3 = this._prev.at;
		
		let p0: vec3 = new vec3(this._mouse.x, this._mouse.y, 0).normalize();
		let p1: vec3 = new vec3().assign(this._mouse.add(d), 0).normalize();
		let angle: number = vec3.angleBetween(p0, p1, new vec3(0, 0, 1));
		let n: vec3 = center.sub(eye).normalize().mul(this._prev.view.mat3());

		this._objRoll = mat4.rotate(n, angle);
		this._bUpdateTransform = true;
	}

	reset(cam?: CameraType): void {
		this._mode=CameraBehavior.NOTHING;
		this._move.reset();
		this._curr.assign(cam==undefined ? this._home : cam);
		this._prev.assign(cam==undefined ? this._home : cam);
		this._transform.identity();
		this._objRoll.identity();
		this._objScale.identity();
		this._objRotate.identity();
		this._bUpdateTransform = false;
		this._mouse.assign(0, 0);
		this._curr.updateViewMatrix();
		this._curr.updateProjMatrix();
	}

	mouse(x: number, y: number, behavior: CameraBehavior) {
		this._prev.assign(this._curr);
		this._mouse.assign(clamp(2*x-1, -1, 1), clamp(1-2*y, -1, 1));
		this._mode=behavior;

		if (this._bUpdateTransform) {
			this._transform = this._objScale.mul(this._objRoll.mul(this._objRotate.mul(this._transform)));
			this._objScale.identity();
			this._objRoll.identity();
			this._objRotate.identity();
			this._bUpdateTransform=false;
		}
	}

	motion(x: number, y: number) {
		x=clamp(2*x-1, -1, 1);
		y=clamp(1-2*y, -1, 1);
		let d: vec2 = new vec2(x, y).sub(this._mouse);
		if(d.x==0 && d.y==0) return;

		switch(this._mode) {
			case CameraBehavior.CAMERA_ORBITING: this.cameraOrbit(d); break;
			case CameraBehavior.CAMERA_PANNING:  this.cameraPan(d); break;
			case CameraBehavior.CAMERA_ROLLING:  this.cameraRoll(d); break;
			case CameraBehavior.CAMERA_ZOOMING:  this.cameraZoom(d); break;
			case CameraBehavior.OBJECT_ROTATING: this.objectRotate(d); break;
			case CameraBehavior.OBJECT_SCALING:  this.objectScale(d); break;
			case CameraBehavior.OBJECT_ROLLING:  this.objectRoll(d); break;
			default: break;
		}
	}

	updateViewport(width: number, height: number, fovy_deg?: number) {
		if(fovy_deg==null) {
			let ocam: OrthographicCamera = (<OrthographicCamera>this._curr);
			ocam.width = width; ocam.height = height;
			ocam = (<OrthographicCamera>this._prev);
			ocam.width = width; ocam.height = height;
			ocam = (<OrthographicCamera>this._home);
			ocam.width = width; ocam.height = height;
		} else {
			(<PerspectiveCamera>this._curr).fovy = fovy_deg * (Math.PI/180);
			(<PerspectiveCamera>this._curr).aspectRatio = width/height;
			(<PerspectiveCamera>this._home).fovy = fovy_deg * (Math.PI/180);
			(<PerspectiveCamera>this._home).aspectRatio = width/height;
		}
	}

	update(elapsedTime: number) {
		if(this._move.any()) {
			let distance: number=this._home.eye.sub(this._home.at).length*elapsedTime*this._speed.translation;
			let n: vec3=this._curr.at.sub(this._curr.eye).normalize();
			let u: vec3=this._curr.up.cross(n).normalize();
			let v: vec3=n.cross(u).normalize();
	
			let dt: vec3=new vec3();
			let forward: vec3=n.mul(distance);
			let left: vec3=u.mul(distance);
			let up: vec3=v.mul(distance);
			if(this._move.forward) { dt=dt.add(n.mul(distance)); }
			if(this._move.backward) { dt=dt.sub(n.mul(distance)); }
			if(this._move.left) { dt=dt.add(u.mul(distance)); }
			if(this._move.right) { dt=dt.sub(u.mul(distance)); }
			if(this._move.up) { dt=dt.add(v.mul(distance)); }
			if(this._move.down) { dt=dt.sub(v.mul(distance)); }
			
			this._curr.eye=this._curr.eye.add(dt);
			this._curr.at=this._curr.at.add(dt);
		}
		
		this._curr.updateViewMatrix();
		this._curr.updateProjMatrix();
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

	protected onTouchStart(event: TouchEvent): void {}
	protected onTouchMove(event: TouchEvent): void {}
	protected onTouchEnd(event: TouchEvent): void {}
	protected onTouchCancel(event: TouchEvent): void {}
}

abstract class WebGLAppBase extends AppBase {

	private _glContext: WebGLRenderingContext = null;
	public get WebGLContext(): WebGLRenderingContext { return this._glContext; }

	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this._glContext = canvas.getContext("webgl") as WebGLRenderingContext || canvas.getContext("experimental-webgl") as WebGLRenderingContext;

		if(this._glContext !== null) {
			canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
			canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
			canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
			canvas.addEventListener("mouseover", this.onMouseOver.bind(this));
			canvas.addEventListener("mouseout", this.onMouseOut.bind(this));

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
abstract class WebGL2AppBase extends AppBase {

	private _glContext: WebGL2RenderingContext = null;
	public get WebGLContext(): WebGL2RenderingContext { return this._glContext; }

	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this._glContext = canvas.getContext("webgl2", { premultipliedAlpha: false }) as WebGL2RenderingContext;

		if(this._glContext !== null) {
			canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
			canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
			canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
			canvas.addEventListener("mouseover", this.onMouseOver.bind(this));
			canvas.addEventListener("mouseout", this.onMouseOut.bind(this));

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
	protected abstract init(gl: WebGL2RenderingContext): Boolean;
	protected initialUpdate(gl: WebGL2RenderingContext): Boolean { return true; }
	protected update(gl: WebGL2RenderingContext, timeElapsed: number): void {}
	protected abstract render(gl: WebGL2RenderingContext, timeElapsed: number): void;
	protected finalUpdate(gl: WebGL2RenderingContext): Boolean { return true; }
	protected abstract cleanUp(gl: WebGL2RenderingContext): void;
}

/* webglapp.ts */

abstract class PrimitiveData {
	public pointVisible: Boolean;
	public geometryVisible: Boolean;
	public pointColor: vec3;
	public geometryColor: vec3;
	public pointSelected: Boolean;
	public geometrySelected: Boolean;
	public constructor() {
		this.pointVisible = true;
		this.geometryVisible = true;
		this.pointColor = GenerateRainbowColor();
		this.geometryColor = new vec3();
		this.pointSelected = false;
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
	
	uniform mat4 model_matrix;
    uniform mat4 view_matrix;
	uniform mat4 proj_matrix;
	uniform float pointSize;

    void main() {
        gl_PointSize = pointSize;
        gl_Position = proj_matrix*view_matrix*model_matrix*vec4(pos, 1);
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

	private trackball: Trackball<OrthographicCamera>;

	private programDebug: WebGLProgram = null;
	private programPointCloud: WebGLProgram = null;
	private programWireGeometry: WebGLProgram = null;
	
	private plane: iVertexBufferIndexed = null;
	private sphere: iVertexBufferIndexed = null;
	private cylinder: iVertexBufferIndexed = null;
	private cone: iVertexBufferIndexed = null;
	private torus: iVertexBufferIndexed = null;
	
	private pointcloud: iVertexBuffer;
	private objectNames: string[] = [];
	private inlierVAO: iVertexBufferMap = {};
	private inlierObjects: iPrimitiveDataMap = {};

	//private FBO: iFramebufferObject = null;
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

	private bboxMin: vec3 = null;
	private bboxMax: vec3 = null;
	private boxRadius: number = 20;
	private _vertexDataBackup: number[] = null;
	private _vertexData: number[] = null;
	public get vertexData(): number[] { return this._vertexData; }

	private picked_point: vec3 = null;
	private ray_org: vec3 = null;
	private ray_dir: vec3 = null;

	private touchID: number = 0;
	private touchStartTime: number = 0;
	private touchStartPos: vec2 = new vec2();

	private _trackballBehavior: CameraBehavior = CameraBehavior.NOTHING;
	public SetTrackballRotate(): void { this._trackballBehavior = CameraBehavior.OBJECT_ROTATING; }
	public SetTrackballZoom(): void { this._trackballBehavior = CameraBehavior.CAMERA_ZOOMING; }
	public SetTrackballPan(): void { this._trackballBehavior = CameraBehavior.CAMERA_PANNING; }
	public SetTrackballStop(): void { this._trackballBehavior = CameraBehavior.NOTHING; }
	private _trackballHomeFront: OrthographicCamera = null;
	private _trackballHomeSide: OrthographicCamera = null;
	private _trackballHomeTop: OrthographicCamera = null;
	private _trackballBase: string="front";
	
	private text: CanvasRenderingContext2D = null;	

	private touchRadius: number=0.1;
	private bTouchAreaVisible: boolean=false;
	public ShowTouchArea(show: boolean, radius?: number): void {
		if(typeof radius !== "undefined") {
			this.touchRadius = radius;
		}
		this.bTouchAreaVisible = show;
	}

	public Resize(width: number, height: number) { 
		this.width = width; this.height = height;
		let ocam: OrthographicCamera = this._trackballHomeFront; ocam.width = width; ocam.height = height;
		ocam = this._trackballHomeSide; ocam.width = width; ocam.height = height;
		ocam = this._trackballHomeTop; ocam.width = width; ocam.height = height;
		this.trackball.updateViewport(width, height);
		this.WebGLContext.viewport(0, 0, width, height);

		this.text.font="20px Arial";
		//ResizeFramebufferObject(this.WebGLContext, width, height, this.FBO);
	}

    public constructor(canvas: HTMLCanvasElement, vertices: number[], textCanvas: HTMLCanvasElement) {
		super(canvas);

		this.text=textCanvas instanceof HTMLCanvasElement ? textCanvas.getContext("2d") : document.createElement("canvas").getContext("2d");

		this.text.font="20px Arial";

		this._vertexData = vertices;

		let mv: number = Number.MAX_VALUE;
		this.bboxMin = new vec3(mv, mv, mv);
		this.bboxMax = new vec3(-mv, -mv, -mv);
		let massCenter: vec3 = new vec3();
		for(let k=0; k<this._vertexData.length; k+=3) {
			let x: number = this._vertexData[k];
			let y: number = this._vertexData[k+1];
			let z: number = this._vertexData[k+2];
			this.bboxMin = this.bboxMin.minElements(x, y, z);
			this.bboxMax = this.bboxMax.maxElements(x, y, z);
			massCenter.assign(massCenter.x+x, massCenter.y+y, massCenter.z+z);
		}
		massCenter.assign(massCenter.div(this._vertexData.length/3));
		
		for(let k=0; k<this._vertexData.length; k+=3) {
			this._vertexData[k] -= massCenter.x;
			this._vertexData[k+1] -= massCenter.y;
			this._vertexData[k+2] -= massCenter.z;
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
		this.CreateTrackball();

		if(gl===null) return false;

		// shaders and program
		this.programDebug = CreateShaderProgram(gl, WebGLApp.vsDebugES2, WebGLApp.fsDebugES2);
		this.programPointCloud = CreateShaderProgram(gl, WebGLApp.vsPointCloudES2, WebGLApp.fsPointCloudES2);
		this.programWireGeometry = CreateShaderProgram(gl, WebGLApp.vsWireGeometryES2, WebGLApp.fsWireGeometryES2);

		this.programGeometry = CreateShaderProgram(gl, WebGLApp.vsGeometryES2, WebGLApp.fsGeometryES2);

		// VAO and VBOs
		this.pointcloud = CreateVertexBuffer(gl, this.vertexData);
		
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
	
	private CreateTrackball(): void {
		let m: vec3 = this.bboxMin;
		let M: vec3 = this.bboxMax;
		let center: vec3 = new vec3();
		let radius: number = m.sub(M).length*0.5; this.boxRadius=radius;
		let eye: vec3 = center.sub(new vec3(0, 0, -(radius+1)));
		let up: vec3 = new vec3(0, 1, 0);
		let extent: vec2 = M.sub(m).mul(0.5).xy;
		let zoomFactor: number = this.width>this.height ? 2*radius/this.width : 2*radius/this.height;

		let near: number = 0.001;
		let far: number = max(2*radius+1, 20.0);

		this._trackballHomeFront = new OrthographicCamera(eye, center, up, this.width, this.height, near, far, zoomFactor);
		this._trackballHomeSide = new OrthographicCamera(center.add(new vec3((radius+1), 0, 0)), center, up, this.width, this.height, near, far, zoomFactor);
		this._trackballHomeTop = new OrthographicCamera(center.add(new vec3(0, radius+1, 0)), center, new vec3(0, 0, -1), this.width, this.height, near, far, zoomFactor);
		
		this.trackball = new Trackball<OrthographicCamera>(this._trackballHomeFront);
	}

	public SetCameraFront(): void { this.trackball.reset(this._trackballHomeFront); this._trackballBase="front"; }
	public SetCameraSide(): void { this.trackball.reset(this._trackballHomeSide); this._trackballBase="side"; }
	public SetCameraTop(): void { this.trackball.reset(this._trackballHomeTop); this._trackballBase="top"; }

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
		this.inlierObjects[key].pointSelected = true;
		this.inlierObjects[key].geometrySelected = true;
	}
	public SelectObjectMesh(key: string): void {
		this.inlierObjects[key].geometrySelected = true;
	}
	public SelectObjectInlier(key: string): void {
		this.inlierObjects[key].pointSelected = true;
	}
	public DeselectAll(): void {
		this.objectNames.forEach(name=>{
			this.inlierObjects[name].pointSelected = false;
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
		
		this.trackball.update(timeElapsed);
    }

    protected render(gl: WebGLRenderingContext, timeElapsed: number): void {
		
		this.text.clearRect(0, 0, this.text.canvas.width, this.text.canvas.height);
		this.text.fillStyle="white";

		gl.viewport(0, 0, this.width, this.height);
		this.renderPointCloud(gl);
		this.renderInliers(gl);

		if(this.bTouchAreaVisible&&this.picked_point instanceof vec3) {
			gl.useProgram(this.programWireGeometry);

			gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(mat4.translate(this.picked_point).mul(mat4.scale( this.touchRadius, this.touchRadius, this.touchRadius  ))).transpose().toArray());	
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
	}
	
	private renderPointCloud(gl: WebGLRenderingContext): void {
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
	}

	private renderInliers(gl: WebGLRenderingContext): void {
		this.objectNames.forEach(name=>{
			
			let objectData: PrimitiveData = this.inlierObjects[name];
			let objectVBO: iVertexBuffer = this.inlierVAO[name];
			
			if(objectData.pointVisible) {
				gl.useProgram(this.programPointCloud);
				gl.bindBuffer(gl.ARRAY_BUFFER, objectVBO.vbo);
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "model_matrix"), false, this.trackball.transformMatrix.transpose().toArray());
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "view_matrix"), false, this.trackball.viewMatrix.transpose().toArray());
				gl.uniformMatrix4fv(gl.getUniformLocation(this.programPointCloud, "proj_matrix"), false, this.trackball.projectionMatrix.transpose().toArray());
				gl.uniform1f(gl.getUniformLocation(this.programPointCloud, "pointSize"), objectData.pointSelected ? this.selectedPointSize : this.inlierPointSize);
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

				gl.uniformMatrix4fv(gl.getUniformLocation(this.programWireGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(objectData.modelMatrix).transpose().toArray());	
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
		switch(this._trackballBase) {
			case "front": gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeFront.view.transpose().toArray()); break;
			case "side": gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeSide.view.transpose().toArray()); break;
			case "top": gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "view_matrix"), false, this._trackballHomeTop.view.transpose().toArray()); break;
		}
		
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "proj_matrix"), false, mat4.orthographic(2, 2, 0.001, this.boxRadius * 10).transpose().toArray());

		// draw origin sphere
		gl.bindBuffer(gl.ARRAY_BUFFER, this.originSphere.vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.originSphere.ibo);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		
		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 1);			
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.origin);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(mat4.scale(this.frame.scale.origin_radius, this.frame.scale.origin_radius, this.frame.scale.origin_radius)).transpose().toArray());
		
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
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RX.mul(cylTS)).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RX.mul(conTS)).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		//let posX: vec4 = textTransform.mul(new vec4(0.7, 0, 0, 0));
		//let posXcoord: vec2 = posX.xy.mul(1,-1).add(1).mul(0.5).mul(this.frame.size.width, this.frame.size.height).add(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height);
		//this.text.fillText("X", posXcoord.x, posXcoord.y);

		// y-axis
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.yaxis);
		//let R: mat4 = mat4.rotateZ(-Math.PI/2);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);			
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(cylTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(conTS).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		//let posY: vec4 = textTransform.mul(new vec4(0, 0.7, 0, 0));
		//let posYcoord: vec2 = posY.xy.mul(1,-1).add(1).mul(0.5).mul(this.frame.size.width, this.frame.size.height).add(this.frame.pos.x, this.height-this.frame.pos.y-this.frame.size.height);
		//this.text.fillText("Y", posYcoord.x, posYcoord.y);

		// z-axis
		gl.uniform3fv(gl.getUniformLocation(this.programGeometry, "color"), this.frame.color.zaxis);
		let RZ: mat4 = mat4.rotateX(Math.PI/2);
		
		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 2);			
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RZ.mul(cylTS)).transpose().toArray());
		gl.drawElements(gl.TRIANGLES, this.arrowCylinder.count, gl.UNSIGNED_SHORT, 0);

		gl.uniform1i(gl.getUniformLocation(this.programGeometry, "subroutine_index"), 3);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.programGeometry, "model_matrix"), false, this.trackball.transformMatrix.mul(RZ.mul(conTS)).transpose().toArray());
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

		let invView: mat4 = this.trackball.transformMatrix.transpose().mul(mat4.lookAtInv(this.trackball.eye, this.trackball.at, this.trackball.up));
		let ray_org: vec3 = invView.mul(new vec4(x, y, 0, 1)).xyz;
		let ray_dir: vec3 = invView.mul(new vec4(x, y, -1, 1)).xyz.sub(ray_org).normalize();
		let ray_radius: number = pixel_length*4; // 4 px radius

		let min_index: number = -1;
		let min_dist: number = Number.MAX_VALUE;
		let min_pt: vec3 = null;

		// circle-sweeping along the ray (cylinder).
		let candidate_point_indices: { index: number, point: vec3 }[] = [];
		for(let k=0; k < this.vertexData.length; k+=3) {
			let pt: vec3 = new vec3(this.vertexData[k], this.vertexData[k+1], this.vertexData[k+2]);
			let pto: vec3 = pt.sub(ray_org);

			let is_behind_cam: boolean = pto.dot(ray_dir) < 0;
			if (is_behind_cam) continue; // discards points if it is behind the camera.

			let dist: number = pto.sub(ray_dir.mul(ray_dir.dot(pto))).length;
			if(dist < ray_radius) {
				candidate_point_indices.push({ index: k/3, point: pt });
			}
			if(dist < min_dist) {
				min_index = k/3;
				min_dist = dist;
				min_pt = pt;
			}
		}
		
		// pick one nearest to the ray if no points in the cylinder.
		if(candidate_point_indices.length==0) {
			this.ray_org = ray_org;
			this.ray_dir = ray_dir;
			this.picked_point = min_pt;
			return min_index;
		}

		// pick one nearest to the camera among points in the cylinder.
		let closest_index: number = -1;
		let closest_dist: number = Number.MAX_VALUE;
		for(let k=0; k < candidate_point_indices.length; k++) {
			let candidate: { index: number, point: vec3 } = candidate_point_indices[k];
			let dist: number = this.trackball.eye.sub(candidate.point).length;
			if(dist < closest_dist) {
				closest_index = k;
				closest_dist = dist;
			}			
		}

		this.ray_org = ray_org;
		this.ray_dir = ray_dir;
		this.picked_point = candidate_point_indices[closest_index].point;
		return candidate_point_indices[closest_index].index;
	}

	public GetOutliers(): number[] {
		return this._vertexData;
	}

   	protected onMouseDown(event: MouseEvent): void {
		let x: number = event.x/this.width;
		let y: number = event.y/this.height;

		if(event.button==0) {
			this.trackball.mouse(x, y, this._trackballBehavior);
		}
    }
	protected onMouseUp(event: MouseEvent): void {
		let x: number = event.x/this.width;
		let y: number = event.y/this.height;

		if(event.button==0) {
			this.trackball.mouse(x, y, CameraBehavior.NOTHING);
		}
    }
	protected onMouseMove(event: MouseEvent): void {
		let x: number = event.x/this.width;
		let y: number = event.y/this.height;
		this.trackball.motion(x, y);
	}
	
	protected onMouseOut(event: MouseEvent): void {
		let x: number = event.x/this.width;
		let y: number = event.y/this.height;
		if(event.button==0) {
			this.trackball.mouse(x, y, CameraBehavior.NOTHING);
		}
	}

	protected onTouchStart(event: TouchEvent): void {
		event.preventDefault();

		if(event.touches.length==1) {
			this.touchID = event.touches[0].identifier;
			this.touchStartTime = (new Date()).getTime();
			let x = event.touches[0].clientX;
			let y = event.touches[0].clientY;
			this.touchStartPos.assign(x, y);

			this.trackball.mouse(x/this.width, y/this.height, this._trackballBehavior);
		}
	}

	protected onTouchMove(event: TouchEvent): void {
		event.preventDefault();

		for(let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let x = touch.clientX;
				let y = touch.clientY;

				this.trackball.motion(x/this.width, y/this.height);
			}
		}
	}

	protected onTouchEnd(event: TouchEvent): void {
		event.preventDefault();

		for( let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let x = touch.clientX;
				let y = touch.clientY;
				
				this.trackball.mouse(x/this.width, y/this.height, CameraBehavior.NOTHING);

				let diffTime = (new Date()).getTime() - this.touchStartTime;
				let diffDist = this.touchStartPos.sub(x, y).length;
				
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
			}
		}
	}

	protected onTouchCancel(event: TouchEvent): void {
		event.preventDefault();

		for(let k = 0; k < event.changedTouches.length; k++) {
			let touch: Touch = event.changedTouches[k];
			if(touch.identifier === this.touchID) {
				let x = touch.clientX;
				let y = touch.clientY;

				this.trackball.mouse(x/this.width, y/this.height, CameraBehavior.NOTHING);
			}
		}
	}
}

/*
function test() {
	
	let canvas: HTMLCanvasElement;
	let vertexData: number[];

	let app: WebGLApp = new WebGLApp(canvas, []); // 파일 읽은 후 생성

	app.Init();	// 초기화 한번
	app.Run(); // 렌더링 실행

	app.Resize(1, 1); // 캔버스 크기 바뀔 때,
	app.Stop(); // 새 파일 읽기 전에 호출하고 기존 app 객체는 버려버림.

	app.AppendObject("key", null); // inlier와 mesh 추가할 때
	app.PickPoint(0.1, 0.1);	// 클릭 했을 때
	app.GetOutliers();
	app.SetCameraFront();		// 카메라 앞에서
	app.SetCameraSide();		// 카메라 옆에서
	app.SetCameraTop();			// 카메라 위에서
	app.SetInlierColor("key", [1, 0, 0]);		// inlier 색 바꾸기
	app.SetInlierVisible("key", true);			// inlier 보이기/숨기기
	app.SetMeshColor("key", [0, 1, 0]);				// mesh 색 바꾸기
	app.SetMeshVisible("key", true);			// mesh 보이기/숨기기
	app.SetObjectVisible("key", true);			// inlier&mesh 보이기/숨기기
	app.SetTrackballPan();		// 카메라 이동
	app.SetTrackballRotate();	// 카메라 회전
	app.SetTrackballZoom();		// 카메라 줌
	app.SetTrackballStop();		// 카메라 아무것도 안함.

	app.RemoveObject("key"); // inlier&mesh 제거
	app.Reset(); // 파일 안바뀌고 리셋
}
*/