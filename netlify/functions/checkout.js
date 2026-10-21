// Crée une session Stripe Checkout à partir du panier.
// La clé secrète vient de la variable d'environnement STRIPE_SECRET_KEY (jamais dans le code).
var catalog=require("../../products.js");

var API="https://api.stripe.com/v1/";
// Version d'API figée : le format des réponses ne changera pas si Stripe publie une nouvelle version.
function stripe(path,body){
return fetch(API+path,{method:body?"POST":"GET",body:body?body.toString():undefined,headers:{
"Authorization":"Bearer "+process.env.STRIPE_SECRET_KEY,"Stripe-Version":"2024-06-20","Content-Type":"application/x-www-form-urlencoded"}});
}
function cents(euros){return Math.round(euros*100)}

// Les codes promo se créent dans le tableau de bord Stripe (Produits > Coupons > Codes promotionnels).
async function findPromo(code){
if(!/^[A-Za-z0-9_-]{1,40}$/.test(code))return null;
var res=await stripe("promotion_codes?active=true&limit=1&code="+encodeURIComponent(code));
if(!res.ok)return null;
var pc=(await res.json()).data[0];
if(!pc||!pc.coupon||!pc.coupon.valid)return null;
if(pc.coupon.amount_off&&pc.coupon.currency!=="eur")return null;
return pc;
}

exports.handler=async function(event){
if(event.httpMethod!=="POST")return {statusCode:405,body:"Méthode non autorisée"};
if(!process.env.STRIPE_SECRET_KEY)return json(500,{error:"Paiement non configuré (STRIPE_SECRET_KEY manquante)."});
var items;
var body;
try{body=JSON.parse(event.body||"{}");items=body.items}catch(e){return json(400,{error:"Panier illisible."})}
var code=typeof body.promo==="string"?body.promo.trim():"",pc=null;
if(code){
pc=await findPromo(code);
if(!pc)return json(400,{error:"Ce code promo n'existe pas ou n'est plus valable."});
}
if(body.check){
if(!pc)return json(400,{error:"Indiquez un code promo."});
return json(200,{ok:true,code:pc.code,percent_off:pc.coupon.percent_off||0,amount_off:pc.coupon.amount_off||0});
}
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
if(pc)f.append("discounts[0][promotion_code]",pc.id);
f.append("metadata[panier]",lines.map(function(l){return l.p.id+"x"+l.q}).join(","));

var res=await stripe("checkout/sessions",f);
var data=await res.json();
if(!res.ok){
console.error("Stripe",data.error);
// Ex. montant minimum du code non atteint : Stripe refuse la session
if(pc&&data.error&&data.error.type==="invalid_request_error")return json(400,{error:"Le code promo ne s'applique pas à ce panier."});
return json(502,{error:"Le paiement est momentanément indisponible."});
}
return json(200,{url:data.url});
};

function json(code,obj){return {statusCode:code,headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)}}
