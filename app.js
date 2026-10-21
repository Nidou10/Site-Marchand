var PRODUCTS=[
{id:1,name:"Bol lagon",cat:"Bols",price:28,shape:"bowl",color:"#0F7A83",desc:"Bol à soupe ou petit-déjeuner, 50 cl."},
{id:2,name:"Bol ylang",cat:"Bols",price:28,shape:"bowl",color:"#E3B23C",desc:"Même forme, émail jaune pâle."},
{id:3,name:"Vase haut",cat:"Vases",price:54,shape:"vase",color:"#1F3F46",desc:"Pour trois tiges ou un bouquet sec, 28 cm."},
{id:4,name:"Mug du matin",cat:"Tasses",price:22,shape:"mug",color:"#8FB8B4",desc:"Anse large, tient bien en main, 30 cl."},
{id:5,name:"Assiette creuse",cat:"Bols",price:32,shape:"plate",color:"#C9C2B4",desc:"Pour les pâtes, le riz ou les plats à partager."},
{id:6,name:"Pichet",cat:"Vases",price:46,shape:"jug",color:"#0F5C63",desc:"Pour l'eau à table, 1 litre. Ne goutte pas."}
];
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
var cart={},cats=["Tout"].concat(PRODUCTS.map(function(p){return p.cat}).filter(function(v,i,a){return a.indexOf(v)===i})),current="Tout";
var fmt=function(n){return n.toLocaleString("fr-FR")+" €"};
document.getElementById("heroShelf").innerHTML=[["vase","#1F3F46",190],["bowl","#0F7A83",110],["jug","#0F5C63",150],["mug","#E3B23C",100]].map(function(x){return svg(x[0],x[1],x[2])}).join("");
function renderFilters(){
document.getElementById("filters").innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c===current)+'" data-c="'+c+'">'+c+'</button>'}).join("");
}
function renderGrid(){
document.getElementById("grid").innerHTML=PRODUCTS.filter(function(p){return current==="Tout"||p.cat===current}).map(function(p){
return '<article class="card"><div class="pic">'+svg(p.shape,p.color,150)+'</div><div class="body"><h3>'+p.name+'</h3><p class="desc">'+p.desc+'</p><div class="row"><span class="price">'+fmt(p.price)+'</span><button class="add" data-id="'+p.id+'">Ajouter</button></div></div></article>';
}).join("");
}
function renderCart(){
var ids=Object.keys(cart),n=0,t=0;
document.getElementById("items").innerHTML=ids.length?ids.map(function(id){
var p=PRODUCTS.filter(function(x){return x.id==id})[0],q=cart[id];n+=q;t+=q*p.price;
return '<li><span>'+p.name+'<br><small>'+fmt(p.price)+'</small></span><span class="qty"><button data-d="-1" data-id="'+id+'" aria-label="Retirer un '+p.name+'">&minus;</button>'+q+'<button data-d="1" data-id="'+id+'" aria-label="Ajouter un '+p.name+'">+</button></span></li>';
}).join(""):'<li>Votre panier est vide. Ajoutez une pièce depuis la boutique.</li>';
document.getElementById("count").textContent=n;
document.getElementById("total").textContent=fmt(t);
}
function setOpen(o){var d=document.getElementById("drawer");d.classList.toggle("open",o);d.setAttribute("aria-hidden",!o);if(o)document.getElementById("closeCart").focus()}
document.getElementById("filters").addEventListener("click",function(e){var c=e.target.getAttribute("data-c");if(c){current=c;renderFilters();renderGrid()}});
document.getElementById("grid").addEventListener("click",function(e){var id=e.target.getAttribute("data-id");if(id){cart[id]=(cart[id]||0)+1;renderCart();document.getElementById("msg").textContent="";setOpen(true)}});
document.getElementById("items").addEventListener("click",function(e){var id=e.target.getAttribute("data-id"),d=+e.target.getAttribute("data-d");if(id){cart[id]+=d;if(cart[id]<=0)delete cart[id];renderCart()}});
document.getElementById("openCart").onclick=function(){setOpen(true)};
document.getElementById("closeCart").onclick=function(){setOpen(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")setOpen(false)});
document.getElementById("checkout").onclick=function(){document.getElementById("msg").textContent=Object.keys(cart).length?"Ceci est un site d'exemple : le paiement n'est pas branché. Une vraie boutique enverrait ici vers un paiement sécurisé.":"Ajoutez d'abord une pièce au panier."};
renderFilters();renderGrid();renderCart();
