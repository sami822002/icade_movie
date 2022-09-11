# Icade PHP test


##  Guide d'installation 

Après avoir cloné le repo,
Renseigner la valeur de ``API_KEY`` dans le fichier ``.env``


##### Rapide
- Il faut avoir installé d'abord ``php >=7 ``,``symfony cli``, ``composer`` ,``docker-compose`` et ``npm nodesjs``sur votre machine
* depuis la racine du projet,lancer les commandes suivantes:

```` composer install```` 

  ```` npm run dev ```` 
  
  ```` symfony serve -d ```` 

  * lancer le Serveur Web:
  
  ```` http://localhost:8000 ```` 
##### Dockerisation
Normalement la commande suivante suffit (il faut avoir installé``docker-compose`` sur votre machine)
- Depuis la racine du projet: lancer le fichier `install.ps1` pour Windows ou `instal.sh` pour Linux

Une fois le conteneur installé,

* lancer le Serveur Web:

   ```` http://localhost:8080 ```` 
