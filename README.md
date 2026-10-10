# PROJET WEB2 

## Description

Ce projet consiste en la création d'un jeu en local dans le navigateur inspiré du jeu de taquin.

## Règles du jeu 

Le but du jeu et de finir avec un maximum de points. 
Il existe 3 types de pièces que le joueur peut placer sur une map de 64 cases : les ours, les renards et les poissons. 
On ne peut placer qu'une pièce au maximum sur une tuile de la map, ces tuiles peuvent être de trois types différents : plaine, forêt et eau. 
Chaque pièce interragit différemment avec le score et avec les tuiles. 

* Pieces ours : ne peut se poser que sur les tuiles plaines ou forêt. Poser un ours octroie 6 points. dans un rayon de 2 tuiles autour de celle où elle est posée, l'ours octroie 4 points par tuile forêt, 7 points par pièce poisson, -2 points par pièce renard, et -5 points par pièce ours.

* Pieces renard : ne peut se poser que sur les tuiles plaines ou forêt. Poser un renard octroie 5 points. Dans un rayon d'une tuile, le renard octroie 7 points par tuile plaine et -2 points par pièce renard.

* Pieces poisson : ne peut se poser que sur les cases eau. poser un poisson octroie 8 points. Dans un rayon d'une tuile, le poisson octroie 5 points par tuiles eau et -2 points par pièce poisson. 

Au commencement du jeu, le joueur débute au tour 1 et possède une unique pièce ours à poser. 
Au cours du jeu, le joueur a à sa disposition un pallier de score qui lui octroiera lors de son dépassement une pièce supplémentaire de chaque type (poisson, ours et renard) à poser, ce pallier incrémente le nombre de tours et augmente à chaque fois qu'il est dépassé. 
Le jeu se termine lorsque le joueur n'a plus de pièce à poser ou que les pièces ne peuvent plus être posées sur la map.

## Utilisation 

Lancement du Frontend : aller dans frontend dans le terminal et taper la commande : npm start

Lancement du Backend : aller dans backend dans le terminal et taper la commande : mvn spring-boot:run

Puis il suffit d'aller à l'adresse http://localhost:8080/ dans votre navigateur, de choisir la map de votre choix et optionnellement un nom puis de lancer.

## Outils 

Ce projet a été réalisé avec Angular pour le frontend et Java pour le backend sur le Gitlab de l'INSA Rennes avec mise en place de l'Intégration Continue via Maven. 

