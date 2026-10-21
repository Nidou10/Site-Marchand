function svg(shape,c,h){
var d={
bowl:'<path d="M10 28 H110 C108 70 84 90 60 90 C36 90 12 70 10 28Z" fill="'+c+'"/><rect x="8" y="24" width="104" height="8" rx="4" fill="'+c+'" opacity=".75"/>',
vase:'<path d="M48 10 H72 V30 C72 42 96 52 96 80 C96 102 82 112 60 112 C38 112 24 102 24 80 C24 52 48 42 48 30Z" fill="'+c+'"/><rect x="44" y="8" width="32" height="7" rx="3" fill="'+c+'" opacity=".75"/>',
mug:'<path d="M26 30 H84 V84 C84 98 74 104 55 104 C36 104 26 98 26 84Z" fill="'+c+'"/><path d="M84 42 C108 40 108 76 84 76" fill="none" stroke="'+c+'" stroke-width="9"/>',
plate:'<ellipse cx="60" cy="86" rx="54" ry="16" fill="'+c+'"/><ellipse cx="60" cy="82" rx="38" ry="9" fill="#000" opacity=".12"/>',
jug:'<path d="M34 14 H80 L84 28 C84 38 92 44 92 70 C92 98 80 108 58 108 C36 108 24 98 24 70 C24 44 34 38 34 28Z" fill="'+c+'"/><path d="M92 40 C112 40 112 82 90 82" fill="none" stroke="'+c+'" stroke-width="8"/>'
}[shape];
return '<svg viewBox="0 0 120 120" height="'+h+'" width="'+h+'" role="img" aria-label="'+shape+'">'+d+'</svg>';
}
var KEY="mwezi-cart";
var cart={},cats=["Tout"].concat(PRODUCTS.map(function(p){return p.cat}).filter(function(v,i,a){return a.indexOf(v)===i})),current="Tout",sort="",lastFocus=null;
var fmt=function(n){return n.toLocaleString("fr-FR",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+" €"};
var byId=function(id){return PRODUCTS.filter(function(x){return x.id==id})[0]};
function load(){try{var c=JSON.parse(localStorage.getItem(KEY)||"{}");Object.keys(c).forEach(function(id){var p=byId(id),q=Math.min(+c[id]||0,p?p.stock:0);if(q>0)cart[id]=q})}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
document.getElementById("heroShelf").innerHTML=[["vase","#1F3F46",190],["bowl","#0F7A83",110],["jug","#0F5C63",150],["mug","#E3B23C",100]].map(function(x){return svg(x[0],x[1],x[2])}).join("");
function renderFilters(){
document.getElementById("filters").innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c===current)+'" data-c="'+c+'">'+c+'</button>'}).join("");
}
function stockLabel(p){
var left=p.stock-(cart[p.id]||0);
if(p.stock===0)return '<span class="stock out">Vendu</span>';
if(left===0)return '<span class="stock low">Tout est dans votre panier</span>';
if(p.stock===1)return '<span class="stock low">Pièce unique</span>';
if(left<=2)return '<span class="stock low">Plus que '+left+'</span>';
return '<span class="stock">En stock</span>';
}
function renderGrid(){
var list=PRODUCTS.filter(function(p){return current==="Tout"||p.cat===current}).slice();
if(sort)list.sort(function(a,b){return sort==="asc"?a.price-b.price:b.price-a.price});
document.getElementById("grid").innerHTML=list.map(function(p){
var full=(cart[p.id]||0)>=p.stock;
return '<article class="card'+(p.stock===0?' sold':'')+'"><div class="pic">'+svg(p.shape,p.color,150)+'</div><div class="body"><h3>'+p.name+'</h3><p class="desc">'+p.desc+'</p>'+stockLabel(p)+'<div class="row"><span class="price">'+fmt(p.price)+'</span><button class="add" data-id="'+p.id+'"'+(full?' disabled':'')+'>'+(p.stock===0?'Vendu':'Ajouter')+'</button></div></div></article>';
}).join("");
}
function renderCart(){
var ids=Object.keys(cart),n=0,t=0;
document.getElementById("items").innerHTML=ids.length?ids.map(function(id){
var p=byId(id),q=cart[id];n+=q;t+=q*p.price;
return '<li><span>'+p.name+'<br><small>'+fmt(p.price)+'</small></span><span class="qty"><button data-d="-1" data-id="'+id+'" aria-label="Retirer : '+p.name+'">&minus;</button>'+q+'<button data-d="1" data-id="'+id+'" aria-label="Ajouter : '+p.name+'"'+(q>=p.stock?' disabled':'')+'>+</button></span></li>';
}).join(""):'<li>Votre panier est vide. Ajoutez une pièce depuis la boutique.</li>';
var ship=!n||t>=FREE_FROM?0:SHIPPING;
document.getElementById("count").textContent=n;
document.getElementById("subtotal").textContent=fmt(t);
document.getElementById("shipping").textContent=!n?"–":ship?fmt(ship):"Offerte";
document.getElementById("total").textContent=fmt(t+ship);
document.getElementById("ship").innerHTML=!n?"":t>=FREE_FROM?"La livraison est offerte.":"Plus que <b>"+fmt(FREE_FROM-t)+"</b> pour la livraison offerte.";
document.getElementById("ship").style.setProperty("--p",Math.min(t/FREE_FROM,1)*100+"%");
document.getElementById("checkout").disabled=!n;
save();
}
function setOpen(o){
var d=document.getElementById("drawer"),b=document.getElementById("backdrop");
if(o===d.classList.contains("open"))return;
d.classList.toggle("open",o);d.setAttribute("aria-hidden",!o);d.inert=!o;b.hidden=!o;document.body.classList.toggle("locked",o);
if(o){lastFocus=document.activeElement;document.getElementById("closeCart").focus()}else if(lastFocus)lastFocus.focus();
}
document.getElementById("filters").addEventListener("click",function(e){var c=e.target.getAttribute("data-c");if(c){current=c;renderFilters();renderGrid()}});
document.getElementById("sort").onchange=function(){sort=this.value;renderGrid()};
document.getElementById("grid").addEventListener("click",function(e){var id=e.target.getAttribute("data-id"),p=id&&byId(id);if(p&&(cart[id]||0)<p.stock){cart[id]=(cart[id]||0)+1;renderCart();renderGrid();document.getElementById("msg").textContent="";setOpen(true)}});
document.getElementById("items").addEventListener("click",function(e){var id=e.target.getAttribute("data-id"),d=+e.target.getAttribute("data-d");if(id){cart[id]=Math.min(cart[id]+d,byId(id).stock);if(cart[id]<=0)delete cart[id];renderCart();renderGrid()}});
document.getElementById("openCart").onclick=function(){setOpen(true)};
document.getElementById("closeCart").onclick=function(){setOpen(false)};
document.getElementById("backdrop").onclick=function(){setOpen(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")setOpen(false)});
document.getElementById("checkout").onclick=function(){
var btn=this,msg=document.getElementById("msg");
if(location.protocol==="file:"){msg.textContent="Le paiement ne fonctionne qu'une fois le site en ligne (Netlify).";return}
btn.disabled=true;msg.textContent="Redirection vers le paiement sécurisé…";
fetch("/.netlify/functions/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:Object.keys(cart).map(function(id){return {id:+id,qty:cart[id]}})})})
.then(function(r){return r.json()})
.then(function(d){if(d.url)location.href=d.url;else{msg.textContent=d.error||"Le paiement a échoué.";btn.disabled=false}})
.catch(function(){msg.textContent="Impossible de joindre le service de paiement. Réessayez dans un instant.";btn.disabled=false});
};
load();renderFilters();renderGrid();renderCart();
