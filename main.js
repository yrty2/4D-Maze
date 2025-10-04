var key="";
var fps=0;
var displayfps={
    update:0,
    value:0
}
var now=Date.now();
window.addEventListener("keydown",e=>{
    if(e.code=="ArrowRight" || e.code=="ArrowDown" || e.code=="ArrowUp" || e.code=="ArrowLeft"){
    e.preventDefault();
    }
    key=e.code;
    keycontrol();
    if(key=="KeyZ"){
        jt=1;
    }
});
window.addEventListener("keyup",e=>{
    key="";
    if(vec.length(arot[1])>0.01){
    arot[0]=true;
    }
});
var startTime;
var endTime;
function youwingoal(){
    win=true;
    z=[0.8109593992738169,0,0,0,0,-0.10922259083550508,-0.181393187610908,-0.32541600277884597,0.34008807975560823,0.14886892396068455,-0.23146080086464585,0,0,0,0,0.014840962045703184];
    endTime=Date.now();
}
function start(){
    const config=document.querySelector(".config");
    config.innerHTML="";
    canvas.width=screen.width;
    canvas.height=screen.height+1;
    overcanva.width=screen.width;
    overcanva.height=screen.height;
    generateMaze(scale);
    main();
    startTime=Date.now();
}
//描画毎に行う処理
function translate(){
    fps=1000/(Date.now()-now);
    displayfps.update++;
    if(displayfps.update>60){
        displayfps.value=fps;
        displayfps.update=0;
    }
    now=Date.now();
    var delta=0;
    frame();
    const cv=camera.velocity/60;
    //animation();
}
function deleteObj(seed){
    let id=obj.findIndex(e=>e.seed==seed);
    if(seed!=-1){
    let res=obj.slice(0,id);
    let A=obj.slice(id+1,obj.length);
        for(let k=0; k<A.length; ++k){
            res.push(A[k]);
        }
        obj=res;
    }
}
function createCube(x,y,z,w,scales,color,ray,info,joint,Z){
    if(!joint){
        joint=[0,0,0,0];
        //回転の中心を原点にする。
    }
    if(!ray){
        ray=[1,0,0,0];
    }
    if(!info){
        info=[];
    }
    if(!color){
        color=[Math.random(),Math.random(),Math.random(),1];
    }
    if(!scales){
        scales=[1,1,1,1];
    }
    if(!Z){
        Z=clifford.unit(4);
    }
    obj.push({
        position:[x,y,z,w],
        color:color,
        vol:scales,
        seed:Math.random(),
        info:info,
        ray:ray,
        joint:joint,
        z:Z
    });
}
function tesseract(C,color,S,info,joint,z){
    if(Number.isFinite(S)){
        S=[S,S,S,S];
    }
    if(joint=="self" || !joint){
    joint=vec.prod(C,2);
    }else{
    joint=vec.prod(joint,2);
    }
    const s=vec.prod(S,size/2);
    const c={x:C[0],y:C[1],z:C[2],w:C[3]};
    const b=0.01;
    createCube(c.x-s[0]-b/100,c.y,c.z,c.w,[0,S[1]-b,S[2]-b,S[3]-b],color,[-1,0,0,0],info,joint,z);
    createCube(c.x+s[0]+b/100,c.y,c.z,c.w,[0,S[1]-b,S[2]-b,S[3]-b],color,[1,0,0,0],info,joint,z);

    createCube(c.x,c.y-s[1]-b/100,c.z,c.w,[S[0]-b,0,S[2]-b,S[3]-b],color,[0,-1,0,0],info,joint,z);
    createCube(c.x,c.y+s[1]+b/100,c.z,c.w,[S[0]-b,0,S[2]-b,S[3]-b],color,[0,1,0,0],info,joint,z);

    createCube(c.x,c.y,c.z-s[2]-b/100,c.w,[S[0]-b,S[1]-b,0,S[3]-b],color,[0,0,-1,0],info,joint,z);
    createCube(c.x,c.y,c.z+s[2]+b/100,c.w,[S[0]-b,S[1]-b,0,S[3]-b],color,[0,0,1,0],info,joint,z);

    createCube(c.x,c.y,c.z,c.w-s[3]-b/100,[S[0]-b,S[1]-b,S[2]-b,0],color,[0,0,0,-1],info,joint,z);
    createCube(c.x,c.y,c.z,c.w+s[3]+b/100,[S[0]-b,S[1]-b,S[2]-b,0],color,[0,0,0,1],info,joint,z);

    createCube(c.x,c.y,c.z,c.w,[S[0]-b,S[1]-b,S[2]-b,S[3]-b],color,[0,0,0,-1],info,joint,z);
}
var mon=0;
function tenkai(C,color,S){
    const s=S*size+S/19;
    const c=new vector(C[0],C[1],C[2]);
//x
    createCube(c.x-s,c.y,c.z,0,[S,S,S,0],color,[-1,0,0,0]);
    createCube(c.x+s,c.y,c.z,0,[S,S,S,0],color,[1,0,0,0]);
//y
    createCube(c.x,c.y-s,c.z,0,[S,S,S,0],color,[0,-1,0,0]);
    createCube(c.x,c.y+s,c.z,0,[S,S,S,0],color,[0,1,0,0]);
//z
    createCube(c.x,c.y,c.z-s,0,[S,S,S,0],color,[0,0,-1,0]);
    createCube(c.x,c.y,c.z+s,0,[S,S,S,0],color,[0,0,1,0]);
//w
    createCube(c.x,c.y,c.z,0,[S,S,S,0],color,[0,0,0,-1]);
    createCube(c.x+2*s,c.y,c.z,0,[S,S,S,0],color,[0,0,0,1]);
}
function wirecube(p,s,pos){
    const color=[0,0.5,0.5,0.8];
    const a=s/4;
    const r=s*0.1;
    if(pos=="x+"){
        tesseract(vec.sum(p,[a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[a,0,-a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,-a,0,a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,-a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,-a,-a,0]),color,[r,r,r,s]);
        
        tesseract(vec.sum(p,[a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[a,0,-a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,-a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[a,0,0,0]),vec.dec([1,0,0,0.1],[0,0,0,0.5]),[r,s,s,s]);
    }
    if(pos=="x-"){
        tesseract(vec.sum(p,[-a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,0,-a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,-a,0,a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[-a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,-a,0]),color,[r,r,r,s]);
        
        tesseract(vec.sum(p,[-a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,0,-a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,-a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,0,0,0]),vec.dec([1,1,0,0.1],[0,0,0,0.5]),[r,s,s,s]);
    }
    if(pos=="y+"){
        tesseract(vec.sum(p,[0,a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[a,a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,a,-a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[-a,a,0,a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[0,a,a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[a,a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,a,-a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[-a,a,0,-a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[0,a,0,0]),vec.dec([0,1,0,0.1],[0,0,0,0.5]),[s,r,s,s]);
    }
    if(pos=="y-"){
        tesseract(vec.sum(p,[0,-a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[a,-a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,-a,-a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[-a,-a,0,a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[0,-a,a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[a,-a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,-a,-a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[-a,-a,0,-a]),color,[r,r,s,r]);
        
        tesseract(vec.sum(p,[a,-a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,-a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[0,-a,0,0]),vec.dec([0,1,1,0.1],[0,0,0,0.5]),[s,r,s,s]);
    }
    if(pos=="z+"){
        tesseract(vec.sum(p,[a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,-a,a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,a,0]),color,[r,r,r,s]);
        
        tesseract(vec.sum(p,[0,a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,a,a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,a,-a]),color,[s,r,r,r]);

        tesseract(vec.sum(p,[a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[0,0,a,0]),vec.dec([0,0,1,0.1],[0,0,0,0.5]),[s,s,r,s]);
    }
    if(pos=="z-"){
        tesseract(vec.sum(p,[a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[a,-a,-a,0]),color,[r,r,r,s]);
        tesseract(vec.sum(p,[-a,-a,-a,0]),color,[r,r,r,s]);
        
        tesseract(vec.sum(p,[0,a,-a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,-a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,a,-a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,-a,-a]),color,[s,r,r,r]);

        tesseract(vec.sum(p,[a,0,-a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,-a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,0,-a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,-a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[0,0,-a,0]),vec.dec([1,0,1,0.1],[0,0,0,0.5]),[s,s,r,s]);
    }
    if(pos=="w+"){
        tesseract(vec.sum(p,[0,a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,a,-a,a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,-a,a]),color,[s,r,r,r]);
        
        tesseract(vec.sum(p,[a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,0,-a,a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,-a,a]),color,[r,s,r,r]);

        tesseract(vec.sum(p,[a,a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[a,-a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,-a,0,a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,0,0,a]),vec.dec([1,0.5,0.5,0.1],[0,0,0,0.5]),[s,s,s,r]);
    }
    if(pos=="w-"){
        tesseract(vec.sum(p,[0,a,a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,a,-a,-a]),color,[s,r,r,r]);
        tesseract(vec.sum(p,[0,-a,-a,-a]),color,[s,r,r,r]);
        
        tesseract(vec.sum(p,[a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[a,0,-a,-a]),color,[r,s,r,r]);
        tesseract(vec.sum(p,[-a,0,-a,-a]),color,[r,s,r,r]);

        tesseract(vec.sum(p,[a,a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[a,-a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[-a,-a,0,-a]),color,[r,r,s,r]);
        tesseract(vec.sum(p,[0,0,0,-a]),vec.dec([0.5,0.5,1,0.1],[0,0,0,0.5]),[s,s,s,r]);
    }
}
function wireframe(p,s,color){
    p=vec.prod(p,1/2);
    if(!color){
        //color=[Math.random(),Math.random(),Math.random(),0.8];
        color=[0,0.5,0.5,0.8];
    }
    var a=s/4;
    var r=s*0.1;
    tesseract(vec.sum(p,[0,-a,-a,-a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,a,-a,-a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,-a,a,-a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,a,a,-a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,-a,-a,a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,a,-a,a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,-a,a,a]),color,[s,r,r,r]);
    tesseract(vec.sum(p,[0,a,a,a]),color,[s,r,r,r]);
    
    tesseract(vec.sum(p,[-a,0,-a,-a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[a,0,-a,-a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[-a,0,a,-a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[a,0,a,-a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[-a,0,-a,a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[a,0,-a,a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[-a,0,a,a]),color,[r,s,r,r]);
    tesseract(vec.sum(p,[a,0,a,a]),color,[r,s,r,r]);

    tesseract(vec.sum(p,[-a,-a,0,-a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[a,-a,0,-a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[-a,a,0,-a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[a,a,0,-a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[-a,-a,0,a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[a,-a,0,a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[-a,a,0,a]),color,[r,r,s,r]);
    tesseract(vec.sum(p,[a,a,0,a]),color,[r,r,s,r]);

    tesseract(vec.sum(p,[-a,-a,-a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[a,-a,-a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[-a,a,-a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[a,a,-a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[-a,-a,a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[a,-a,a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[-a,a,a,0]),color,[r,r,r,s]);
    tesseract(vec.sum(p,[a,a,a,0]),color,[r,r,r,s]);
}
function jointedWireframe(p,s,color){
    p=vec.prod(p,1/2);
    const self=p;
    if(!color){
        //color=[Math.random(),Math.random(),Math.random(),0.8];
        color=[0,0.5,0.5,0.8];
    }
    var a=s/4;
    var r=s*0.1;
    tesseract(vec.sum(p,[0,-a,-a,-a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,a,-a,-a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,-a,a,-a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,a,a,-a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,-a,-a,a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,a,-a,a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,-a,a,a]),color,[s,r,r,r],"jwf",self);
    tesseract(vec.sum(p,[0,a,a,a]),color,[s,r,r,r],"jwf",self);
    
    tesseract(vec.sum(p,[-a,0,-a,-a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[a,0,-a,-a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[-a,0,a,-a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[a,0,a,-a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[-a,0,-a,a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[a,0,-a,a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[-a,0,a,a]),color,[r,s,r,r],"jwf",self);
    tesseract(vec.sum(p,[a,0,a,a]),color,[r,s,r,r],"jwf",self);

    tesseract(vec.sum(p,[-a,-a,0,-a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[a,-a,0,-a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[-a,a,0,-a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[a,a,0,-a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[-a,-a,0,a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[a,-a,0,a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[-a,a,0,a]),color,[r,r,s,r],"jwf",self);
    tesseract(vec.sum(p,[a,a,0,a]),color,[r,r,s,r],"jwf",self);

    tesseract(vec.sum(p,[-a,-a,-a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[a,-a,-a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[-a,a,-a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[a,a,-a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[-a,-a,a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[a,-a,a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[-a,a,a,0]),color,[r,r,r,s],"jwf",self);
    tesseract(vec.sum(p,[a,a,a,0]),color,[r,r,r,s],"jwf",self);
}
function coloredWireframe(p,s,t,info){
    p=vec.prod(p,1/2);
    const colorx=[0.5,0,0,t];
    const colory=[0,0,0.5,t];
    const colorz=[0,0.5,0,t];
    const colorw=[1/(2*Math.sqrt(2)),1/(2*Math.sqrt(2)),0,t];
    var a=s/4;
    var r=s*0.1;
    tesseract(vec.sum(p,[0,-a,-a,-a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,a,-a,-a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,-a,a,-a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,a,a,-a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,-a,-a,a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,a,-a,a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,-a,a,a]),colorx,[s,r,r,r],info);
    tesseract(vec.sum(p,[0,a,a,a]),colorx,[s,r,r,r],info);
    
    tesseract(vec.sum(p,[-a,0,-a,-a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[a,0,-a,-a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[-a,0,a,-a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[a,0,a,-a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[-a,0,-a,a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[a,0,-a,a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[-a,0,a,a]),colory,[r,s,r,r],info);
    tesseract(vec.sum(p,[a,0,a,a]),colory,[r,s,r,r],info);

    tesseract(vec.sum(p,[-a,-a,0,-a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[a,-a,0,-a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[-a,a,0,-a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[a,a,0,-a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[-a,-a,0,a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[a,-a,0,a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[-a,a,0,a]),colorz,[r,r,s,r],info);
    tesseract(vec.sum(p,[a,a,0,a]),colorz,[r,r,s,r],info);

    tesseract(vec.sum(p,[-a,-a,-a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[a,-a,-a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[-a,a,-a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[a,a,-a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[-a,-a,a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[a,-a,a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[-a,a,a,0]),colorw,[r,r,r,s],info);
    tesseract(vec.sum(p,[a,a,a,0]),colorw,[r,r,r,s],info);
}
function solid(p,s,t){
    p=vec.prod(p,0.5);
    var a=s/4;
    var r=s*0.1;
    tesseract(vec.sum(p,[a,0,0,0]),vec.dec([1,0,0,t],[0,0,0,0.5]),[r,s,s,s]);
    tesseract(vec.sum(p,[-a,0,0,0]),vec.dec([1,1,0,t],[0,0,0,0.5]),[r,s,s,s]);
    tesseract(vec.sum(p,[0,a,0,0]),vec.dec([0,1,0,t],[0,0,0,0.5]),[s,r,s,s]);
    tesseract(vec.sum(p,[0,-a,0,0]),vec.dec([0,1,1,t],[0,0,0,0.5]),[s,r,s,s]);
    tesseract(vec.sum(p,[0,0,a,0]),vec.dec([0,0,1,t],[0,0,0,0.5]),[s,s,r,s]);
    tesseract(vec.sum(p,[0,0,-a,0]),vec.dec([1,0,1,t],[0,0,0,0.5]),[s,s,r,s]);
    tesseract(vec.sum(p,[0,0,0,a]),vec.dec([1,0.5,0.5,t],[0,0,0,0.5]),[s,s,s,r]);
    tesseract(vec.sum(p,[0,0,0,-a]),vec.dec([0.5,0.5,1,t],[0,0,0,0.5]),[s,s,s,r]);
}
function coloredBubble(p,s,t){
    coloredWireframe(p,s,0.9);
    solid(p,s,t);
}
function bubble(p,s){
    wireframe(p,s);
    tesseract(vec.prod(p,0.5),[0,0.7,0.6,0.3],s);
}
function robot2(p){
    hypercube(vec.sum(p,[0,0,0,0]),[24,20,15,14],[0.8,0.8,0.8,1],"head",vec.sum(p,[12,0,7.5,7]));
    //直方体スクリーンは凸型
    hypercube(vec.sum(p,[0,0,-1,0]),[2,20,1,14],[0.8,0.8,0.8,1],"head",vec.sum(p,[12,0,7.5,7]));
    hypercube(vec.sum(p,[0,0,-1,0]),[24,2,1,14],[0.8,0.8,0.8,1],"head",vec.sum(p,[12,0,7.5,7]));
    hypercube(vec.sum(p,[22,0,-1,0]),[2,20,1,14],[0.8,0.8,0.8,1],"head",vec.sum(p,[12,0,7.5,7]));
    hypercube(vec.sum(p,[0,18,-1,0]),[24,2,1,14],[0.8,0.8,0.8,1],"head",vec.sum(p,[12,0,7.5,7]));
    
    hypercube(vec.sum(p,[2,2,-0.1,2]),[20,16,0.1,6],[0.5,0.5,0.5,1],"head",vec.sum(p,[12,0,7.5,7]));
    hypercube(vec.sum(p,[7,6,-0.2,1.9]),[2.2,7,0.1,0.1],[1,1,1,1],"head",vec.sum(p,[12,0,7.5,7]));
    hypercube(vec.sum(p,[15,6,-0.2,1.9]),[2.2,7,0.1,0.1],[1,1,1,1],"head",vec.sum(p,[12,0,7.5,7]));
    
    //ボディ
    //bubble(vec.sum(p,[19,-6,2.5,2.5]),5);
    hypercube(vec.sum(p,[2,-32,1.5,2]),[20,32,12,10],[0.8,0.8,0.8,1]);
    hypercube(vec.sum(p,[2+2,-29,13.5,2]),[16,28,7,10],[0.8,0.8,0.8,1]);
    //可動部
    hypercube(vec.sum(p,[-6,-30,1.5+2,3]),[8,30,8,8],[0.8,0.8,0.8,1],"rightArm",vec.sum(p,[-2,-4,7.5,5]));//関節の位置
    hypercube(vec.sum(p,[22,-30,1.5+2,3]),[8,30,8,8],[0.8,0.8,0.8,1],"leftArm",vec.sum(p,[26,-4,7.5,5]));

    hypercube(vec.sum(p,[2,-60,1.5+1.5,2.5]),[9,28,9,9],[0.8,0.8,0.8,1],"rightLeg",vec.sum(p,[6.5,-32-4.5,7.5,5]));
    hypercube(vec.sum(p,[22-8,-60,1.5+1.5,2.5]),[9,28,9,9],[0.8,0.8,0.8,1],"leftLeg",vec.sum(p,[18.5,-32-4.5,7.5,5]));
    //模様
    hypercube(vec.sum(p,[16,-7,1.4,1]),[4,1,0.1,1],[0,0.9,0.8,0.1]);
    hypercube(vec.sum(p,[16,-5.5,1.4,1]),[4,1,0.1,1],[0,0.9,0.8,0.1]);
    hypercube(vec.sum(p,[16,-10,1.4,1]),[1,2,0.1,1],[0,0.9,0.8,0.1]);
    hypercube(vec.sum(p,[17.5,-10,1.4,1]),[1,2,0.1,1],[0,0.9,0.8,0.1]);
    hypercube(vec.sum(p,[19,-10,1.4,1]),[1,2,0.1,1],[0,0.9,0.8,0.1]);
}
function cube3D(p,s,color,info,joint){
    if(!s.length){
        s=[s,s,s,s];
    }
    if(!color){
    color=[0,0.6,0.9,0.8];
    }
    tesseract(vec.sum(vec.prod(p,0.5),vec.prod(s,size/2)),color,s,info,joint);
}
function hypercube(p,s,color,info,joint,z){
    if(!s.length){
        s=[s,s,s,s];
    }
    //vector*scale+pos
    //(vector+0.5)*scale+pos
    //pos+=u*scale
    if(!color){
    color=[0,0.6,0.9,0.8];
    }
    tesseract(vec.sum(vec.prod(p,0.5),vec.prod(s,size/2)),color,s,info,joint,z);
}
var walkt=0;
function walking(){
    walkt++;
    for(const o of obj){
            if(o.info=="rightLeg"){
                o.z=clifford.product4D(o.z,clifford.rot(4,1,Math.cos(walkt/10)/20));
            }
            if(o.info=="leftLeg"){
                o.z=clifford.product4D(o.z,clifford.rot(4,1,-Math.cos(walkt/10)/20));
            }
            if(o.info=="rightArm"){
                o.z=clifford.product4D(o.z,clifford.rot(4,1,-Math.cos(walkt/10)/20));
            }
            if(o.info=="leftArm"){
                o.z=clifford.product4D(o.z,clifford.rot(4,1,Math.cos(walkt/10)/20));
            }
        }
    generateInstance();
}
var jt=0;
function jump(){
    if(jt>=0){
    for(const o of obj){
            if(o.info=="rightLeg"){
                o.z=clifford.product4D(o.z,clifford.rot(4,0,-0));
            }
            if(o.info=="leftLeg"){
                o.z=clifford.product4D(o.z,clifford.rot(4,0,0));
            }
            if(o.info=="rightArm"){
                o.z=clifford.product4D(o.z,clifford.rot(4,0,Math.cos(jt*Math.PI)/10));
            }
            if(o.info=="leftArm"){
                o.z=clifford.product4D(o.z,clifford.rot(4,0,-Math.cos(jt*Math.PI)/10));
            }
        }
        jt-=1/40;
        if(jt<0){
            for(const o of obj){
            if(o.info=="rightArm"){
                o.z=clifford.unit(4);
            }
            if(o.info=="leftArm"){
                o.z=clifford.unit(4);
            }
            }
        }
    generateInstance();
    }
}
function togeball(p,color,info){
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,1,Math.PI/4));
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,2,Math.PI/4));
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,0,Math.PI/4));
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,3,Math.PI/4));
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,4,Math.PI/4));
tesseract(p,color,[10,10,10,10],info,vec.prod(p,2),clifford.rot(4,5,Math.PI/4));
}
function animation(){
    if(key=="KeyM"){
        walking();
    }
    jump();
    if(arot[0]){
    z=clifford.product4D(z,clifford.rot(4,1,arot[1][0]));
    z=clifford.product4D(z,clifford.rot(4,2,arot[1][1]));
    z=clifford.product4D(z,clifford.rot(4,3,arot[1][2]));
    z=clifford.product4D(z,clifford.rot(4,4,arot[1][3]));
    z=clifford.product4D(z,clifford.rot(4,5,arot[1][4]));
    }
    for(const o of obj){
        if(o.info=="jwf"){
            //o.z=clifford.product4D(o.z,clifford.rot(4,3,Math.PI/180));
        }
    }
    generateInstance();
}
function coloredhypercube(p,s,info,joint,z){
    if(!s.length){
        s=[s,s,s,s];
    }
    coloredtesseract(vec.sum(vec.prod(p,0.5),vec.prod(s,size/2)),s,info,joint,z);
}
function coloredtesseract(C,S,info,joint,z){
    if(Number.isFinite(S)){
        S=[S,S,S,S];
    }
    if(joint=="self" || !joint){
    joint=vec.prod(C,2);
    }else{
    joint=vec.prod(joint,2);
    }
    const s=vec.prod(S,size/2);
    const c={x:C[0],y:C[1],z:C[2],w:C[3]};
    const f=0.5;
    const xc=[1,f,f,1];
    const yc=[f,f,1,1];
    const zc=[f,1,f,1];
    const wc=[1,1,f,1];
    const b=0.1;
    createCube(c.x-s[0]-b/100,c.y,c.z,c.w,[0,S[1]-b,S[2]-b,S[3]-b],xc,[-1,0,0,0],info,joint,z);
    createCube(c.x+s[0]+b/100,c.y,c.z,c.w,[0,S[1]-b,S[2]-b,S[3]-b],xc,[1,0,0,0],info,joint,z);

    createCube(c.x,c.y-s[1]-b/100,c.z,c.w,[S[0]-b,0,S[2]-b,S[3]-b],yc,[0,-1,0,0],info,joint,z);
    createCube(c.x,c.y+s[1]+b/100,c.z,c.w,[S[0]-b,0,S[2]-b,S[3]-b],yc,[0,1,0,0],info,joint,z);

    createCube(c.x,c.y,c.z-s[2]-b/100,c.w,[S[0]-b,S[1]-b,0,S[3]-b],zc,[0,0,-1,0],info,joint,z);
    createCube(c.x,c.y,c.z+s[2]+b/100,c.w,[S[0]-b,S[1]-b,0,S[3]-b],zc,[0,0,1,0],info,joint,z);

    createCube(c.x,c.y,c.z,c.w-s[3]-b/100,[S[0]-b,S[1]-b,S[2]-b,0],wc,[0,0,0,-1],info,joint,z);
    createCube(c.x,c.y,c.z,c.w+s[3]+b/100,[S[0]-b,S[1]-b,S[2]-b,0],wc,[0,0,0,1],info,joint,z);
}
