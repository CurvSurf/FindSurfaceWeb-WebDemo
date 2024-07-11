/*!
 * File: usda_exporter.js
 * Author: Sunggoo Kim <sg.kim@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2024 CurvSurf, Inc.
 */

function exportUSDA() {
    let objectKeys = Object.keys(gApp.inlierObjects);
    let content = WorldDescription("FindSurfaceResults",
        ...(objectKeys.map(function(key) {
        let object = gApp.inlierObjects[key];
        
        switch (true) {
            case key.startsWith("OBJ_PLANE"):
                return PlaneInstanceDescription(key, object);
            case key.startsWith("OBJ_SPHERE"):
                return SphereInstanceDescription(key, object);
            case key.startsWith("OBJ_CYLINDER"):
                return CylinderInstanceDescription(key, object);
            case key.startsWith("OBJ_CONE"):
                return ConeInstanceDescription(key, object);
            case key.startsWith("OBJ_TORUS"):
                return TorusInstanceDescription(key, object);
            default: break;
        }
    })));

    let blob = new Blob([content], { type: 'text/plain' });

    var url = window.URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'find-surface-result.usda'

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function checkExportButtonDisabledState() {
    let count = Object.keys(gApp.inlierObjects).length
    
    let button = document.getElementById("EXPORT_BUTTON");
    let shouldEnable = count > 0 && button.disabled
    if (shouldEnable) {
        button.disabled = false;
        button.style.backgroundColor = "";
        button.style.color = "";
    }
    let shouldDisable = count === 0 && !button.disabled
    if (shouldDisable) {
        button.disabled = true;
        button.style.backgroundColor = "gray";
        button.style.color = "white";
    }
}

function disableExportButton() {
    let button = document.getElementById("EXPORT_BUTTON");
    let shouldDisable = !button.disabled
    if (shouldDisable) {
        button.disabled = true;
        button.style.backgroundColor = "gray";
        button.style.color = "white";
    }
}

function quaternion(xAxis, yAxis, zAxis) {
    let r00 = xAxis[0]
    let r10 = xAxis[1]
    let r20 = xAxis[2]
    let r01 = yAxis[0]
    let r11 = yAxis[1]
    let r21 = yAxis[2]
    let r02 = zAxis[0]
    let r12 = zAxis[1]
    let r22 = zAxis[2]

    let trace = r00 + r11 + r22
    
    var qw, qx, qy, qz;

    if (trace > 0) {
        let s = Math.sqrt(trace + 1.0) * 2;
        qw = 0.25 * s;
        qx = (r21 - r12) / s;
        qy = (r02 - r20) / s;
        qz = (r10 - r01) / s;
    } else if (r00 > r11 && r00 > r22) {
        let s = Math.sqrt(1.0 + r00 - r11 - r22) * 2;
        qw = (r21 - r12) / s;
        qx = 0.25 * s;
        qy = (r01 + r10) / s;
        qz = (r02 + r20) / s;
    } else if (r11 > r22) {
        let s = Math.sqrt(1.0 + r11 - r00 - r22) * 2;
        qw = (r02 - r20) / s;
        qx = (r01 + r10) / s;
        qy = 0.25 * s;
        qz = (r12 + r21) / s;
    } else {
        let s = Math.sqrt(1.0 + r22 - r00 - r11) * 2;
        qw = (r10 - r01) / s;
        qx = (r02 + r20) / s;
        qy = (r12 + r21) / s;
        qz = 0.25 * s;
    }
    return [qw, qx, qy, qz];
}

function quaternion_from_matrix3x3(m) {
    return quaternion(m.column(0), m.column(1), m.column(2));
}

function MaterialDescription(worldName, materialName, color, opacity) {
    if (color === void 0) { color = [1, 1, 1] }
    if (opacity === void 0) { opacity = 0.5}
    return `
        def Material "${materialName}" {
            prepend token outputs:surface.connect = </${worldName}/Materials/${materialName}/DefaultSurfaceShader.outputs:surface>

            def Shader "DefaultSurfaceShader" {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor = ${ColorStr(color)}
                float inputs:opacity = ${OpacityStr(opacity)}
                float inputs:roughness = 0.75
                token outputs:surface
            }
        }`;
}

function MaterialScopeDescription(worldName) {
    return `
    def Scope "Materials" {
        ${MaterialDescription(worldName, "Plane", [1, 0, 0])}
        ${MaterialDescription(worldName, "Sphere", [0, 1, 0])}
        ${MaterialDescription(worldName, "Cylinder", [1, 0, 1])}
        ${MaterialDescription(worldName, "Cone", [0, 1, 1])}
        ${MaterialDescription(worldName, "Torus", [1, 1, 0])}
    }
    `;
}

function PlaneMeshDescription() {
    return `def Mesh "PlaneMesh" {
                int[] faceVertexCounts = [4, 4]
                int[] faceVertexIndices = [0, 1, 2, 3, 7, 6, 5, 4]
                normal3f[] normals = [(0, 0, 1), (0, 0, -1)] (
                    interpolation = "uniform"
                )
                point3f[] points = [(-0.5, -0.5, 0.00005), (0.5, -0.5, 0.00005), (0.5, 0.5, 0.00005), (-0.5, 0.5, 0.00005), (-0.5, -0.5, -0.00005), (0.5, -0.5, -0.00005), (0.5, 0.5, -0.00005), (-0.5, 0.5, -0.00005)]
                uniform token subdivisionScheme = "none"
            }`;
}

function SphereMeshDescription() {
    let data = GenerateSphereVertexData(4);
    let indices = IndexArrayStr(data.indices);
    let faceCount = data.indices.length / 3;
    let faceVertexCounts = IndexArrayStr(Array(faceCount).fill(3));
    let vertices = VectorArrayStr(data.vertices);

    return `def Mesh "SphereMesh" {
                int[] faceVertexCounts = ${faceVertexCounts}
                int[] faceVertexIndices = ${indices}
                point3f[] points = ${vertices}
                normal3f[] primvars:normals = ${vertices} (
                    interpolation = "faceVarying"
                )
                int[] primvars:normals:indices = ${indices}
                uniform token subdivisionScheme = "none"
            }`;
}

function _CylinderNormalStr(arr) {
    var result = [];
    for (let i = 0; i < arr.length; i += 3) {
        let group = arr.slice(i, i + 3);
        var x = group[0];
        var z = group[2];
        let length = Math.sqrt(x * x + z * z);
        x /= length;
        z /= length;
        result.push(`(${x.toFixed(8)}, 0, ${z.toFixed(8)})`);
    }
    let content = result.join(", ");
    return `[${content}]`;
}

function CylinderMeshDescription() {
    let data = GenerateCylinderVertexData();
    let indices = IndexArrayStr(data.indices.reverse());
    let faceCount = data.indices.length / 3;
    let faceVertexCounts = IndexArrayStr(Array(faceCount).fill(3));
    let vertices = VectorArrayStr(data.vertices);
    let normals = _CylinderNormalStr(data.vertices);

    return `def Mesh "CylinderMesh" {
                int[] faceVertexCounts = ${faceVertexCounts}
                int[] faceVertexIndices = ${indices}
                point3f[] points = ${vertices}
                normal3f[] primvars:normals = ${normals} (
                    interpolation = "faceVarying"
                )
                int[] primvars:normals:indices = ${indices}
                uniform token subdivisionScheme = "none"
            }`;
}

function _GenerateConeVertexData(lsubdiv, rsubdiv, topRadius, bottomRadius, height) {
    if (lsubdiv === void 0) { lsubdiv = 4; }
    if (rsubdiv === void 0) { rsubdiv = 36; }
    lsubdiv = Math.floor(Math.max(1, lsubdiv));
    rsubdiv = Math.floor(Math.max(3, rsubdiv));
    var vertices = [];
    var indices = [];
    var normals = [];
    var normalIndices = [];
    var step = height / lsubdiv;
    var unitAngle = Math.PI / (rsubdiv / 2);
    for (var k = 0; k < rsubdiv; k++) {
        var angle = unitAngle * k;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        vertices.push(topRadius * c, height * 0.5, topRadius * s);
        var i00 = k * (lsubdiv + 1);
        var i01 = ((k + 1) % rsubdiv) * (lsubdiv + 1);
        let dr = bottomRadius - topRadius;
        let cc = height / Math.sqrt(height * height + dr * dr);
        let cs = Math.sqrt(1 - cc * cc);
        let n = [c * cc, cs, s * cs];
        let ni = normals.length;
        normals.push(c * cc, cs, s * cs);
        for (var t = 1; t <= lsubdiv; t++) {
            let ratio = t / lsubdiv;
            let r = (1 - ratio) * topRadius + ratio * bottomRadius;
            let h = height * 0.5 - step * t;
            vertices.push(r * c, h, r * s);
            indices.push(i01 + t, i00 + t, i00 + t - 1);
            indices.push(i01 + t - 1, i01 + t, i00 + t - 1);
            normalIndices.push(ni + lsubdiv + t, ni + t, ni + t - 1);
            normalIndices.push(ni + lsubdiv + t - 1, ni + lsubdiv + t, ni + t - 1);
        }
    }
    return { vertices: vertices, indices: indices, normals: normals, normalIndices: normalIndices };
}

function ConeMeshDescription(topRadius, bottomRadius, height) {
    let vertexData = _GenerateConeVertexData(3, 36, topRadius, bottomRadius, height);
    let indices = IndexArrayStr(vertexData.indices);
    let faceCount = vertexData.indices.length / 3;
    let faceVertexCounts = IndexArrayStr(Array(faceCount).fill(3));
    let vertices = VectorArrayStr(vertexData.vertices);
    let normals = VectorArrayStr(vertexData.normals);
    let normalIndices = IndexArrayStr(vertexData.normalIndices);

    return `def Mesh "CylinderMesh" {
                int[] faceVertexCounts = ${faceVertexCounts}
                int[] faceVertexIndices = ${indices}
                point3f[] points = ${vertices}
                normal3f[] primvars:normals = ${normals} (
                    interpolation = "faceVarying"
                )
                int[] primvars:normals:indices = ${normalIndices}
                uniform token subdivisionScheme = "none"
            }
    `;
}

function _GenerateTorusVertexData(tsubdiv, psubdiv, meanRadius, tubeRadius, angle) {
    if (tsubdiv === void 0) { tsubdiv = 36; }
    if (psubdiv === void 0) { psubdiv = 18; }
    if (angle === void 0) { angle = Math.PI * 2.0; }
    var vertices = [];
    var indices = [];
    var normals = [];
    let _tsubdiv = Math.ceil(tsubdiv * angle / (2.0 * Math.PI))
    var tUnitAngle = angle / _tsubdiv;
    var pUnitAngle = Math.PI / (psubdiv / 2);
    var mean_radius = meanRadius;
    var tube_radius = tubeRadius;
    for (var k = 0; k <= _tsubdiv; k++) {
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
            normals.push(ctheta * cphi, stheta, -ctheta * sphi);
            vertices.push(x, y, z);
        }
    }
    for (var k = 0; k < _tsubdiv; k++) {
        for (var s = 0; s < psubdiv; s++) {
            var i0_ = k * psubdiv;
            var i1_ = (k + 1) * psubdiv;
            var i_0 = s;
            var i_1 = (s + 1) % psubdiv;
            var i00 = i0_ + i_0;
            var i01 = i0_ + i_1;
            var i10 = i1_ + i_0;
            var i11 = i1_ + i_1;
            indices.push(i00, i11, i01);
            indices.push(i00, i10, i11);
        }
    }
    return { vertices: vertices, indices: indices, normals: normals };
}

function TorusMeshDescription(meanRadius, tubeRadius, tubeAngle) {
    let vertexData = _GenerateTorusVertexData(36, 18, meanRadius, tubeRadius, tubeAngle);
    let indices = IndexArrayStr(vertexData.indices);
    let faceCount = vertexData.indices.length / 3;
    let faceVertexCounts = IndexArrayStr(Array(faceCount).fill(3));
    let vertices = VectorArrayStr(vertexData.vertices);
    let normals = VectorArrayStr(vertexData.normals);
    
    return `def Mesh "TorusMesh" {
                int[] faceVertexCounts = ${faceVertexCounts}
                int[] faceVertexIndices = ${indices}
                point3f[] points = ${vertices}
                normal3f[] primvars:normals = ${normals} (
                    interpolation = "faceVarying"
                )
                int[] primvars:normals:indices = ${indices}
            }`;
}

function MeshScopeDescription() {
    return `def Xform "Meshes" {
        float3 xformOp:scale = (0.0000001, 0.0000001, 0.0000001)
        uniform token[] xformOpOrder = ["xformOp:scale"]

        def Xform "Plane" {
            ${PlaneMeshDescription()}
        }

        def Xform "Sphere" {
            ${SphereMeshDescription()}
        }

        def Xform "Cylinder" {
            ${CylinderMeshDescription()}
        }
    }
    `;
}

function PlaneInstanceDescription(name, planeData) {
    let width = planeData.width;
    let height = planeData.height;
    let center = planeData.center;
    let horizontal = planeData.hori.normalize().negate();
    let vertical = planeData.vert.normalize().negate();
    let normal = horizontal.cross(vertical).normalize();
    let orient = quaternion(horizontal.toArray(), vertical.toArray(), normal.toArray())

    let widthStr = LengthStr(width);
    let heightStr = LengthStr(height);
    let centerStr = Vec3Str(center);
    let horizontalStr = Vec3Str(horizontal);
    let verticalStr = Vec3Str(vertical);
    let normalStr = Vec3Str(normal);
    let orientStr = VectorStr(orient);
    let scaleStr = VectorStr([width, height, 1]);
    let translateStr = centerStr;

    return function(worldName) {
        return `def Xform "${name}" (
        customData = {
            float width = ${widthStr}
            float height = ${heightStr}
            float3 center = ${centerStr}
            float3 horizontal = ${horizontalStr}
            float3 vertical = ${verticalStr}
            float3 normal = ${normalStr}
        }
        instanceable = true
        prepend apiSchemas = ["MaterialBindingAPI"]
    ) {
        def Xform "PlaneRef" (references = </${worldName}/Meshes/Plane>) {}

        rel material:binding = </${worldName}/Materials/Plane>

        quatf xformOp:orient = ${orientStr}
        float3 xformOp:scale = ${scaleStr}
        float3 xformOp:translate = ${translateStr}
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
    }`;
    };
}

function SphereInstanceDescription(name, sphereData) {
    let radius = sphereData.radius;
    let center = sphereData.center;
    let orient = [1, 0, 0, 0];

    let radiusStr = LengthStr(radius);
    let centerStr = Vec3Str(center);
    let orientStr = VectorStr(orient);
    let scaleStr = VectorStr(Array(3).fill(radius));
    let translateStr = centerStr;

    return function(worldName) {
        return `def Xform "${name}" (
        customData = {
            float radius = ${radiusStr}
            float3 center = ${centerStr}
        }
        instanceable = true
        prepend apiSchemas = ["MaterialBindingAPI"]
    ) {
        def Xform "SphereRef" (references = </${worldName}/Meshes/Sphere>) {}

        rel material:binding = </${worldName}/Materials/Sphere>

        quatf xformOp:orient = ${orientStr}
        float3 xformOp:scale = ${scaleStr}
        float3 xformOp:translate = ${translateStr}
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
    }`;
    };
}

function QuaternionForRotation(angle, axis) {
    let halfAngle = angle * 0.5;
    let cosine = Math.cos(halfAngle);
    let sine = Math.sin(halfAngle);
    return [cosine, sine * axis[0], sine * axis[1], sine * axis[2]]
}

function CylinderInstanceDescription(name, cylinderData) {
    let radius = cylinderData.radius;
    let height = cylinderData.height;
    let center = cylinderData.center;
    let axis = cylinderData.axis;
    let yAxis = new vec3(0, 1, 0);
    let orientAxis = yAxis.cross(axis).normalize();
    let orientAngle = vec3.angleBetween(yAxis, axis, orientAxis);
    let orient = QuaternionForRotation(orientAngle, orientAxis.toArray());

    let radiusStr = LengthStr(radius);
    let heightStr = LengthStr(height);
    let centerStr = Vec3Str(center);
    let axisStr = Vec3Str(axis);
    let orientStr = VectorStr(orient);
    let scaleStr = VectorStr([radius, 0.5 * height, radius]);
    let translateStr = centerStr;

    return function(worldName) {
        return `def Xform "${name}" (
        customData = {
            float radius = ${radiusStr}
            float height = ${heightStr}
            float3 center = ${centerStr}
            float3 axis = ${axisStr}
        }
        instanceable = true
        prepend apiSchemas = ["MaterialBindingAPI"]
    ) {
        def Xform "CylinderRef" (references = </${worldName}/Meshes/Cylinder>) {}

        rel material:binding = </${worldName}/Materials/Cylinder>

        quatf xformOp:orient = ${orientStr}
        float3 xformOp:scale = ${scaleStr}
        float3 xformOp:translate = ${translateStr}
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
    }`;
    };
}

function ConeInstanceDescription(name, coneData) {
    let topRadius = coneData.topRadius;
    let bottomRadius = coneData.bottomRadius;
    let height = coneData.height;
    let center = coneData.center;
    let axis = coneData.axis;
    let yAxis = new vec3(0, 1, 0);
    let orientAxis = yAxis.cross(axis).normalize();
    let orientAngle = vec3.angleBetween(yAxis, axis, orientAxis);
    let orient = QuaternionForRotation(orientAngle, orientAxis.toArray());

    let topRadiusStr = LengthStr(topRadius);
    let bottomRadiusStr = LengthStr(bottomRadius);
    let heightStr = LengthStr(height);
    let centerStr = Vec3Str(center);
    let axisStr = Vec3Str(axis);
    let orientStr = VectorStr(orient);
    let scaleStr = VectorStr([1, 1, 1]);
    let translateStr = centerStr;

    return function(worldName) {
        return `def Xform "${name}" (
        customData = {
            float topRadius = ${topRadiusStr}
            float bottomRadius = ${bottomRadiusStr}
            float height = ${heightStr}
            float3 center = ${centerStr}
            float3 axis = ${axisStr}
        }
        instanceable = true
        prepend apiSchemas = ["MaterialBindingAPI"]
    ) {
        ${ConeMeshDescription(topRadius, bottomRadius, height)}

        rel material:binding = </${worldName}/Materials/Cone>

        quatf xformOp:orient = ${orientStr}
        float3 xformOp:scale = ${scaleStr}
        float3 xformOp:translate = ${translateStr}
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
    }`;
    };
}

function TorusInstanceDescription(name, torusData) {
    let meanRadius = torusData.meanRadius;
    let tubeRadius = torusData.tubeRadius;
    let center = torusData.center;
    let axis = torusData.axis;
    let tubeAngle = torusData.tubeAngle;
    let m = torusData.modelMatrix;
    let xAxis = m.column(0).xyz.normalize().toArray();
    let yAxis = m.column(1).xyz.normalize().toArray();
    let zAxis = m.column(2).xyz.normalize().toArray();
    console.log(`${xAxis}, ${yAxis}, ${zAxis}`)
    let orient = quaternion(xAxis, yAxis, zAxis);

    let meanRadiusStr = LengthStr(meanRadius);
    let tubeRadiusStr = LengthStr(tubeRadius);
    let centerStr = Vec3Str(center);
    let axisStr = Vec3Str(axis);
    let tubeAngleStr = LengthStr(tubeAngle);
    let orientStr = VectorStr(orient);
    let scaleStr = VectorStr([1, 1, 1]);
    let translateStr = centerStr;

    return function(worldName) {
        return `def Xform "${name}" (
        customData = {
            float meanRadius = ${meanRadiusStr}
            float tubeRadius = ${tubeRadiusStr}
            float3 center = ${centerStr}
            float3 axis = ${axisStr}
            float tubeAngle = ${tubeAngleStr}
        }
        instanceable = true
        prepend apiSchemas = ["MaterialBindingAPI"]
    ) {
        ${TorusMeshDescription(meanRadius, tubeRadius, tubeAngle)}

        rel material:binding = </${worldName}/Materials/Torus>

        quatf xformOp:orient = ${orientStr}
        float3 xformOp:scale = ${scaleStr}
        float3 xformOp:translate = ${translateStr}
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
    }`;
    };
}

function WorldDescription(worldName, ...descriptions) {

    return `#usda 1.0
(
    customLayerData = {
        string creator = "FindSurfaceWebDemo"
    }
    defaultPrim = "${worldName}"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "${worldName}" {
    ${MaterialScopeDescription(worldName)}
    ${MeshScopeDescription()}
    ${descriptions.map(description => description(worldName)).join("\n\n\t")}
}
`
}

function IndexArrayStr(arr) {
    let content = arr.map(x => `${x}`).join(", ")
    return `[${content}]`;
}

function VectorArrayStr(arr) {
    var result = [];
    for (let i = 0; i < arr.length; i += 3) {
        let group = arr.slice(i, i + 3);
        result.push(`(${group.map(x => x.toFixed(8)).join(', ')})`);
    }
    let content = result.join(", ")
    return `[${content}]`;
}

function LengthStr(length) {
    return length.toFixed(8)
}

function VectorStr(v) {
    let content = v.map(x => `${LengthStr(x)}`).join(', ');
    return `(${content})`;
}

function OpacityStr(o) {
    return `${o.toFixed(2)}`
}

function ColorStr(c) {
    let content = c.map(x => `${x.toFixed(4)}`).join(', ');
    return `(${content})`;
}

function Vec3Str(v) {
    return VectorStr(v.toArray());
}
