# User story

## En tant qu'utilisateur, je souhaite pouvoir choisir sur le menu un type de map et immédiatement lancer le jeu afin de pouvoir jouer.

Un menu sera disponible avec des boutons permettant de choisir de générer une map random, une par défaut ou les dernières maps jouées.

Quand un bouton est cliqué, une partie démarre. Une animation se joue pour charger la map.

## En tant qu'utilisateur, je souhaite que ma map ait 3 type de terrains différents afin d'avoir un jeu plus intéressant.

La map sera de format 10x10 cases. Elle sera située au centre de la page.

Elle sera constituée de case forêt, eau et plaine. Elle seront reconnaissables visuellement : les cases forêts auront des arbres, les cases plaines seront vertes et les cases eaux seront bleus.

## En tant qu'utilisateur, je souhaite pouvoir choisir un nom de joueur et le visualiser pendant ma partie afin de personnaliser ma partie.

Sur le menu il faut une case où l'utilisateur peut écrire et mettre son nom. Si en commençant le jeu, l'utilisateur n'a pas de nom, il faut en générer un aléatoire.

Il faut le retenir une fois que la partie est lancée et l'afficher en haut à droite pendant la partie.

Pendant la partie, l'utilisateur peut cliquer sur l'affichage et changer son nom.

## En tant qu'utilisateur, je souhaite pouvoir voir le nom de la map dans laquelle je suis afin de la distinguer des autres.

Au début d'une partie, le nom de la map sera généré automatiquement. Il sera affiché pendant la partie sur la droite de la grille.

## En tant qu'utilisateur, je souhaite que je puisse voir mon score pendant la partie afin d'améliorer mon expérience utilisateur. 

On commence avec un score de 0.

Pendant une partie, le score sera affiché et mis à jour sur la gauche de la grille. Le score sera affiché sous forme de fractions (ex : 0 / 10) où le dénominateur sera le pallier et le numérateur le score.

Le score sera sous forme de cercle et écrit en chiffres arabes.

## En tant qu'utilisateur je souhaite voir le nombre de tours que j'ai fait afin d'améliorer mon expérience utilisateur.

On commence au tour 1.

Pendant une partie, le nombre de tour sera affiché et mis à jour sur la gauche de la grille.

## En tant qu'utilisateur, je souhaite que quand j'atteigne des palliers de scores je débloque des nouvelles tuiles afin de rendre le jeu plus intéressant.

Le score sera affiché sous forme de fractions (ex : 0 / 10) où le dénominateur sera le pallier et le numérateur le score. Lorsque le pallier est dépassé, l'utilisateur reçoit une tuile de chaque animal et le nombre de tour est incrémenté.

Les palliers seront : 10, 30, 60, 100, 150, 210, 280, 360, 450, 550 et ensuite ça augmente de 100 à partir de là.

## En tant qu'utilisateur, je souhaite visualiser mes tuiles et leur différents types ainsi que le nombre que je possède afin de pouvoir les sélectionner pour jouer.

Pendant une partie, les différentes tuiles seront affichées et mises à jour sur la gauche de la grille en bas. 

Il y aura trois types de tuiles : ours, poisson et renard avec des propriétés différentes.

Au dessus à droite des visualisations des tuiles, le nombre de ce type de tuile possédé sera écrit.

## En tant qu'utilisateur, je souhaite pouvoir placer des tuiles sur les cases de la map en fonction du type de tuile afin de pouvoir jouer.

Les ours et les renards peuvent être posés sur les plaines et les bois. Les poissons peuvent être posés sur l'eau.

Une fois que les animaux sont placés, la map est mise à jour pour qu'on puisse les visualiser au bon emplacement.

## En tant qu'utilisateur, je souhaite pouvoir voir la tuile sélectionnée afin d'améliorer l'expérience utilisateur.

Après avoir cliqué pour sélectionner un animal et avant de l'avoir poser, l'animal est visible en bas à droite.

Quand aucun animal est sélectionné, le symbole de l'ensemble vide est visible à la place de l'animal.

## En tant qu'utilisateur, je souhaite que placer des tuiles ait un impact sur mon score afin de pouvoir compléter des palliers.

Au début du placement d'une tuile, toutes les cases ont une valeur de 0.

Une case adjacente compte les cases en diagonale.

Un ours met une valeur de 6 sur laquelle la case où tuile est posée. Les cases qui sont à moins de deux cases d'écart de lui qui sont des forêts ont une valeur de 4. Si il y a un poisson dans l'eau dans le rayon de deux, ça rajoute 7 sur la case poisson. Si il y a un ours dans le rayon de deux, ça pose un -5 sur cet ours.

Un poisson pose 8 sur sa case. Il pose 5 sur les cases d'eau adjacentes. Si il y a un poisson dans la case adjacente, ça lui met -2.

Un renard pose 5 sur sa case et 7 sur les cases vides de plaines adjacentes. Si il y a un renard dans une case adjacente, il lui met -2. 

Après avoir placé une tuile, les scores de toutes les cases sont additionnés, ajoutés au score général et réinitialisés à 0.

## En tant qu'utilisateur, je souhaite pouvoir voir le score que j'aurais si je place la tuile en passant sur les cases de la map afin de pouvoir plannifier une stratégie.

Lorsque la souris est mise sur une case, sans cliquer pour la sélectionner, sur chaque case dont le score va être différent de 0, la variation locale du score est affichée. Par exemple, si un renard ajoute 5 sur case et 7 sur toutes les plaines autour, une case avec un 5 écrite dessus est vue et toutes les cases autour ont un 7 sur elles.

## En tant qu'utilisateur je souhaite pouvoir annuler mon action précédente ou annuler mon annulation afin d'avoir une expérience de jeu plus confortable.

Un bouton "annuler mon action" représenté de manière conventionnelle par une flèche ainsi qu'un bouton "réeffectuer mon action" représenté de manière conventionnelle par une flèche dans l'autre sens est visualisé en bas à droite.

Lorsqu'on clique sur "annuler mon action", la dernière tuile placée est supprimée de la map, le score revient à celui qu'il était avant l'action, le nombre de tour est décrémenté si besoin et on récupère l'inventaire qu'on avait avant l'action.

Lorsqu'on clique sur "réeffectuer mon action", on inverse tout les changements cités plus tôt.

Le joueur ne peut annuler une action si il n'a encore rien fait et il ne peut réeffectuer une action si il n'a rien annulé auparavant.

## En tant qu'utilisateur, je souhaite pouvoir terminer le jeu quand je le souhaite afin d'avoir une expérience de jeu plus flexible.

Un bouton "end game" est disponible en bas à droite. Dès qu'on clique dessus, le jeu se termine.

## En tant qu'utilisateur, je souhaite que lorsque je n'ai plus de tuiles, le jeu se termine afin de ne pas être coincé sans pouvoir agir.

Quand on finit un placement sans avoir d'animaux restants et qu'on n'en récupère pas avec un pallier franchi, le jeu se termine.

## En tant qu'utilisateur, je souhaite que quand le jeu se termine, il y ait un affichage afin de faire un récapitulatif de la partie et de revenir au menu afin de recommencer une partie.

A la fin de la partie, le score final, le texte "end game" + le nom d'utilisateur et un bouton pour revenir au menu sont affichés au centre de l'écran.