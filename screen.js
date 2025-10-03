const overcanva=document.querySelector(".overcanva");
const ctx=overcanva.getContext("2d");
function hojoscreen(){
    ctx.clearRect(0,0,overcanva.width,overcanva.height);
    const w=overcanva.width/2;
    const h=overcanva.height/2;
    if(hojo){
    ctx.fillStyle="#ffffff";
    ctx.strokeStyle="#ffffff";
    ctx.font = "50px serif";
    const f=Math.floor(scale/2);
    ctx.fillText(`x:${player.ijkh[0]-f},y:${player.ijkh[1]-f},z:${player.ijkh[2]-f},w:${player.ijkh[3]-f}`,20,60);
    ctx.fillText(`Keys:${kagi.amount-kagi.value}(${kagi.value} left)`,20,120);
    monovector([100,0,0,0],[220,600]);
    monovector([0,100,0,0],[220,600]);
    monovector([0,0,100,0],[220,600]);
    monovector([0,0,0,100],[220,600]);
    ctx.fillStyle="#dd0000";
    text("x",[100,0,0,0],[220,600]);
        ctx.fillStyle="#0000dd";
    text("y",[0,100,0,0],[220,600]);
        ctx.fillStyle="#00dd00";
    text("z",[0,0,100,0],[220,600]);
        ctx.fillStyle="#dddd00";
    text("w",[0,0,0,100],[220,600]);
        displayminimap([2*w-180,180]);
    }
    if(win){
        rotortime=20;
        view4D=10**4;
        ctx.textAlign = "center";
        ctx.font = "100px serif";
        ctx.fillStyle="#ffffff";
        ctx.fillText("You win!",w,h);
        ctx.font = "50px serif";
        ctx.fillText(`scale:${scale}x${scale}x${scale}x${scale},keys:${kagi.amount}`,w,h+150);
        ctx.fillText("Time "+theTime(endTime-startTime),w,h+100);
        player.position=[boxsize*scale/2,boxsize*scale/2,-boxsize*scale/2,-boxsize*scale*1.5];
    }
}
function text(t,p,offset){
    ctx.fillText(t,point(p,offset)[0],point(p,offset)[1]);
}
function monovector(p,offset){
    ctx.beginPath();
    ctx.lineTo(offset[0],offset[1]);
    ctx.lineTo(point(p,offset)[0],point(p,offset)[1]);
    ctx.stroke();
    ctx.closePath();
}
function point(p,offset){
    const v=clifford.rotate4D(p,z);
    const c=5;
    return vec.sum(vec.prod(vec.sum([v[0],v[1]],vec.dec(offset,[overcanva.width/2,overcanva.height/2])),c/(v[2]/100+c)),[overcanva.width/2,overcanva.height/2]);
}
function displayminimap(p){
    for(const m of map){
        const d=vec.dec(m.ijkh,player.ijkh);
        if(Math.abs(d[0])<=1 && Math.abs(d[1])<=1 && Math.abs(d[2])<=1 && Math.abs(d[3])<=1){
            const s=30;
            ctx.font = "24px serif";
            ctx.fillStyle="#ffffff";
            ctx.fillText("x+",p[0]+s,p[1]+s/2);
            ctx.fillText("x-",p[0]-s,p[1]+s/2);
            ctx.fillText("y+",p[0],p[1]+s*1.5);
            ctx.fillText("y-",p[0],p[1]-s/2);
            ctx.fillText("z+",p[0],p[1]+s*4.5);
            ctx.fillText("z-",p[0],p[1]-s*3);
            ctx.fillText("w+",p[0]+s*3.5,p[1]+s/2);
            ctx.fillText("w-",p[0]-s*3.5,p[1]+s/2);
            if(m.michi){
            ctx.fillStyle=`hsl(${Math.atan2(d[1]+3.5*d[2],d[0]+3.5*d[3])*180/Math.PI},25%,${30*(2-vec.length(d))+10}%)`;
            }else{
            ctx.fillStyle="#000000";
            }
            ctx.fillRect(p[0]+s*(d[0]+3.5*d[3]),p[1]+s*(d[1]+3.5*d[2]),s,s);
            if(marks.findIndex(e=>m.ijkh.join()==e.join())!=-1){
                ctx.fillStyle="#55ffff";
                ctx.strokeStyle="#557777";
                const g=10;
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3]),p[1]+s*(d[1]+3.5*d[2]),g,g);
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3]+1)-g,p[1]+s*(d[1]+3.5*d[2]),g,g);
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3]+1)-g,p[1]+s*(d[1]+3.5*d[2]+1)-g,g,g);
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3]),p[1]+s*(d[1]+3.5*d[2]+1)-g,g,g);
                ctx.strokeRect(p[0]+s*(d[0]+3.5*d[3]),p[1]+s*(d[1]+3.5*d[2]),g,g);
                ctx.strokeRect(p[0]+s*(d[0]+3.5*d[3]+1)-g,p[1]+s*(d[1]+3.5*d[2]),g,g);
                ctx.strokeRect(p[0]+s*(d[0]+3.5*d[3]+1)-g,p[1]+s*(d[1]+3.5*d[2]+1)-g,g,g);
                ctx.strokeRect(p[0]+s*(d[0]+3.5*d[3]),p[1]+s*(d[1]+3.5*d[2]+1)-g,g,g);
            }
        }
    }
    ctx.fillStyle="#ffffff";
}
function theTime(time){
    const t=time/1000;
    const hour=Math.floor(t/3600);
    const minute=Math.floor((t-3600*hour)/60);
    const second=Math.floor((t-60*minute-3600*hour));
    return `${hour}:${minute}:${second}`
}