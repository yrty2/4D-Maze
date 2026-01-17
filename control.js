const marks=[];
var moveSeed=-1;
var hojo=false;
var rotortime=17;
var rotor=[];
function frame(){
    if(mezirusitime>0){
        mezirusitime--;
    }
    if(key=="Enter" || mon==4){
        if(moveSeed==-1){
            const v=clifford.rotate4D([0,0,1,0],clifford.inverse(z));
            const mid=map.findIndex(e=>e.michi && vec.length(vec.dec(vec.dec(e.ijkh,player.ijkh),v))<0.1);
            if(mid!=-1){
            moveSeed=map[mid].seed;
            player.toijkh=map[mid].ijkh;
            }
        }
    }
    if(moveSeed!=-1){
        //この辺の平行移動関数を直せばなんとかなるかも
        //周りに壁がある用に見えないようにするために、(相対座標の)w=0のみ表示するとか考えてるがなんかミスってる。
        //思ったより試行錯誤が必要。
        const mid=map.findIndex(e=>e.seed==moveSeed);
        if(mid!=-1){
            var m=map[mid];
            var f;
            if(gamemode=="3D"){
                f=[1,1,1,0];
            }else{
                f=[1,1,1,1];
            }
            const d=vec.dec(m.position,vec.dec(player.position,vec.prod(f,boxsize/2)));
            if(vec.length(d)<0.5){
                player.position=roundPosition(vec.sum(m.position,vec.prod(f,boxsize/2))).slice();
                player.ijkh=m.ijkh;
                moveSeed=-1;
                if(walked.findIndex(e=>e.join()==m.ijkh.join())==-1){
                    walked.push(m.ijkh);
                }
                if(kagi.list.findIndex(e=>e.join()==m.ijkh.join())!=-1){
                    getKey();
                }
                //踏破判定
                if(m.ijkh.join()==goalijkh.join()){
                    if(kagi.value==0){
                        youwingoal();
                    }
                }
            }else{
            player.position=vec.sum(player.position,vec.prod(d,14/(2*fps)));
            }
        }
    }
    if(!win && rotor.length>0){
        const r=rotor[0];
        if(r.mode==3 || r.mode==4){
            view4D=3.6;
        }
        if(vec.length(vec.dec(r.res,z))>6/fps){
            z=clifford.product4D(z,clifford.rot(4,r.mode,60*r.value*Math.PI/(2*rotortime*fps)));
        }else{
            z=(r.res).slice();
            rotor=deleteIndex(rotor,0).slice();
            //view4D=2.4501;
            //view4D=(2.4501+2.549999)/2;
            view4D=baseview4d;
        }
        r.timer++;
    }
    camera.position=vec.prod(player.position,-1/2);
}
function keycontrol(){
    if(key=="KeyW"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,1,Math.PI/40));
        }else{
            toz=roundCliff(clifford.product4D(toz,clifford.rot(4,1,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:1,
            value:1,
            timer:0
        });
        }
    }
    if(key=="KeyA"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,2,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,2,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:2,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="KeyS"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,1,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,1,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:1,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="KeyD"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,2,Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,2,Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:2,
            value:1,
            timer:0
        });
            }
    }
    if(key=="KeyQ"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,5,Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,5,Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:5,
            value:1,
            timer:0
        });
            }
    }
    if(key=="KeyE"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,5,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,5,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:5,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="ArrowLeft"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,3,Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,3,Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:3,
            value:1,
            timer:0
        });
            }
    }
    if(key=="ArrowRight"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,3,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,3,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:3,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="ArrowUp"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,4,Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,4,Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:4,
            value:1,
            timer:0
        });
            }
    }
    if(key=="ArrowDown"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,4,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,4,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:4,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="KeyZ"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,0,Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,0,Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:0,
            value:1,
            timer:0
        });
            }
    }
    if(key=="KeyX"){
        if(win){
            z=clifford.product4D(z,clifford.rot(4,0,-Math.PI/40));
        }else{
            toz=clifford.product4D(toz,clifford.rot(4,0,-Math.PI/2));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:0,
            value:-1,
            timer:0
        });
            }
    }
    if(key=="KeyT"){
        if(mazirushiavailable && mezirusitime==0){
            mezirushi();
            mezirusitime=300;
        }
    }
    if(key=="KeyI"){
        if(hojoavailable){
        hojo=!hojo;
        }
    }
}
function mezirushi(){
    if(marks.findIndex(e=>e.join()==player.toijkh.join())==-1){
    marks.push(player.toijkh);
    const s=2;
    for(let i=0; i<=1; ++i){
        for(let j=0; j<=1; ++j){
            for(let k=0; k<=1; ++k){
                for(let h=0; h<=1; ++h){
    hypercube(vec.sum(vec.prod(player.toijkh,boxsize),[i*(boxsize-s),j*(boxsize-s),k*(boxsize-s),h*(boxsize-s)]),s,[0,1,1,0.5]);
                }
            }
        }
    }
    generateInstance();
        }
}
function roundCliff(z){
    const a=[];
    for(let k=0; k<16; ++k){
        if(Math.abs(z[k])<0.00001){
        a.push(Math.round(z[k]));
        }else if(z[k]<1.00001 && z[k]>0.999999){
            a.push(1);
        }else if(z[k]>-1.00001 && z[k]<-0.999999){
            a.push(-1);
        }else if(z[k]<0.50001 && z[k]>0.499999){
            a.push(0.5);
        }else if(z[k]>-0.50001 && z[k]<-0.499999){
            a.push(-0.5);
        }else{
            a.push(z[k]);
        }
    }
    return a;
}
function roundPosition(v){
    const a=[];
    for(let k=0; k<4; ++k){
        a.push(Math.round(v[k]));
    }
    return a;
}
var mon=0;
var rotmon=false;
window.addEventListener("mousedown",e=>{
    rotmon=false;
    if(e.button!=0){
        if(e.button==2){
        mon=2;
        }
        if(e.button==4){
        mon=3;
            if(mazirushiavailable && mezirusitime==0){
            mezirushi();
            mezirusitime=300;
        }
        }
    }else{
    mon=1;
    }
});
window.addEventListener("mouseup",e=>{
    if(!rotmon){
            if(mon==1){
        if(moveSeed==-1){
            const v=clifford.rotate4D([0,0,1,0],clifford.inverse(z));
            const mid=map.findIndex(e=>e.michi && vec.length(vec.dec(vec.dec(e.ijkh,player.ijkh),v))<0.1);
            if(mid!=-1){
            moveSeed=map[mid].seed;
            player.toijkh=map[mid].ijkh;
            }
        }
            }
        if(mon==2){
            toz=roundCliff(clifford.product4D(toz,clifford.rot(4,5,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:5,
            value:1,
            timer:0
        });
        }
    }
    mon=0;
});
window.addEventListener("mousemove",e=>{
    if(rotor.length==0){
    const dx=e.movementX;
    const dy=e.movementY;
    const g=25;
        if(mon==1){
    if(dx>g){
        rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,2,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:2,
            value:1,
            timer:0
        });
    }
    if(dx<-g){
        rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,2,-Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:2,
            value:-1,
            timer:0
        });
    }
    if(dy>g){
    rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,1,-Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:1,
            value:-1,
            timer:0
        });
    }
        if(dy<-g){
    rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,1,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:1,
            value:1,
            timer:0
        });
    }
            }
        if(mon==2){
            if(dx>g){
        rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,3,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:3,
            value:1,
            timer:0
        });
    }
    if(dx<-g){
        rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,3,-Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:3,
            value:-1,
            timer:0
        });
    }
    if(dy>g){
    rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,4,-Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:4,
            value:-1,
            timer:0
        });
    }
        if(dy<-g){
    rotmon=true;
    toz=roundCliff(clifford.product4D(toz,clifford.rot(4,4,Math.PI/2)));
        rotor.push({
            res:toz,
            seed:Math.random(),
            mode:4,
            value:1,
            timer:0
        });
    }       
        }
    }
});