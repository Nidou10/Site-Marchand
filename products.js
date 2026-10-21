// Catalogue partagé : lu par la boutique (navigateur) et par la fonction de paiement (serveur).
// Le serveur recalcule toujours les prix à partir de ce fichier : ce que le navigateur envoie ne fait pas foi.
var PRODUCTS=[
{id:1,stock:3,name:"Bol lagon",cat:"Bols",price:28,shape:"bowl",color:"#0F7A83",desc:"Bol à soupe ou petit-déjeuner, 50 cl."},
{id:2,stock:1,name:"Bol ylang",cat:"Bols",price:28,shape:"bowl",color:"#E3B23C",desc:"Même forme, émail jaune pâle."},
{id:3,stock:2,name:"Vase haut",cat:"Vases",price:54,shape:"vase",color:"#1F3F46",desc:"Pour trois tiges ou un bouquet sec, 28 cm."},
{id:4,stock:6,name:"Mug du matin",cat:"Tasses",price:22,shape:"mug",color:"#8FB8B4",desc:"Anse large, tient bien en main, 30 cl."},
{id:5,stock:0,name:"Assiette creuse",cat:"Bols",price:32,shape:"plate",color:"#C9C2B4",desc:"Pour les pâtes, le riz ou les plats à partager."},
{id:6,stock:1,name:"Pichet",cat:"Vases",price:46,shape:"jug",color:"#0F5C63",desc:"Pour l'eau à table, 1 litre. Ne goutte pas."}
];
var SHIPPING=6.9,FREE_FROM=60;
if(typeof module!=="undefined")module.exports={PRODUCTS:PRODUCTS,SHIPPING:SHIPPING,FREE_FROM:FREE_FROM};
