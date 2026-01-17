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
        ctx.font = "25px serif";
        ctx.fillText(`fps:${Math.round(displayfps.value*10)/10}`,2*w-300,2*h-60);
        ctx.font = "50px serif";
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
    const s=30;
    ctx.fillStyle="#00000077";
    for(let i=-1; i<=1; ++i){
        for(let j=-1; j<=1; ++j){
            ctx.fillRect(p[0]+s*(3.5*i-1),p[1]+s*(3.5*j-1),3*s,3*s);
        }
    }
    for(const m of map){
        const iskey=kagi.list.findIndex(e=>e.join()==m.ijkh.join())!=-1;
        const isgoal=goalijkh.join()==m.ijkh.join();
        const dm=vec.dec(m.ijkh,player.toijkh);
        if(m.michi && Math.abs(dm[0])<=1 && Math.abs(dm[1])<=1 && Math.abs(dm[2])<=1 && Math.abs(dm[3])<=1){
        function swap(a,b){
            const hold=d[a];
            d[a]=d[b];
            d[b]=hold;
        }
        const d=rotateijkhformap(dm,z);
        swap(1,2);
        d[1]*=-1;
        d[2]*=-1;
        if(Math.abs(d[0])<=1 && Math.abs(d[1])<=1 && Math.abs(d[2])<=1 && Math.abs(d[3])<=1){
            ctx.fillStyle="#ffffff95";
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
            if(iskey){
                ctx.strokeStyle="#95881f";
                ctx.fillStyle="#f2e92e";
                const siz=5;
                const siz2=10;
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3])+siz,p[1]+s*(d[1]+3.5*d[2])+siz,s-2*siz,s-2*siz);
                ctx.strokeRect(p[0]+s*(d[0]+3.5*d[3])+siz,p[1]+s*(d[1]+3.5*d[2])+siz,s-2*siz,s-2*siz);
                ctx.fillStyle="#55ffff";
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3])+siz2,p[1]+s*(d[1]+3.5*d[2])+siz2,s-2*siz2,s-2*siz2);
            }
            if(isgoal){
                const siz=12;
                ctx.fillStyle="#e416a3";
                ctx.fillRect(p[0]+s*(d[0]+3.5*d[3])+siz,p[1]+s*(d[1]+3.5*d[2])+siz,s-2*siz,s-2*siz);
            }
        }
            }
    }
    ctx.font="24px serif";
    ctx.fillStyle="#ffffff";
    ctx.fillText(relativeVector("x+"),p[0]+s,p[1]+s/2);
    ctx.fillText(relativeVector("x-"),p[0]-s,p[1]+s/2);
    ctx.fillText(relativeVector("z-"),p[0],p[1]+s*1.5);
    ctx.fillText(relativeVector("z+"),p[0],p[1]-s/2);
    ctx.fillText(relativeVector("y+"),p[0],p[1]+s*4.5);
    ctx.fillText(relativeVector("y-"),p[0],p[1]-s*3);
    ctx.fillText(relativeVector("w+"),p[0]+s*3.5,p[1]+s/2);
    ctx.fillText(relativeVector("w-"),p[0]-s*3.5,p[1]+s/2);
}
function theTime(time){
    const t=time/1000;
    const hour=Math.floor(t/3600);
    const minute=Math.floor((t-3600*hour)/60);
    const second=Math.floor((t-60*minute-3600*hour));
    return `${hour}:${minute}:${second}`
}
function v2n(vector){
    if(vector[0]==1){
        return "x+";
    }
    if(vector[0]==-1){
        return "x-";
    }
    if(vector[1]==1){
        return "y+";
    }
    if(vector[1]==-1){
        return "y-";
    }
    if(vector[2]==1){
        return "z+";
    }
    if(vector[2]==-1){
        return "z-";
    }
    if(vector[3]==1){
        return "w+";
    }
    if(vector[3]==-1){
        return "w-";
    }
}
function n2v(name){
    switch (name){
        case "x+":
            return [1,0,0,0];
        case "x-":
            return [-1,0,0,0];
        case "y+":
            return [0,1,0,0];
        case "y-":
            return [0,-1,0,0];
        case "z+":
            return [0,0,1,0];
        case "z-":
            return [0,0,-1,0];
        case "w+":
            return [0,0,0,1];
        case "w-":
            return [0,0,0,-1];
    }
}
function relativeVector(name){
        return v2n(rotateijkhformap(n2v(name),clifford.inverse(z)));
}
function rotateijkhformap(u,z){
    const v=clifford.rotate4D(u,z);
    for(let k=0; k<4; ++k){
        v[k]=Math.round(v[k]);
    }
    return v;
}