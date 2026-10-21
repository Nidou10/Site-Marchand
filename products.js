// Catalogue partagé : lu par la boutique (navigateur) et par la fonction de paiement (serveur).
// Le serveur recalcule toujours les prix à partir de ce fichier : ce que le navigateur envoie ne fait pas foi.
// images : chemins de vos photos (ex. ["photos/bol-lagon-1.jpg","photos/bol-lagon-2.jpg"]).
// Tant que la liste est vide, la boutique affiche l'illustration dessinée.
var PRODUCTS=[
{id:1,stock:3,name:"Bol lagon",cat:"Bols",price:28,shape:"bowl",color:"#0F7A83",colorName:"Bleu lagon",images:[],desc:"Bol à soupe ou petit-déjeuner, 50 cl."},
{id:2,stock:1,name:"Bol ylang",cat:"Bols",price:28,shape:"bowl",color:"#E3B23C",colorName:"Jaune ylang",images:[],desc:"Même forme, émail jaune pâle."},
{id:3,stock:2,name:"Vase haut",cat:"Vases",price:54,shape:"vase",color:"#1F3F46",colorName:"Bleu nuit",images:[],desc:"Pour trois tiges ou un bouquet sec, 28 cm."},
{id:4,stock:6,name:"Mug du matin",cat:"Tasses",price:22,shape:"mug",color:"#8FB8B4",colorName:"Vert d'eau",images:[],desc:"Anse large, tient bien en main, 30 cl."},
{id:5,stock:0,name:"Assiette creuse",cat:"Bols",price:32,shape:"plate",color:"#C9C2B4",colorName:"Beige sable",images:[],desc:"Pour les pâtes, le riz ou les plats à partager."},
{id:6,stock:1,name:"Pichet",cat:"Vases",price:46,shape:"jug",color:"#0F5C63",colorName:"Bleu lagon",images:[],desc:"Pour l'eau à table, 1 litre. Ne goutte pas."}
];
var SHIPPING=6.9,FREE_FROM=60;

// Avis clients : n'ajoutez que de vrais avis, recopiés tels quels, avec l'accord du client.
// Inventer ou trier des avis est une pratique commerciale trompeuse (Code de la consommation, art. L121-4).
// product : id du produit, ou null pour un avis sur l'atelier en général.
// verified : true seulement si l'avis vient d'un client dont vous avez vérifié la commande.
// Exemple : {product:1,name:"Awa D.",rating:5,date:"2026-09-12",verified:true,text:"Très beau bol, bien emballé."}
var REVIEWS=[];

// Coordonnées affichées sur le site. Laissez vide ce que vous ne voulez pas montrer.
// whatsapp : numéro au format international sans + ni espaces (ex. "262639000000").
var CONTACT={email:"",whatsapp:""};

if(typeof module!=="undefined")module.exports={PRODUCTS:PRODUCTS,SHIPPING:SHIPPING,FREE_FROM:FREE_FROM};
