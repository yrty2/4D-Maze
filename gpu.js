let arot=[false,[0,0,0,0,0]];
const size=0.5;
var baseview4d=2.4995;
var view4D=baseview4d;
var light=[0,0,-20,0];
var specular=true;
var z=[1,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0];
var toz=[1,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0];
var obj=[];
var inst=[];
var vertex=[];
function generateVertex(){
    const s=size/2;
    vertex=[
        -s,-s,-s,-s,
        s,-s,-s,-s,
        -s,s,-s,-s,
        s,,-s,-s,
        -s,-s,s,-s,
        s,-s,s,-s,
        -s,s,s,-s,
        s,s,s,-s,

        -s,-s,-s,s,
        s,-s,-s,s,
        -s,s,-s,s,
        s,s,-s,s,
        -s,-s,s,s,
        s,-s,s,s,
        -s,s,s,s,
        s,s,s,s,
    ];
}
function generateInstance(){
inst=[];
    for(const o of obj){
        inst.push(o.color[0]);
        inst.push(o.color[1]);
        inst.push(o.color[2]);
        inst.push(o.color[3]);
        inst.push(o.position[0]);
        inst.push(o.position[1]);
        inst.push(o.position[2]);
        inst.push(o.position[3]);
        //スケール(胞を描画するため)
        inst.push(o.vol[0]);
        inst.push(o.vol[1]);
        inst.push(o.vol[2]);
        inst.push(o.vol[3]);
        //法線ベクトル
        inst.push(o.ray[0]);
        inst.push(o.ray[1]);
        inst.push(o.ray[2]);
        inst.push(o.ray[3]);
        //関節位置
        if(o.joint=="self"){
        inst.push(o.position[0]);
        inst.push(o.position[1]);
        inst.push(o.position[2]);
        inst.push(o.position[3]);
        }else{
        inst.push(o.joint[0]);
        inst.push(o.joint[1]);
        inst.push(o.joint[2]);
        inst.push(o.joint[3]);
        }
        //モデル座標の回転姿勢
        inst.push(o.z[0]);
        inst.push(o.z[5]);
        inst.push(o.z[6]);
        inst.push(o.z[7]);
        
        inst.push(o.z[15]);
        inst.push(o.z[8]);
        inst.push(o.z[9]);
        inst.push(o.z[10]);
    }
};
//超ボクセルを描く手順
function generateIndex(obj){
    return [
        0,1,2,1,2,3,
        4,5,6,5,6,7,
        4,0,5,0,5,1,
        2,6,3,6,3,7,
        1,5,3,5,3,7,
        0,4,2,4,2,6,
        //平行
        8,9,10,9,10,11,
        12,13,14,13,14,15,
        12,8,13,8,13,9,
        10,14,11,14,11,15,
        9,13,11,13,11,15,
        8,12,10,12,10,14,
        //交差
        0,1,8,1,8,9,
        2,3,10,3,10,11,
        1,3,9,3,9,11,
        0,2,8,2,8,10,

        4,5,12,5,12,13,
        6,7,14,7,14,15,
        5,7,13,7,13,15,
        4,6,12,6,12,14,

        0,4,8,4,8,12,
        1,5,9,5,9,13,
        2,6,10,6,10,14,
        3,7,11,7,11,15
    ];
}
const camera={
    position:[0,0,0,0],
    velocity:10
}
function createBuffer(M){
  var m=[];
for(let i=0; i<M.length; ++i){
  for(let j=0; j<M[i].length; ++j){
    m.push(M[j][i]);
  }
}
return new Float32Array(m);
}
const canvas=document.querySelector(".canvas");
const wgpu=new WGPU(new geometry("E4"),28,
`
struct Uniforms {
  camera : vec4<f32>,
  light : vec4<f32>,
  rot:mat4x4<f32>,
  view4D: f32,
  aspect: f32,
  dammyn:f32,
  dammyn2:f32
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragColor : vec4<f32>,
  @location(1) light : f32,
  @location(2) specular:f32,
  @location(3) wdepth:f32
}
fn vec2cliff(u:vec4<f32>)->array<f32,16>{
    return array<f32,16>(0,u.x,u.y,u.z,u.w,0,0,0,0,0,0,0,0,0,0,0);
}
fn cliff2vec(u:array<f32,16>)->vec4<f32>{
    return vec4<f32>(u[1],u[2],u[3],u[4]);
}
fn inverse(u:array<f32,16>)->array<f32,16>{
    return array<f32,16>(u[0],u[1],u[2],u[3],u[4],-u[5],-u[6],-u[7],-u[8],-u[9],-u[10],-u[11],-u[12],-u[13],-u[14],u[15]);
}
fn geoprod(u:array<f32,16>,v:array<f32,16>)->array<f32,16>{
let r:f32=u[0];let x:f32=u[1];let y:f32=u[2];let z:f32=u[3];let w:f32=u[4];let xy:f32=u[5];let yz:f32=u[6];let xz:f32=u[7];let xw:f32=u[8];let yw:f32=u[9];let zw:f32=u[10];let xyz:f32=u[11];let yzw:f32=u[12];let xzw:f32=u[13];let xyw:f32=u[14];let xyzw:f32=u[15];let R:f32=v[0];let X:f32=v[1];let Y:f32=v[2];let Z:f32=v[3];let W:f32=v[4];let XY:f32=v[5];let YZ:f32=v[6];let XZ:f32=v[7];let XW:f32=v[8];let YW:f32=v[9];let ZW:f32=v[10];let XYZ:f32=v[11];let YZW:f32=v[12];let XZW:f32=v[13];let XYW:f32=v[14];let XYZW:f32=v[15];
return array<f32,16>((r*R)+(x*X)+(y*Y)+(z*Z)+(w*W)-(xy*XY)-(yz*YZ)-(xz*XZ)-(xw*XW)-(yw*YW)-(zw*ZW)-(xyz*XYZ)-(yzw*YZW)-(xzw*XZW)-(xyw*XYW)+(xyzw*XYZW),(r*X)+(x*R)-(y*XY)-(z*XZ)-(w*XW)+(xy*Y)-(yz*XYZ)+(xz*Z)+(xw*W)-(yw*XYW)-(zw*XZW)-(xyz*YZ)+(yzw*XYZW)-(xzw*ZW)-(xyw*YW)-(xyzw*YZW),(r*Y)+(x*XY)+(y*R)-(z*YZ)-(w*YW)-(xy*X)+(yz*Z)+(xz*XYZ)+(xw*XYW)+(yw*W)-(zw*YZW)+(xyz*XZ)-(yzw*ZW)-(xzw*XYZW)+(xyw*XW)+(xyzw*XZW),(r*Z)+(x*XZ)+(y*YZ)+(z*R)-(w*ZW)-(xy*XYZ)-(yz*Y)-(xz*X)+(xw*XZW)+(yw*YZW)+(zw*W)-(xyz*XY)+(yzw*YW)+(xzw*XW)+(xyw*XYZW)-(xyzw*XYW),(r*W)+(x*XW)+(y*YW)+(z*ZW)+(w*R)-(xy*XYW)-(yz*YZW)-(xz*XZW)-(xw*X)-(yw*Y)-(zw*Z)-(xyz*XYZW)-(yzw*YZ)-(xzw*XZ)-(xyw*XY)+(xyzw*XYZ),(r*XY)+(x*Y)-(y*X)+(z*XYZ)+(w*XYW)+(xy*R)+(yz*XZ)-(xz*YZ)-(xw*YW)+(yw*XW)-(zw*XYZW)+(xyz*Z)+(yzw*XZW)-(xzw*YZW)+(xyw*W)-(xyzw*ZW),(r*YZ)+(x*XYZ)+(y*Z)-(z*Y)+(w*YZW)-(xy*XZ)+(yz*R)+(xz*XY)-(xw*XYZW)-(yw*ZW)+(zw*YW)+(xyz*X)+(yzw*W)+(xzw*XYW)-(xyw*XZW)-(xyzw*XW),(r*XZ)+(x*Z)-(y*XYZ)-(z*X)+(w*XZW)+(xy*YZ)-(yz*XY)+(xz*R)-(xw*ZW)+(yw*XYZW)+(zw*XW)-(xyz*Y)-(yzw*XYW)+(xzw*W)+(xyw*YZW)+(xyzw*YW),(r*XW)+(x*W)-(y*XYW)-(z*XZW)-(w*X)+(xy*YW)-(yz*XYZW)+(xz*ZW)+(xw*R)-(yw*XY)-(zw*XZ)-(xyz*YZW)+(yzw*XYZ)-(xzw*Z)-(xyw*Y)-(xyzw*YZ),(r*YW)+(x*XYW)+(y*W)-(z*YZW)-(w*Y)-(xy*XW)+(yz*ZW)+(xz*XYZW)+(xw*XY)+(yw*R)-(zw*YZ)+(xyz*XZW)-(yzw*Z)-(xzw*XYZ)+(xyw*X)+(xyzw*XZ),(r*ZW)+(x*XZW)+(y*YZW)+(z*W)-(w*Z)-(xy*XYZW)-(yz*YW)-(xz*XW)+(xw*XZ)+(yw*YZ)+(zw*R)-(xyz*XYW)+(yzw*Y)+(xzw*X)+(xyw*XYZ)-(xyzw*XY),(r*XYZ)+(x*YZ)-(y*XZ)+(z*XY)-(w*XYZW)+(xy*Z)+(yz*X)-(xz*Y)+(xw*YZW)-(yw*XZW)+(zw*XYW)+(xyz*R)-(yzw*XW)+(xzw*YW)-(xyw*ZW)+(xyzw*W),(r*YZW)+(x*XYZW)+(y*ZW)-(z*YW)+(w*YZ)-(xy*XZW)+(yz*W)+(xz*XYW)-(xw*XYZ)-(yw*Z)+(zw*Y)+(xyz*XW)+(yzw*R)+(xzw*XY)-(xyw*XZ)-(xyzw*X),(r*XZW)+(x*ZW)-(y*XYZW)-(z*XW)+(w*XZ)+(xy*YZW)-(yz*XYW)+(xz*W)-(xw*Z)+(yw*XYZ)+(zw*X)-(xyz*YW)-(yzw*XY)+(xzw*R)+(xyw*YZ)+(xyzw*Y),(r*XYW)+(x*YW)-(y*XW)+(z*XYZW)+(w*XY)+(xy*W)+(yz*XZW)-(xz*YZW)-(xw*Y)+(yw*X)-(zw*XYZ)+(xyz*ZW)+(yzw*XZ)-(xzw*YZ)+(xyw*R)-(xyzw*Z),(r*XYZW)+(x*YZW)-(y*XZW)+(z*XYW)-(w*XYZ)+(xy*ZW)+(yz*XW)-(xz*YW)+(xw*YZ)-(yw*XZ)+(zw*XY)+(xyz*W)-(yzw*X)+(xzw*Y)-(xyw*Z)+(xyzw*R));
}
@vertex
fn main(@location(0) position: vec4<f32>,@location(1) color: vec4<f32>,@location(2) pos: vec4<f32>,@location(3) scale: vec4<f32>,@location(4) ray: vec4<f32>,@location(5) joint: vec4<f32>,@location(6) z: vec4<f32>,@location(7) zw: vec4<f32>) -> VertexOutput {
  var output : VertexOutput;
  let c=array<f32,16>(
  uniforms.rot[0][0],uniforms.rot[0][1],uniforms.rot[0][2],uniforms.rot[0][3],
  uniforms.rot[1][0],uniforms.rot[1][1],uniforms.rot[1][2],uniforms.rot[1][3],
  uniforms.rot[2][0],uniforms.rot[2][1],uniforms.rot[2][2],uniforms.rot[2][3],
  uniforms.rot[3][0],uniforms.rot[3][1],uniforms.rot[3][2],uniforms.rot[3][3]
  );
  let Z=array<f32,16>(
  z.x,0,0,0,
  0,z.y,z.z,z.w,
  zw.y,zw.z,zw.w,0,
  0,0,0,zw.x
  );
  let ci=inverse(c);
  let iz=inverse(Z);
  var p=cliff2vec(geoprod(geoprod(ci,vec2cliff(cliff2vec(geoprod(geoprod(iz,vec2cliff(position*scale+uniforms.camera+pos-joint/2)),Z))+joint/2)),c));
  output.wdepth=abs(p.w);
  if(abs(p.w)>=uniforms.view4D){
  p.z=-1;
  }else{
  var normal=normalize(cliff2vec(geoprod(geoprod(ci,vec2cliff(cliff2vec(geoprod(geoprod(iz,vec2cliff(ray-joint/2)),Z))+joint/2)),c)));
  var lights:f32=(dot(normal,normalize(uniforms.light-p))+1)/2;
  output.light=lights;
  output.specular=pow(dot(normal,normalize(normalize(uniforms.light-p)+normalize(-p))),20);
  let dst:f32=1.15;
  let zst:f32=abs(p.z+dst);
  output.Position=vec4<f32>(p.x*dst/(zst),p.y*dst/(zst)*uniforms.aspect,(p.z+dst)*0.0001,1);
  output.fragColor=color;
  }
  return output;
}
@fragment
fn fragmain(@location(0) fragColor: vec4<f32>,@location(1) light: f32,@location(2) specular:f32,@location(3) wdepth:f32) -> @location(0) vec4<f32> {
if(wdepth>=uniforms.view4D){
discard;
}
  return vec4<f32>(fragColor.xyz*light+specular/2,fragColor.w);
}
`);
generateVertex();
wgpu.bindvertex(vertex);
wgpu.bindindex(generateIndex());
async function main(){
    await wgpu.initialize(canvas,["float32x4"],["float32x4","float32x4","float32x4","float32x4","float32x4","float32x4","float32x4"]);
    function gameloop(){
        translate();
        wgpu.uniform=[...camera.position,...light,...z,view4D,canvas.width/canvas.height,0,0];
        wgpu.render(inst);
        hojoscreen();
        requestAnimationFrame(gameloop);
    }
    gameloop();
}