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
var uniq=function(a){return a.filter(function(v,i){return a.indexOf(v)===i})};
var cart={},cats=["Tout"].concat(uniq(PRODUCTS.map(function(p){return p.cat}))),current="Tout",sort="",query="",maxPrice=0,color="",inStock=false,promo=null,lastFocus=null,shown=null;
var $=function(id){return document.getElementById(id)};
var fmt=function(n){return n.toLocaleString("fr-FR",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+" €"};
var byId=function(id){return PRODUCTS.filter(function(x){return x.id==id})[0]};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return "&#"+c.charCodeAt(0)+";"})};
var norm=function(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")};
function load(){try{var c=JSON.parse(localStorage.getItem(KEY)||"{}");Object.keys(c).forEach(function(id){var p=byId(id),q=Math.min(+c[id]||0,p?p.stock:0);if(q>0)cart[id]=q})}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
$("heroShelf").innerHTML=[["vase","#1F3F46",190],["bowl","#0F7A83",110],["jug","#0F5C63",150],["mug","#E3B23C",100]].map(function(x){return svg(x[0],x[1],x[2])}).join("");
$("color").innerHTML+=uniq(PRODUCTS.map(function(p){return p.colorName})).map(function(c){return '<option>'+esc(c)+'</option>'}).join("");

// Coordonnées directes : affichées seulement si renseignées dans products.js
var direct=[];
if(CONTACT.whatsapp)direct.push('<a class="btn wa" href="https://wa.me/'+encodeURIComponent(CONTACT.whatsapp)+'" target="_blank" rel="noopener">Écrire sur WhatsApp</a>');
if(CONTACT.email)direct.push('<a href="mailto:'+esc(CONTACT.email)+'">'+esc(CONTACT.email)+'</a>');
$("direct").innerHTML=direct.join(" ");

function crumbs(cat,name){
var h='<a href="#">Accueil</a> <span aria-hidden="true">›</span> <a href="#boutique" data-c="Tout">Boutique</a>';
if(cat&&cat!=="Tout")h+=' <span aria-hidden="true">›</span> '+(name?'<a href="#boutique" data-c="'+esc(cat)+'">'+esc(cat)+'</a>':'<span aria-current="page">'+esc(cat)+'</span>');
if(name)h+=' <span aria-hidden="true">›</span> <span aria-current="page">'+esc(name)+'</span>';
return h;
}
function stars(r){return '<span class="stars" role="img" aria-label="'+r+' sur 5">'+"★★★★★".slice(0,r)+'<span>'+"★★★★★".slice(r)+'</span></span>'}
function reviewsOf(id){return REVIEWS.filter(function(r){return r.product==id})}
function avg(list){return list.reduce(function(s,r){return s+r.rating},0)/list.length}
function stockLabel(p){
var left=p.stock-(cart[p.id]||0);
if(p.stock===0)return '<span class="stock out">Rupture de stock</span>';
if(left===0)return '<span class="stock low">Tout est dans votre panier</span>';
if(p.stock===1)return '<span class="stock low">Pièce unique</span>';
if(left<=2)return '<span class="stock low">Plus que '+left+' exemplaire'+(left>1?'s':'')+'</span>';
return '<span class="stock">En stock</span>';
}
function renderFilters(){
$("filters").innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c===current)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("");
$("crumbs").innerHTML=crumbs(current);
}
function renderGrid(){
var q=norm(query.trim());
var list=PRODUCTS.filter(function(p){
return (current==="Tout"||p.cat===current)&&(!maxPrice||p.price<=maxPrice)&&(!color||p.colorName===color)&&(!inStock||p.stock>0)
&&(!q||norm(p.name+" "+p.desc+" "+p.cat+" "+p.colorName).indexOf(q)>=0);
});
if(sort)list.sort(function(a,b){return sort==="asc"?a.price-b.price:b.price-a.price});
$("found").textContent=list.length+" pièce"+(list.length>1?"s":"");
$("grid").innerHTML=list.length?list.map(function(p){
var full=(cart[p.id]||0)>=p.stock,rv=reviewsOf(p.id);
var pic=p.images.length?'<img src="'+esc(p.images[0])+'" alt="'+esc(p.name)+'" loading="lazy">':svg(p.shape,p.color,150);
return '<article class="card'+(p.stock===0?' sold':'')+'"><a class="pic" href="#produit-'+p.id+'" tabindex="-1" aria-hidden="true">'+pic+'</a><div class="body"><h3><a href="#produit-'+p.id+'">'+esc(p.name)+'</a></h3>'
+(rv.length?'<p class="rating">'+stars(Math.round(avg(rv)))+' <small>('+rv.length+')</small></p>':'')
+'<p class="desc">'+esc(p.desc)+'</p>'+stockLabel(p)+'<div class="row"><span class="price">'+fmt(p.price)+'</span>'
+(p.stock===0?'<a class="add ghost" href="#produit-'+p.id+'">Réserver</a>':'<button class="add" data-id="'+p.id+'"'+(full?' disabled':'')+'>Ajouter</button>')
+'</div></div></article>';
}).join(""):'<p class="empty">Aucune pièce ne correspond à votre recherche. <button class="linkbtn" id="reset">Effacer les filtres</button></p>';
}
function renderReviews(){
if(!REVIEWS.length)return;
$("avis").hidden=false;
$("reviewsNote").textContent="Avis publiés tels que reçus, sans tri. La mention « Achat vérifié » signifie que nous avons vérifié la commande du client.";
$("reviews").innerHTML=REVIEWS.map(reviewCard).join("");
}
function reviewCard(r){
var p=r.product&&byId(r.product);
return '<figure class="review">'+stars(r.rating)+'<blockquote>'+esc(r.text)+'</blockquote><figcaption>'+esc(r.name)+(p?' · '+esc(p.name):'')+(r.date?' · '+new Date(r.date).toLocaleDateString("fr-FR"):'')+(r.verified?' · <span class="verified">Achat vérifié</span>':'')+'</figcaption></figure>';
}

function totals(){
var t=0,n=0;Object.keys(cart).forEach(function(id){n+=cart[id];t+=cart[id]*byId(id).price});
var d=!promo||!n?0:promo.percent_off?Math.round(t*promo.percent_off)/100:Math.min(promo.amount_off/100,t);
var ship=!n||t>=FREE_FROM?0:SHIPPING;
return {n:n,t:t,d:d,ship:ship,total:t-d+ship};
}
function renderCart(){
var ids=Object.keys(cart),s=totals();
$("items").innerHTML=ids.length?ids.map(function(id){
var p=byId(id),q=cart[id];
return '<li><span>'+esc(p.name)+'<br><small>'+fmt(p.price)+'</small></span><span class="qty"><button data-d="-1" data-id="'+id+'" aria-label="Retirer : '+esc(p.name)+'">&minus;</button>'+q+'<button data-d="1" data-id="'+id+'" aria-label="Ajouter : '+esc(p.name)+'"'+(q>=p.stock?' disabled':'')+'>+</button></span></li>';
}).join(""):'<li>Votre panier est vide. Ajoutez une pièce depuis la boutique.</li>';
$("count").textContent=s.n;
$("subtotal").textContent=fmt(s.t);
$("discountRow").hidden=!s.d;
$("discountLabel").textContent=promo?"Code "+promo.code:"Réduction";
$("discount").textContent="− "+fmt(s.d);
$("shipping").textContent=!s.n?"–":s.ship?fmt(s.ship):"Offerte";
$("total").textContent=fmt(s.total);
$("ship").innerHTML=!s.n?"":s.t>=FREE_FROM?"La livraison est offerte.":"Plus que <b>"+fmt(FREE_FROM-s.t)+"</b> pour la livraison offerte.";
$("ship").style.setProperty("--p",Math.min(s.t/FREE_FROM,1)*100+"%");
$("checkout").disabled=!s.n;
save();
}
function setOpen(o){
var d=$("drawer");
if(o===d.classList.contains("open"))return;
d.classList.toggle("open",o);d.setAttribute("aria-hidden",!o);d.inert=!o;$("backdrop").hidden=!o;document.body.classList.toggle("locked",o);
if(o){lastFocus=document.activeElement;$("closeCart").focus()}else if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
function add(id){
var p=byId(id);if(!p||(cart[id]||0)>=p.stock)return;
cart[id]=(cart[id]||0)+1;renderCart();renderGrid();$("msg").textContent="";
if($("product").open)closeProduct();
setOpen(true);
}

// Fiche produit : ouverte par l'adresse #produit-N, donc partageable
function pic(p,i){return p.images.length?'<img src="'+esc(p.images[i])+'" alt="'+esc(p.name)+(p.images.length>1?', vue '+(i+1):'')+'">':svg(p.shape,p.color,280)}
function openProduct(p){
shown=p;
var rv=reviewsOf(p.id),left=p.stock-(cart[p.id]||0);
$("pCrumbs").innerHTML=crumbs(p.cat,p.name);
$("pName").textContent=p.name;
$("pPrice").textContent=fmt(p.price)+" TTC";
$("pStock").innerHTML=stockLabel(p);
$("pDesc").textContent=p.desc;
$("pFacts").innerHTML='<li><b>Catégorie</b><span>'+esc(p.cat)+'</span></li><li><b>Couleur</b><span>'+esc(p.colorName)+'</span></li><li><b>Matière</b><span>Grès, émail sans plomb</span></li>';
$("pMain").classList.remove("zoomed");
$("pMain").innerHTML=pic(p,0);
$("pThumbs").innerHTML=p.images.length>1?p.images.map(function(src,i){return '<button data-i="'+i+'" aria-label="Voir la vue '+(i+1)+'"'+(i?'':' aria-current="true"')+'><img src="'+esc(src)+'" alt=""></button>'}).join(""):"";
$("pAdd").hidden=p.stock===0;
$("pAdd").disabled=left<=0;
$("pAdd").textContent=left>0?"Ajouter au panier":"Tout est dans votre panier";
$("pReserve").hidden=p.stock!==0;
$("pPiece").value=p.name+" (#"+p.id+")";
$("pReviews").innerHTML=rv.length?'<h3>Avis ('+rv.length+') · '+stars(Math.round(avg(rv)))+'</h3>'+rv.map(reviewCard).join(""):"";
if(!$("product").open)$("product").showModal();
}
function closeProduct(){
if($("product").open)$("product").close();
}
function route(){
var m=location.hash.match(/^#produit-(\d+)$/),p=m&&byId(m[1]);
if(p)openProduct(p);else closeProduct();
}
$("product").addEventListener("close",function(){shown=null;if(/^#produit-/.test(location.hash))history.replaceState(null,"","#boutique")});
$("product").addEventListener("click",function(e){if(e.target===this)closeProduct()});
$("closeProduct").onclick=closeProduct;
$("pAdd").onclick=function(){if(shown)add(shown.id)};
$("pThumbs").addEventListener("click",function(e){
var b=e.target.closest("button");if(!b||!shown)return;
$("pMain").classList.remove("zoomed");$("pMain").innerHTML=pic(shown,+b.dataset.i);
[].forEach.call(this.children,function(x){x.removeAttribute("aria-current")});b.setAttribute("aria-current","true");
});
// Zoom : clic pour agrandir, la loupe suit la souris
$("pMain").addEventListener("click",function(){this.classList.toggle("zoomed")});
$("pMain").addEventListener("mousemove",function(e){
var r=this.getBoundingClientRect(),el=this.firstElementChild;
if(el)el.style.transformOrigin=((e.clientX-r.left)/r.width*100)+"% "+((e.clientY-r.top)/r.height*100)+"%";
});
window.addEventListener("hashchange",route);

// Filtres
document.addEventListener("click",function(e){
var c=e.target.closest("[data-c]");
if(c){current=c.getAttribute("data-c");closeProduct();renderFilters();renderGrid()}
if(e.target.id==="reset"){query="";maxPrice=0;color="";inStock=false;current="Tout";$("q").value="";$("price").value="0";$("color").value="";$("instock").checked=false;renderFilters();renderGrid()}
});
$("q").oninput=function(){query=this.value;renderGrid()};
$("price").onchange=function(){maxPrice=+this.value;renderGrid()};
$("color").onchange=function(){color=this.value;renderGrid()};
$("sort").onchange=function(){sort=this.value;renderGrid()};
$("instock").onchange=function(){inStock=this.checked;renderGrid()};
$("grid").addEventListener("click",function(e){var id=e.target.getAttribute("data-id");if(id)add(id)});

// Panier
$("items").addEventListener("click",function(e){var id=e.target.getAttribute("data-id"),d=+e.target.getAttribute("data-d");if(id){cart[id]=Math.min(cart[id]+d,byId(id).stock);if(cart[id]<=0)delete cart[id];renderCart();renderGrid()}});
$("openCart").onclick=function(){setOpen(true)};
$("closeCart").onclick=function(){setOpen(false)};
$("backdrop").onclick=function(){setOpen(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")setOpen(false)});

// Code promo : vérifié par le serveur auprès de Stripe (les codes se créent dans le tableau de bord Stripe)
$("promoForm").onsubmit=function(e){
e.preventDefault();
var code=$("promo").value.trim(),m=$("promoMsg");
if(!code){promo=null;m.textContent="";renderCart();return}
if(location.protocol==="file:"){m.textContent="Les codes promo fonctionnent une fois le site en ligne.";return}
m.textContent="Vérification…";
fetch("/.netlify/functions/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({check:true,promo:code})})
.then(function(r){return r.json()})
.then(function(d){if(d.ok){promo=d;m.textContent="Code appliqué : "+(d.percent_off?d.percent_off+" %":fmt(d.amount_off/100))+" de réduction."}else{promo=null;m.textContent=d.error||"Code invalide."}renderCart()})
.catch(function(){m.textContent="Impossible de vérifier le code pour l'instant."});
};

$("checkout").onclick=function(){
var btn=this,msg=$("msg");
if(!$("cgv").checked){msg.textContent="Merci d'accepter les conditions générales de vente.";$("cgv").focus();return}
if(location.protocol==="file:"){msg.textContent="Le paiement ne fonctionne qu'une fois le site en ligne (Netlify).";return}
btn.disabled=true;msg.textContent="Redirection vers le paiement sécurisé…";
fetch("/.netlify/functions/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({promo:promo?promo.code:"",items:Object.keys(cart).map(function(id){return {id:+id,qty:cart[id]}})})})
.then(function(r){return r.json()})
.then(function(d){if(d.url)location.href=d.url;else{msg.textContent=d.error||"Le paiement a échoué.";btn.disabled=false}})
.catch(function(){msg.textContent="Impossible de joindre le service de paiement. Réessayez dans un instant.";btn.disabled=false});
};

load();renderFilters();renderGrid();renderCart();renderReviews();route();
