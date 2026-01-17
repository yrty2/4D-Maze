class geometry{
    constructor(type){
        if(["S","E","H"].indexOf(type[0])==-1){
            console.warn(`球面、平面、双曲面しかありません！${type[0]}とはなんですか？`);
        }else{
            this.type=type;
        }
    }
    get dim(){
        return parseInt(this.type.slice(1));
    }
    length(p){
        if(this.type[0]=="S"){
            return 2*Math.atan(vectorlength(p));
        }
        if(this.type[0]=="E"){
            return vectorlength(p);
        }
        if(this.type[0]=="H"){
            return 2*Math.atanh(vectorlength(p));
        }
    }
    distance(p,q){
        return this.length(this.translate(p,vectorneg(q)));
    }
    translate(p,a){
        if(this.type[0]=="S"){
            if(this.dim==2){
                return c128.quot(c128.sum(p,a),c128.sub([1,0],c128.mul(p,c128.conjugate(a))));
            }
            if(this.dim==3){
                const t=vectorlength(a);
                if(t>0){
                const pabs=vectordot(p,p);
                const u=vectornormalize(p);
                return vectormul(
                    vector.mul(
                        vectorsum(vectormul(p,1-t*t-2*t*vectordot(p,u)),vectormul(u,t*(1+pabs)))
                    ),
                    1/(1-2*t*vectordot(p,u)+t*t*pabs)
                );
                }
                return p;
            }
        }
        if(this.type[0]=="E"){
            const res=Array(this.dim);
            for(let k=0; k<p.length; ++k){
                res.push(p[k],a[k]);
            }
            return res;
        }
        if(this.type[0]=="H"){
            if(this.dim==2){
                return c128.quot(c128.sum(p,a),c128.sum([1,0],c128.mul(p,c128.conjugate(a))));
            }
            if(this.dim==3){
                const t=vectorlength(a);
                if(t>0){
                const pabs=vectordot(p,p);
                const u=vectornormalize(p);
                return vectormul(
                    vector.mul(
                        vectorsum(vectormul(p,1+t*t+2*t*vectordot(p,u)),vectormul(u,t*(1-pabs)))
                    ),
                    1/(1+2*t*vectordot(p,u)+t*t*pabs)
                );
                }
                return p;
            }
        }
    }
    scale(p,s){
        if(this.type[0]=="S"){
            return vectormul(p,s);
        }
        if(this.type[0]=="E"){
            return vectormul(p,s);
        }
        if(this.type[0]=="H"){
            return vectormul(p,s);
        }
    }
}
function vectormul(v,a){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]*a);
    }
    return res;
}
function vectorneg(v){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(-v[k]);
    }
    return res;
}
function vectorsum(v,u){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]+u[k]);
    }
    return res;
}
function vectorsub(v,u){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]-u[k]);
    }
    return res;
}
function vectorlength(a){
    let res=0;
    for(let k=0; k<a.length; ++k){
        res+=a[k]*a[k];
    }
    return Math.sqrt(res);
}
function vectordot(a){
    let res=0;
    for(let k=0; k<a.length; ++k){
        res+=a[k]*a[k];
    }
    return res;
}
function vectornormalize(a){
    const s=vectorlength(a);
    if(s>0){
        const res=[];
        for(let k=0; k<a.length; ++k){
            res.push(a[k]/s);
        }
        return res;
    }
    return Array(a.length).fill(0)
}
class hyperbolic{
    //双曲面
    constructor(x,y){
        if(x instanceof Float32Array){
            this.z=x;
        }else{
        //use poincare disk
        const r=Math.hypot(x,y);
        if(r==0){
            this.z=c32.zero;
        }else{
        const hypt=Math.tanh(r/2)/r;
        this.z=c32.const(hypt*x,hypt*y);
        }
        }
    }
    translate(x,y){
        this.T(new hyperbolic(x,y));
    }
    translateBack(x,y){
        return this.TB(new hyperbolic(x,y));
    }
    T(a){
        this.z=this.TB(a.z);
    }
    TB(a){
        return c32.quot(c32.sum(a,this.z),c32.sum(c32.mul(this.z,c32.conjugate(a)),c32.const(1,0)));
    }
    R(theta){
        this.z=this.RB(theta);
    }
    RB(theta){
        return c32.mul(this.z,c32.poler(1,theta));
    }
    Ra(a,theta){
        this.z=Rab(a,theta);
    }
    RaB(a,theta){
        return this.TB(c32.mul(this.TB(this.z,c32.neg(a.z)),c32.poler(1,theta)),a.z);
    }
    get length(){
        return 2*Math.atanh(c32.abs(this.z)[0]);
    }
    dist(a){
        return 2*Math.atanh(c32.abs(this.TB(c32.neg(a.z)))[0]);
    }
    get arg(){
        return c32.arg(this.z)[0];
    }
    angle(a){
        return c32.arg(hyperbolicGeometry.translate(a.z,c32.neg(this.z)))[0];
    }
    geodesic(a,d){
        if(!d){
            d=12;
        }
        //aまでの直線
        const points=[];
        for(let k=0; k<=d; ++k){
            const theta=this.angle(a);
            const t=this.dist(a)*k/d;
            points.push(hyperbolicGeometry.translate(c32.poler(Math.tanh(t/2),theta),this.z));
        }
        return points;
    }
    plot(canvas,context){
        context.beginPath();
        context.arc((canvas.height*this.x+canvas.width)/2,canvas.height*(-this.y+1)/2,5,0,2*Math.PI);
        context.fill();
        context.closePath();
    }
    get vector(){
        return this.z;
    }
    get klein(){
        //ベルトラミ・クラインモデル
        const abs=c32.abs(this.z)[0];
        return c32.prod(c32.prod(this.z,2),1/(1+abs*abs));
    }
    get upperhalf(){
        //上半平面
        const z=c32.const(this.y,-this.x);   
        return c32.sub(c32.mul(c32.quot(c32.sum(c32.one,z),c32.sub(c32.one,z)),c32.i),c32.i);
    }
    disk(f){
        //0でクライン、1でポアンカレ
        const abs=c32.abs(this.z)[0];
        return c32.prod(c32.prod(this.z,2),1/(1+f+abs*abs*(1-f)));
    }
    scale(a){
        const abs=c32.abs(this.z)[0];
        this.z=c32.prod(this.z,Math.tanh(a*Math.atanh(abs))/abs);
    }
    SB(a){
        const abs=c32.abs(this.z)[0];
        return c32.prod(this.z,Math.tanh(a*Math.atanh(abs))/abs);
    }
    get x(){
        return this.z[0];
    }
    get y(){
        return this.z[1];
    }
}
const hyperbolicGeometry={
    distance(a,b){
        const as=Math.hypot(a[0],a[1]);
        const bs=Math.hypot(b[0],b[1]);
        const as2=as*as;
        const bs2=bs*bs;
        const res=Math.acosh(((as2+1)*(bs2+1)-4*as*bs*Math.cos(Math.atan2(b[1],b[0])-Math.atan2(a[1],a[0])))/((as2-1)*(bs2-1)));
        if(isNaN(res)){
            return 0;
        }
        return res;
    },
    arg(p){
        return c32.arg(p)[0];
    },
    midpoint(p,q){
        //pもqも複素数であるとする。
        return this.translate(c32.poler(Math.tanh(this.distance(p,q)/4),this.arg(this.translate(p,c32.neg(q)))),q);
    },
    translate(z,a){
        return c32.quot(c32.const(a[0]+z[0],a[1]+z[1]),c32.sum(c32.mul(z,c32.conjugate(a)),c32.one));
    },
    //鏡映変換
    reflection(p,q,point){
        const m=this.midpoint(p,q);
        return this.translate(c32.neg(point),this.scale(m,2));
    },
    reflectionPolygon(p,q,H){
        const m=this.midpoint(p,q);
        //中点m,多角形H
        const res=[];
        for(const h of H){
            if(h instanceof hyperbolic){
                res.push(new hyperbolic(this.translate(c32.neg(h.z),this.scale(m,2))));
            }else{
                res.push(this.translate(c32.neg(h),this.scale(m,2)));
            }
        }
        return res;
    },
    scale(p,a){
        const abs=c32.abs(p)[0];
        return c32.prod(p,Math.tanh(a*Math.atanh(abs))/abs);
    }
}
class topology{
}
const projection={
    //射影
    orthogonal(cart){
        if(cart.z>0){
        return new cartesian2D(cart.x,cart.y);
        }
    },
    perspective(cart){
        if(cart.z>0){
            return new cartesian2D(cart.x/cart.z,cart.y/cart.z);
        }
    },
    stereographic(pole){
        if(pole.constructor==polerSpherical){
        return (new cartesian2D(Math.cos(pole.theta)*Math.sin(pole.phi),
                Math.sin(pole.theta)*Math.sin(pole.phi))).scale(pole.radius/(1-Math.cos(pole.phi)));
        }
        return (new cartesian2D(pole.x,pole.y)).scale(1/(1-pole.z/pole.r));
    },
    stereographic3D(pole){
        return (new cartesian(pole.x,pole.y,pole.z)).scale(1/(1-pole.w/pole.r));
    },
    poincareDisk(hyp){
        return hyp;
    },
    klein(hyp){
        //ベルトラミ・クラインモデル
        const abs=c32.abs(hyp)[0];
        return c32.prod(c32.prod(hyp,2),1/(1+abs*abs));
    },
    upperhalf(hyp){
        //上半平面
        const z=c32.const(hyp[1],-hyp[0]);   
        return c32.sub(c32.mul(c32.quot(c32.sum(c32.one,z),c32.sub(c32.one,z)),c32.i),c32.i);
    },
    disk(hyp,f){
        //0でクライン、1でポアンカレ
        const abs=c32.abs(hyp)[0];
        return c32.prod(c32.prod(hyp,2),1/(1+f+abs*abs*(1-f)));
    }
}
function Cl(hyperbolic,imaginary){
    let V=Array(hyperbolic).fill(1);
    V.push(...Array(imaginary).fill(-1));
    //v is like [1,1,-1] [-1,-1,-1]
    const n=hyperbolic+imaginary;
    let cl=Array(n);
    for(let k=0; k<n; k++){
        cl[k]=k;
    }
    cl=maths.power(cl);
    //返すのは数式
    function Clmul(u,v){
        //u,v->[0,1,2] これは基底の積。最終的に昇順に。
        let a=[...u,...v];//[0,1,1,2],[1]^2は？
        let h=1;
        //入れ替えソート(符号反転が行われる。)
        while(true){
            let zyun=true;
            let hold=0;
            for(let k=0; k<a.length; ++k){
                if(hold<=a[k]){
                }else{
                    zyun=false;
                    break;
                }
                hold=a[k];
            }
            if(zyun){
                break;
            }
            //ここに処理
            for(let k=1; k<a.length; ++k){
                if(a[k-1]>a[k]){
                    const holder=a[k-1];
                    a[k-1]=a[k];
                    a[k]=holder;
                    h*=(-1);
                }
            }
        }
        //2乗項を探す。(場合によっては符号反転が行われる)
        for(let k=1; k<a.length; ++k){
            if(a[k-1]==a[k]){
                h*=V[a[k]];
                a=[...a.slice(0,k-1),...a.slice(k+1,a.ength)]
                k--;
            }
        }
        return [a,h];
    }
    const tapes=Array(cl.length).fill("");
    //冪集合の積
    let tape="return [";
    for(let i=0; i<cl.length; ++i){
    for(let j=0; j<cl.length; ++j){
        const a=Clmul(cl[i],cl[j]);
        const id=cl.findIndex(e=>e.join()==a[0].join());
        if(id!=-1){
            let hugou="+";
            if(a[1]==-1){
                hugou="-";
            }else if(tapes[id].length==0){
                hugou="";
            }
            tapes[id]+=`${hugou}p[${i}]*q[${j}]`;
        }else{
            console.warn("おい！おかしいぞ！");
        }
    }
    }
    for(let k=0; k<tapes.length; ++k){
        tape+=tapes[k];
        if(k+1<tapes.length){
            tape+=",";
        }
    }
    return tape+"]";
}
const c128={
    const(a,b){
        return [a,b];
    },
    one:[1,0],
    real(a){
        return [a,0];
    },
    imag(a){
        return [0,a];
    },
    i:[0,1],
    zero:[0,0],
    neg(z){
        return [-z[0],-z[1]];
    },
    poler(radius,theta){
        return [radius*Math.cos(theta),radius*Math.sin(theta)];
    },
    prod(z,x){
        return [z[0]*x,z[1]*x];
    },
    exp(z){
        const r=Math.exp(z[0]);
        return [r*Math.cos(z[1]),r*Math.sin(z[1])];
    },
    mul(z,w){
        return [z[0]*w[0]-z[1]*w[1],z[0]*w[1]+z[1]*w[0]]
    },
    sum(z,w){
        return [z[0]+w[0],z[1]+w[1]];
    },
    sub(z,w){
        return [z[0]+w[0],z[1]+w[1]];
    },
    abs(z){
        return Math.sqrt(z[0]*z[0]+z[1]*z[1]);
    },
    normalize(z){
        return this.prod(z,1/Math.sqrt(z[0]*z[0]+z[1]*z[1]));
    },
    conjugate(z){
        return [z[0],-z[1]];
    },
    quot(z,w){
        if(w[1]==0){
            return [z[0]/w[0],z[1]/w[0]];
        }
        return this.prod(this.mul(z,this.conjugate(w)),1/(w[0]*w[0]+w[1]*w[1]));
    },
    arg(z){
        return Math.atan2(z[1],z[0]);
    },
    log(z){
        return [Math.log(z[0]*z[0]+z[1]*z[1])/2,Math.atan2(z[1],z[0])];
    },
    pow(z,w){
        if(w[1]==0){
            const theta=w[0]*Math.atan2(z[1],z[0]);
            const r=Math.pow(z[0]*z[0]+z[1]*z[1],w[0]/2);
            return [r*Math.cos(theta),r*Math.sin(theta)];
        }else{
            const theta=Math.atan2(z[1],z[0]);
            const lnr=Math.log(z[0]*z[0]+z[1]*z[1])/2;
            const r=Math.exp(w[0]*lnr-w[1]*theta);
            const phi=w[0]*theta+w[1]*lnr;
            return [r*Math.cos(phi),r*Math.sin(phi)];
        }
    }
}
//for rendering
//うまくいってない。これはそのうちやる
const GPUworkflow=[];
class WGPU{
    constructor(geometry,uniformsize,wgsl){
        this.inst=[];
        this.geometry=geometry;
        this.uniform=Array(uniformsize).fill(0);
        this.wgsl=wgsl;
        this.inst=new Float32Array(1);
        this.vertex=new Float32Array(1);
        this.index=new Uint16Array(1);
    }
    bindvertex(v){
        this.vertex=new Float32Array(v);
    }
    bindindex(u){
        this.index=new Uint16Array(u);
    }
    async initialize(canvas,vertconfig,instanceconfig){
        canvas.width=screen.width;
        canvas.height=screen.height;
        this.vertconfig=vertconfig;
        this.instanceconfig=instanceconfig;
        this.canvas=canvas;
        this.background=[1,1,1];
        this.context=canvas.getContext('webgpu');
        this.adapter=await navigator.gpu.requestAdapter();
        this.device=await this.adapter.requestDevice();
        this.presentationFormat=navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            alphaMode: 'opaque'
        });
        this.depthTexture=this.device.createTexture({
            size: [this.canvas.width,this.canvas.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        //ランタイムで内容を変化させたい。
        let bufferposition=0;
        let shaderLocations=0;
        const pipelinebuffers={vertex:{arrayStride:0,attributes:[]},instance:{arrayStride:0,stepMode:"instance",attributes:[]}}
        for(let k=0; k<this.vertconfig.length; ++k){
            pipelinebuffers.vertex.attributes.push({shaderLocation:shaderLocations,offset:bufferposition,format:this.vertconfig[k]});
            switch (this.vertconfig[k]){
                case "float32":
                    bufferposition+=4;
                    break;
                case "float32x2":
                    bufferposition+=8;
                    break;
                case "float32x3":
                    bufferposition+=12;
                    break;
                case "float32x4":
                    bufferposition+=16;
                    break;
            }
            shaderLocations++;
        }
        pipelinebuffers.vertex.arrayStride=bufferposition;
        bufferposition=0;
        for(let k=0; k<this.instanceconfig.length; ++k){
            pipelinebuffers.instance.attributes.push({shaderLocation:shaderLocations,offset:bufferposition,format:this.instanceconfig[k]});
            switch (this.instanceconfig[k]){
                case "float32":
                    bufferposition+=4;
                    break;
                case "float32x2":
                    bufferposition+=8;
                    break;
                case "float32x3":
                    bufferposition+=12;
                    break;
                case "float32x4":
                    bufferposition+=16;
                    break;
            }
            shaderLocations++;
        }
        pipelinebuffers.instance.arrayStride=bufferposition;
        this.inststructurecount=pipelinebuffers.instance.arrayStride/4;
        this.pipeline=this.device.createRenderPipeline({
            layout:'auto',
            vertex:{
                module:this.device.createShaderModule({code: this.wgsl}),
                entryPoint:'main',
                buffers:[pipelinebuffers.vertex,pipelinebuffers.instance],
            },
            fragment:{
                module:this.device.createShaderModule({code:this.wgsl}),
                entryPoint:'fragmain',
                targets:[
                    {
                        format:this.presentationFormat,
                        blend:{
                            color:{
                                srcFactor:'one',
                                dstFactor:'one-minus-src-alpha'
                            },
                            alpha:{
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha'
                            }
                        }
                    }
                ]
            },
            primitive:{
                topology:'triangle-list'
            },
            depthStencil:{
                depthWriteEnabled:true,
                depthCompare:'less',
                format:'depth24plus',
            }
        });
        this.verticesBuffer=this.device.createBuffer({
            size: this.vertex.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(this.verticesBuffer.getMappedRange()).set(this.vertex);
        this.verticesBuffer.unmap();
        this.indicesBuffer=this.device.createBuffer({
            size: this.index.byteLength,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true,
        });
        new Uint16Array(this.indicesBuffer.getMappedRange()).set(this.index);
        this.indicesBuffer.unmap();
        this.instanceBuffer=this.device.createBuffer({size:268435456/10,usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST});
    }
    //毎フレーム呼び出される。
    render(inst){
        const uniformBuffer=this.device.createBuffer({
            size:4*this.uniform.length,
            usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const p=new Float32Array(this.uniform);
        this.device.queue.writeBuffer(
            uniformBuffer,
            0,
            p.buffer,
            p.byteOffset,
            p.byteLength
        );
        const instp=new Float32Array(inst);
        //メモリリークの原因か？
        this.device.queue.writeBuffer(this.instanceBuffer,0,instp);
        const bindGroup=this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{binding:0,resource:{buffer:uniformBuffer}}]
        });
        const commandEncoder=this.device.createCommandEncoder();
        const renderPassDescriptor={
            colorAttachments: [
                {
                    view:this.context.getCurrentTexture().createView(),
                    clearValue:{r:this.background[0],g:this.background[1],b:this.background[2],a:1},loadOp:'clear',storeOp:'store'
                }
            ],
            depthStencilAttachment:{view: this.depthTexture.createView(),depthClearValue: 1,depthLoadOp: 'clear',depthStoreOp: 'store'}
        };
        const passEncoder=commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setVertexBuffer(0,this.verticesBuffer);
        passEncoder.setIndexBuffer(this.indicesBuffer,"uint16");
        passEncoder.setVertexBuffer(1,this.instanceBuffer);
        passEncoder.drawIndexed(this.index.length,instp.length/this.inststructurecount);
        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }
    library(geometry){
        if(geometry.type[0]=="E"){
            if(geometry.dim==2){
            }
            if(geometry.dim==3){
            }
        }
    }
}