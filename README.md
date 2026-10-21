# Site-Marchand

Boutique statique (HTML/CSS/JS) avec paiement par carte via Stripe Checkout.

## Fichiers

- `index.html`, `style.css`, `app.js` : la boutique et le panier.
- `products.js` : le catalogue (prix, stock). Lu par la boutique **et** par le serveur, qui recalcule les prix.
- `netlify/functions/checkout.js` : crée la session de paiement Stripe.
- `merci.html` : page affichée après un paiement réussi.
- `mentions-legales.html`, `cgv.html`, `confidentialite.html` : pages légales. **Les passages surlignés en jaune sont à compléter.**
- `message-envoye.html` : page affichée après l'envoi d'un formulaire.
- `fonts/` : polices hébergées sur le site (aucun appel à Google Fonts).

## À compléter avant d'ouvrir la boutique

1. **Pages légales** : remplacer chaque passage surligné en jaune (SIRET, adresse, médiateur, hébergeur…). Cherchez `class="todo"` dans les trois fichiers. Une fois rempli, supprimez la balise `<mark class="todo">`.
2. **Texte « L'atelier »** dans `index.html` : il décrit encore un atelier fictif. Racontez qui vous êtes.
3. **Coordonnées** : dans `products.js`, renseigner `CONTACT.email` et `CONTACT.whatsapp`. Le bouton WhatsApp n'apparaît que si le numéro est rempli.
4. **Photos** : mettre vos photos dans un dossier `photos/` et les lister dans `images` pour chaque produit, de préférence plusieurs angles. La fiche produit affiche alors une galerie avec zoom.
5. **Avis clients** : uniquement de vrais avis, ajoutés dans `REVIEWS` (`products.js`). La section reste cachée tant qu'il n'y en a pas.

## Formulaires (contact, newsletter, réservation)

Ils utilisent Netlify Forms, sans configuration. Les messages arrivent dans Netlify → votre site → Forms. Vous pouvez y activer une notification par e-mail. L'offre gratuite a une limite mensuelle d'envois : vérifiez-la sur netlify.com.
Pour envoyer la newsletter, exportez les adresses (CSV) vers un outil d'envoi (Brevo, Mailchimp…).

## Codes promo

Dans le tableau de bord Stripe : Catalogue de produits → Coupons → créer un coupon (ex. 10 %), puis un « code promotionnel » (ex. `BIENVENUE`). Le client le saisit dans le panier. Le serveur le vérifie auprès de Stripe, qui l'applique au paiement.

## Mise en ligne avec paiement (Netlify + Stripe)

1. Créer un compte sur [stripe.com](https://stripe.com) et récupérer la **clé secrète de test** (`sk_test_…`) dans Développeurs → Clés API.
2. Sur [netlify.com](https://netlify.com) : « Add new site » → « Import from Git » → choisir ce dépôt. Laisser les réglages par défaut (`netlify.toml` les fournit).
3. Dans Netlify : Site configuration → Environment variables → ajouter `STRIPE_SECRET_KEY` = votre clé `sk_test_…`, puis redéployer.
4. Tester avec la carte `4242 4242 4242 4242`, une date future et n'importe quel code.
5. Pour encaisser pour de vrai : activer le compte Stripe, remplacer la clé par `sk_live_…`.

Ne jamais mettre la clé secrète dans le code ni la publier sur GitHub.

## Limites connues

- Le stock de `products.js` ne baisse pas tout seul après une vente : il faut le mettre à jour à la main (les ventes apparaissent dans le tableau de bord Stripe, avec le détail du panier dans les métadonnées).
- Le paiement ne fonctionne pas en ouvrant `index.html` directement depuis l'ordinateur : il faut le site en ligne (ou `netlify dev`).
- Avant toute vente réelle : remplacer les produits fictifs et le bandeau « site d'exemple », ajouter mentions légales, CGV et politique de confidentialité.
