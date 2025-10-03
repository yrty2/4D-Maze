var air=[];
var worktime=0;
var gamemode="4D";
const map=[];
var scale=8;
var hojoavailable=true;
var mazirushiavailable=true;
var win=false;
var goalPosition=[0,0,0,0];
var goalijkh=[0,0,0,0];
const algorithm="boutaoshi";
const kagi={
    amount:5,
    value:0,
    list:[]
}

const player={
    position:[0,0,0,0],
    ijkh:[0,0,0,0]
}
var mazeCreated=false;
var boxsize=10;
function generateMaze(size){
    for(let i=0; i<size; ++i){
        for(let j=0; j<size; ++j){
            for(let k=0; k<size; ++k){
                if(gamemode=="4D"){
                for(let h=0; h<size; ++h){
                    if(algorithm=="boutaoshi"){
                    var road=true;
            if(i==0 || j==0 || k==0 || h==0 || i==size-1 || j==size-1 || k==size-1 || h==size-1 || (math.mod(k,2)==0 && math.mod(h,2)==0)){
                road=false;
            }
            if(math.mod(i,2)==1 || math.mod(j,2)==1){
            if(math.mod(k*h,2)==0){
                road=false;
            }else if(Math.random()<0.6){
                road=false;
            }
            }
            map.push({
                position:vec.prod([i,j,k,h],boxsize),
                ijkh:[i,j,k,h],
                seed:Math.random(),
                michi:road
            });
                }else{
                    const rand=Math.random();
                    map.push({
                        position:[i*boxsize,j*boxsize,k*boxsize,h*boxsize],
                        ijkh:[i,j,k,h],
                        seed:rand,
                        michi:false
                    });
                        }
                }
                }else{
                    const rand=Math.random();
                    map.push({
                        position:[i*boxsize,j*boxsize,k*boxsize,0],
                        ijkh:[i,j,k,0],
                        seed:rand,
                        michi:false
                    });
                }
            }
        }
    }
    let f=vec.prod([1,1,1,1],Math.floor(size/2));
    if(gamemode=="3D"){
        f[3]=0;
    }
    player.position=vec.sum(vec.prod(f,boxsize),vec.prod([1,1,1,1],boxsize/2));
    if(gamemode=="3D"){
    player.position[3]=0;
    }
    player.ijkh=f;
    const mid=map.findIndex(e=>e.ijkh.join()==player.ijkh.join());
    if(mid!=-1){
        map[mid].michi=true;
    }
    var N=scale**3;
    if(N>1000){
        N=1000;
    }
    if(algorithm=="anahori"){
    anahori(N);
    }else{
        boutaoshi();
    }
    randomAkeru(2*scale);
    putItems();
    createKabe();
}
function boutaoshi(){
    var bou=[];
    function createbou(){
        for(let i=2; i<scale-1; i+=2){
            for(let j=2; j<scale-1; j+=2){
                for(let k=2; k<scale-1; k+=2){
                    for(let h=2; h<scale-1; h+=2){
                bou.push([i,j,k,h]);
                    }
                }
            }
        }
    }
    createbou();
    for(const b of bou){
        var v=-1;
        if(b[3]==2){
            v=get4RandomVector();
            const m=map.findIndex(e=>e.ijkh.join()==vec.sum(b,v).join());
            if(m!=-1){
                map[m].michi=false;
            }
        }else{
            v=get3RandomVector();
            const m=map.findIndex(e=>e.ijkh.join()==vec.sum(b,v).join());
            if(m!=-1){
                map[m].michi=false;
            }
        }
    }
    //棒倒し法
}
function getRandomVector(){
    if(Math.random()<1/4){
        return [math.randSign(),0,0,0];
    }else if(Math.random()<1/4){
        return [0,math.randSign(),0,0];
    }else if(Math.random()<1/4){
        return [0,0,math.randSign(),0];
    }else{
        return [0,0,0,math.randSign()];
    }
}
function get4RandomVector(){
    if(Math.random()<1/2){
        return [0,0,math.randSign(),0];
    }else{
        return [0,0,0,math.randSign()];
    }
}
function get3RandomVector(){
    if(Math.random()<2/3){
        return [0,0,math.randSign(),0];
    }else{
        return [0,0,0,1];
    }
}
function get7RandomVector(){
    if(Math.random()<2/7){
        return [math.randSign(),0,0,0];
    }else if(Math.random()<2/7){
        return [0,math.randSign(),0,0];
    }else if(Math.random()<2/7){
        return [0,0,math.randSign(),0];
    }else{
        return [0,0,0,1];
    }
}
function randomAkeru(amount){
    for(let m=0; m<amount; ++m){
        let mid=-1;
        while(mid==-1 || map[mid].ijkh[0]==0 || map[mid].ijkh[1]==0 || map[mid].ijkh[2]==0 || map[mid].ijkh[3]==0 || map[mid].ijkh[0]==scale-1 || map[mid].ijkh[1]==scale-1 || map[mid].ijkh[2]==scale-1 || map[mid].ijkh[3]==scale-1 || map[mid].michi){
        mid=math.randInt(0,map.length-1);
        }
        map[mid].michi=true;
    }
}
const ways=[];
function anahori(amount){
    var goalCreated=false;
    //穴掘り法
    var t=vec.prod([1,1,1,1],Math.floor(scale/2));
    var loop=0;
    while(loop<amount){
        var connect=getRandomVector();
        const m=map.findIndex(e=>e.ijkh.join()==vec.sum(t,connect).join());
        const m2=map.findIndex(e=>e.ijkh.join()==vec.sum(t,vec.prod(connect,2)).join());
        if(m2!=-1 && !map[m2].michi && map[m2].ijkh[0]>0 && map[m2].ijkh[1]>0 && map[m2].ijkh[2]>0 && map[m2].ijkh[3]>0 && map[m2].ijkh[0]<scale-1 && map[m2].ijkh[1]<scale-1 && map[m2].ijkh[2]<scale-1 && map[m2].ijkh[3]<scale-1){
            map[m].michi=true;
            map[m2].michi=true;
            ways.push(m2);
            t=vec.sum(t,vec.prod(connect,2));
        }else if(m2!=-1 && map[m2].michi && kagi.amount>kagi.value){
            if(Math.random()<0.2){
            putKey(map[m2].position,map[m2].ijkh);
            kagi.value++;
            }else if(!goalCreated){
        goalCreated=true;
        goalPosition=map[m2].position;
        coloredWireframe(vec.sum(goalPosition,vec.prod([1,1,1,1],boxsize/2)),boxsize,0.5,{name:"goal"});
            }
        }else{
            if(ways.length>0){
            t=map[ways[math.randInt(0,ways.length-1)]].ijkh.slice();
            loop++;
            }
        }
    }
    if(!goalCreated){
        const w=ways[math.randInt(0,ways.length-1)];
        goalCreated=true;
        goalPosition=map[w].position;
        coloredWireframe(vec.sum(goalPosition,vec.prod([1,1,1,1],boxsize/2)),boxsize,0.5,{name:"goal"});
    }
}
function createKabe(){
    for(const m of map){
        if(!m.michi){
            const C=math.hsl2rgb(math.rand(0,360),0.5,0.55);
            const s=0.1;
            hypercube(vec.sum(m.position,[s,s,s,s]),vec.dec([boxsize,boxsize,boxsize,boxsize*(gamemode=="4D")],[2*s,2*s,2*s,2*s]),[C[0],C[1],C[2],1],{seed:m.seed});
        }
    }
    generateInstance();
}
function getKey(){
    const lid=kagi.list.findIndex(e=>e.join()==player.ijkh.join());
    for(const o of obj){
        if(o.info.name=="kagi" && o.info.ijkh.join()==player.ijkh.join()){
            obj=deleteIndex(obj,obj.findIndex(e=>e.seed==o.seed)).slice();
        }
    }
    kagi.value--;
    if(kagi.value==0){
        hypercube(vec.sum(goalPosition,vec.prod([1,1,1,1],boxsize/2-1)),2,[1,0,1,0.5],{name:"kagi",ijkh:goalijkh});
    }
    if(lid!=-1){
    kagi.list=deleteIndex(kagi.list,lid).slice();
    }
    generateInstance();
}
function putItems(){
    let mid=-1;
        while(mid==-1 || !map[mid].michi){
        mid=math.randInt(0,map.length-1);
        }
    goalPosition=map[mid].position;
    goalijkh=map[mid].ijkh;
    coloredWireframe(vec.sum(goalPosition,vec.prod([1,1,1,1],boxsize/2)),boxsize,0.5,{name:"goal"});
    mid=-1;
    for(let k=0; k<kagi.amount; ++k){
        while(mid==-1 || !map[mid].michi || goalijkh.join()==map[mid].ijkh.join() || kagi.list.findIndex(e=>e.join()==map[mid].ijkh.join())!=-1){
        mid=math.randInt(0,map.length-1);
        }
        putKey(map[mid].position,map[mid].ijkh);
    }
}
function putKey(p,ijkh){
    kagi.value++;
    kagi.list.push(ijkh);
    const C=[1,1,0,1];
    hypercube(vec.sum(vec.sum(p,vec.prod([1,1,1,1],boxsize/2-1/2)),[0,2,0,0]),1,[0,1,1,0.5],{name:"kagi",ijkh:ijkh});
    hypercube(vec.sum(vec.sum(p,vec.prod([1,1,1,1],boxsize/2-1)),[0,2,0.5,0]),[2,2,1,2],C,{name:"kagi",ijkh:ijkh});
    hypercube(vec.sum(vec.sum(p,vec.prod([1,1,1,1],boxsize/2-1/3)),[0,-1,0,0]),[2/3,3,2/3,2/3],C,{name:"kagi",ijkh:ijkh});
    hypercube(vec.sum(vec.sum(p,vec.prod([1,1,1,1],boxsize/2)),[1/3,-5/4,-1/3,0]),[1/2,1/2,2/3,1],C,{name:"kagi",ijkh:ijkh});
    hypercube(vec.sum(vec.sum(p,vec.prod([1,1,1,1],boxsize/2)),[1/3,-1/2,-1/3,0]),[1/2,1/2,2/3,1],C,{name:"kagi",ijkh:ijkh});
}
