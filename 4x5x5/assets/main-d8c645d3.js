import"./style-04dc75a2.js";let o=!1,a=!1,h=!1,c=!1,d=!1,u=!1,s;const b=await fetch("paths.json");let n=await b.json();n=n.paths;function D(){s=document.getElementById("tableBody"),m(s)}let p=null;function m(i){const l=document.getElementById("viewer");for(let e=0;e<n.length;e++){let t=i.insertRow();t.onclick=()=>{l.contentWindow.dispatchEvent(new CustomEvent("newPath",{detail:n[e]})),p?.classList.remove("selected-row"),t.classList.add("selected-row"),p=t};let w=t.insertCell(0);w.innerHTML=n[e].pathNbr;let f=t.insertCell(1);f.innerHTML=n[e].lengthFull;let g=t.insertCell(2);g.innerHTML=n[e].regularity.toFixed(3);let T=t.insertCell(3);T.innerHTML=n[e].dirSwitch;let L=t.insertCell(4);L.innerHTML=n[e].sameDir;let E=t.insertCell(5);E.innerHTML=n[e].leftTurns;let v=t.insertCell(6);v.innerHTML=n[e].rightTurns;let y=t.insertCell(7);y.innerHTML=n[e].spin}}function r(i){i==0?(o?n.sort((e,t)=>e.pathNbr-t.pathNbr):n.sort((e,t)=>t.pathNbr-e.pathNbr),o=!o):i==1?(a?n.sort((e,t)=>e.lengthFull-t.lengthFull):n.sort((e,t)=>t.lengthFull-e.lengthFull),a=!a):i==2?(h?n.sort((e,t)=>e.spin-t.spin):n.sort((e,t)=>t.spin-e.spin),h=!h):i==3?(c?n.sort((e,t)=>e.regularity-t.regularity):n.sort((e,t)=>t.regularity-e.regularity),c=!c):i==4?(d?n.sort((e,t)=>e.dirSwitch-t.dirSwitch):n.sort((e,t)=>t.dirSwitch-e.dirSwitch),d=!d):i==5&&(u?n.sort((e,t)=>e.sameDir-t.sameDir):n.sort((e,t)=>t.sameDir-e.sameDir),u=!u);var l=document.createElement("tbody");m(l),s.parentNode.replaceChild(l,s),s=l}D();const S=document.getElementById("pathNbrTh");S.addEventListener("click",()=>r(0));const C=document.getElementById("pathLengthFullTh");C.addEventListener("click",function(){r(1)});const B=document.getElementById("spinTh");B.addEventListener("click",function(){r(2)});const F=document.getElementById("pathRegTh");F.addEventListener("click",function(){r(3)});const N=document.getElementById("pathDirSwitchTh");N.addEventListener("click",function(){r(4)});const I=document.getElementById("pathSameDirTh");I.addEventListener("click",function(){r(5)});window.addEventListener("getFirstPath",function(i){document.getElementById("viewer").contentWindow.dispatchEvent(new CustomEvent("newPath",{detail:n[0]}))});