const n=500;
const b=0.5;
const g=0.15;
const tempsEtude=1000;
//Donc R0 = 4/3

let etat={
    s: n-10,
    i: 5,
    tempsEcoule: 0
}

let va1=0;
//Base pour déterminer tempsInter

let va2=0;
//Base pour déterminer evenement

let tempsInter=0;
/*
Variable aléatoire à loi exponentielle.
*/


let evenement=0;        
/*

Variable qui prend pour valeurs 
--> 0 si transition S->I
--> 1 si pas de transition
--> 2 si transition I->R

Loi de probabilité définie par :
--> P(evenement=0)=(b.s.i/n)/(b.s.i/n+g.i)
--> P(evenement=1)=(g.i)/(b.s.i/n+g.i)

*/


/*
Calcule l'état suivant
Paramètres :  Etat actuel
Retourne : Etat suivant
*/
function etatSuivant(etat){
    //assigner une valeur aléatoire à va1 et va2
    va1=Math.random();  
    va2=Math.random();
    //Déduire la valeur de dt
    tempsInter=-Math.log(va1)/((b*(etat.s)*(etat.i))/n+g*(etat.i));
    //Déduire la valeur de evenement
    if(va2<((b*(etat.s)*(etat.i)/n)/((b*(etat.s)*(etat.i)/n)+g*(etat.i)))){
        evenement=0;
    }
    else {
        evenement=1;
    }
    //Mettre à jour etat
    etat.tempsEcoule+=tempsInter;
    switch(evenement){
        case 0: //Transition S I
            etat.s--;
            etat.i++;
            break;
        case 1: //Transition I R
            etat.s=etat.s;
            etat.i--;
            break;
    }
    return etat;
}

/*
Place un point de coordonnées (t,i)
Paramètres : Etat actuel
Retourne :  Rien
*/
function ajouterPoint(etat) {
    const graphe = document.getElementById("graphe");

    const tMax = tempsEtude;     // plage temporelle
    const iMax = n;              // maximum de i (au départ)

    const x = (etat.tempsEcoule / tMax) * 1000; // 1000 = largeur du graphe
    const y = (1 - etat.i / iMax) * 400;        // 400 = hauteur du graphe (haut = i max)

    const point = document.createElement("div");
    point.className = "point";
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;

    graphe.appendChild(point);
}



//test
function tracerGraphe(arrayEtats) {
  const graphe = document.getElementById("graphe");
  graphe.innerHTML = ""; // vider le graphe

  // Trouver index du premier état où i = 0
  let idxZero = arrayEtats.findIndex(etat => etat.i === 0);
  if (idxZero === -1) idxZero = arrayEtats.length - 1;

  const tempsMax = arrayEtats[idxZero].tempsEcoule;
  const largeur = graphe.clientWidth;
  const hauteur = graphe.clientHeight;

  // Échelle X
  const scaleX = largeur / tempsMax;

  // Calcul max pour i, s et r
  const maxI = Math.max(...arrayEtats.map(e => e.i));
  const maxS = Math.max(...arrayEtats.map(e => e.s));
  const maxR = Math.max(...arrayEtats.map(e => n - (e.s + e.i)));
  const maxY = Math.max(maxI, maxS, maxR);

  // Échelle Y
  const scaleY = hauteur / maxY;

  // Fonction pour créer un point coloré
  function creerPoint(x, y, color) {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    point.style.backgroundColor = color;
    graphe.appendChild(point);
  }

  // Tracer S en bleu, I en rouge, R en vert
  arrayEtats.forEach(etat => {
    const x = etat.tempsEcoule * scaleX;
    const yS = hauteur - (etat.s * scaleY);
    const yI = hauteur - (etat.i * scaleY);
    const r = n - (etat.s + etat.i);
    const yR = hauteur - (r * scaleY);

    creerPoint(x, yS, "blue");   // S en bleu
    creerPoint(x, yI, "red");    // I en rouge
    creerPoint(x, yR, "green");  // R en vert
  });
}



function main(){
    let arrayEtats=[{
        s: etat.s,
        i: etat.i,
        tempsEcoule: etat.tempsEcoule
    }];
    while(etat.tempsEcoule<tempsEtude && etat.i>0){
        etat=etatSuivant(etat);
        arrayEtats.push({
            s: etat.s,
            i: etat.i,
            tempsEcoule: etat.tempsEcoule
        });
    }
    console.log(arrayEtats);
    tracerGraphe(arrayEtats);
}
main();