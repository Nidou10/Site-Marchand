# Site-Marchand

Boutique statique (HTML/CSS/JS) avec paiement par carte via Stripe Checkout.

## Fichiers

- `index.html`, `style.css`, `app.js` : la boutique et le panier.
- `products.js` : le catalogue (prix, stock). Lu par la boutique **et** par le serveur, qui recalcule les prix.
- `netlify/functions/checkout.js` : crée la session de paiement Stripe.
- `merci.html` : page affichée après un paiement réussi.

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
