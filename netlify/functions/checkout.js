// Crée une session Stripe Checkout à partir du panier.
// La clé secrète vient de la variable d'environnement STRIPE_SECRET_KEY (jamais dans le code).
var catalog=require("../../products.js");

function cents(euros){return Math.round(euros*100)}

exports.handler=async function(event){
if(event.httpMethod!=="POST")return {statusCode:405,body:"Méthode non autorisée"};
if(!process.env.STRIPE_SECRET_KEY)return json(500,{error:"Paiement non configuré (STRIPE_SECRET_KEY manquante)."});
var items;
try{items=JSON.parse(event.body||"{}").items}catch(e){return json(400,{error:"Panier illisible."})}
if(!Array.isArray(items)||!items.length)return json(400,{error:"Panier vide."});

// Les prix et le stock sont relus côté serveur : on ignore tout prix envoyé par le navigateur.
var lines=[],total=0;
for(var i=0;i<items.length;i++){
var p=catalog.PRODUCTS.filter(function(x){return x.id==items[i].id})[0],q=parseInt(items[i].qty,10);
if(!p||!(q>0))return json(400,{error:"Article inconnu."});
if(q>p.stock)return json(409,{error:"Plus assez de stock pour « "+p.name+" »."});
lines.push({p:p,q:q});total+=p.price*q;
}

var origin=process.env.URL||("https://"+event.headers.host);
var f=new URLSearchParams();
f.append("mode","payment");
f.append("locale","fr");
f.append("success_url",origin+"/merci.html?session_id={CHECKOUT_SESSION_ID}");
f.append("cancel_url",origin+"/#boutique");
f.append("shipping_address_collection[allowed_countries][0]","FR");
lines.forEach(function(l,n){
var k="line_items["+n+"]";
f.append(k+"[quantity]",l.q);
f.append(k+"[price_data][currency]","eur");
f.append(k+"[price_data][unit_amount]",cents(l.p.price));
f.append(k+"[price_data][product_data][name]",l.p.name);
f.append(k+"[price_data][product_data][description]",l.p.desc);
});
var ship=total>=catalog.FREE_FROM?0:catalog.SHIPPING;
f.append("shipping_options[0][shipping_rate_data][type]","fixed_amount");
f.append("shipping_options[0][shipping_rate_data][display_name]",ship?"Livraison":"Livraison offerte");
f.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]",cents(ship));
f.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]","eur");
f.append("metadata[panier]",lines.map(function(l){return l.p.id+"x"+l.q}).join(","));

var res=await fetch("https://api.stripe.com/v1/checkout/sessions",{
method:"POST",
headers:{"Authorization":"Bearer "+process.env.STRIPE_SECRET_KEY,"Content-Type":"application/x-www-form-urlencoded"},
body:f.toString()
});
var data=await res.json();
if(!res.ok){console.error("Stripe",data.error);return json(502,{error:"Le paiement est momentanément indisponible."})}
return json(200,{url:data.url});
};

function json(code,obj){return {statusCode:code,headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)}}
