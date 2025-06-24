// Created by Nethmi Pallekankanamge

// Created by The Coding Sloth

"use strict";

/*
      GEN         RANGE
  1. Kanto      [  0 ... 151] no problems
  2. Johto      [152 ... 251] no problems
  3. Hoenn      [252 ... 386] no problems
  4. Sinnoh     [387 ... 493] no problems
  5. Unova      [494 ... 649] no problems
  6. Kalos      [650 ... 721] not all the sprites
  7. Alola      [722 ... 807] not all the sprites
*/

// These settings will result in Pokémon ranging from gen 1 to 5
// (as seen in the table above).
var min = 0;
var max = 649;

// For these values you could also enter a name, e.g. "bulbasaur".
var pokemon_player = Math.floor(Math.random() * (max - min + 1)) + min;
var pokemon_foe = Math.floor(Math.random() * (max - min + 1)) + min;

/*

  This code would not have been possible without the Pokéapi
  (https://pokeapi.co/), this is an api which contains a lot
  of data about the Pokémon games.
  Also thanks to Mickel Sánchez (https://www.sololearn.com/Profile/4059723)
  for making the code: "Who's that Pokémon?"
  (https://code.sololearn.com/WYdGxRGIJQY4/#html). If it weren't for
  that code, I would have never found out about the Pokéapi

*/

alert("- Try to defeat as many opponents as you can!\n- Reload for different Pokémon\n- Check the JS-tab for more information\n- Double tap the move you want to use");


var player = { sprites: {} },
    foe = { sprites: {} },
    health_player,
    health_foe;
var foeMoves = [tackle, tackle, splash, doubleslap, doubleslap];
var exceptions = ["ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "nidoran-m", "nidoran-f", "mr-mime", "type-null", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini"];

var changes = {
  "farfetchd": "Farfetch'd",
  "mr-mime": "Mr. Mime",
  "type-null": "Type: Null",
  "tapu-koko": "Tapu Koko",
  "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu",
  "tapu-fini": "Tapu Fini"
};

var moves = {
  "tackle": tackle,
  "splash": splash,
  "doubleslap": doubleslap
};
var pp = [35, 40, 10];
var selectedMove = "tackle";

onload = function onload() {
  health_player = parseInt(document.querySelector(".info.you > .wrap > .health").innerHTML.split("/")[1]);
  health_foe = parseInt(document.querySelector(".info.foe > .wrap > .health").innerHTML.split("/")[1]);

  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon_player).then(function (x) {
    return x.json();
  }).then(function (x) {
    if (exceptions.indexOf(x.name) == -1) x.name = x.name.split("-")[0];
    if (!!changes[x.name]) x.name = changes[x.name];
    var name1 = document.getElementsByClassName("name1");
    for (var i = 0; i < name1.length; i++) {
      name1[i].innerHTML = x.name.toUpperCase();
    }

    if (x.sprites.back_default == null) {
      alert("\n            There is no sprite available for this Pok\xE9mon,\n            please report the id or name in the comments\n             \nID: " + x.id + "\nNAME: " + x.name + "\nSIDE: back");
    }

    document.querySelector(".pokemon.you").style.backgroundImage = "url('" + x.sprites.back_default + "')";

    player = x;
  });

  loadFoe();
};

function loadFoe() {
  var again = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  document.querySelector(".opening").classList.remove("start");

  if (again) pokemon_foe = Math.floor(Math.random() * (max - min + 1)) + min;

  health_foe = parseInt(document.querySelector(".info.foe > .wrap > .health").innerHTML.split("/")[1]);

  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon_foe).then(function (x) {
    return x.json();
  }).then(function (x) {
    if (exceptions.indexOf(x.name) == -1) x.name = x.name.split("-")[0];
    if (!!changes[x.name]) x.name = changes[x.name];
    var name2 = document.getElementsByClassName("name2");
    for (var i = 0; i < name2.length; i++) {
      name2[i].innerHTML = x.name.toUpperCase();
    }

    if (x.sprites.front_default == null) {
      alert("\n            There is no sprite available for this Pok\xE9mon,\n            please report the id or name in the comments\n             \nID: " + x.id + "\nNAME: " + x.name + "\nSIDE: front");
    }

    var sprite = new Image();
    sprite.src = x.sprites.front_default;
    sprite.crossOrigin = "Anonymous";

    sprite.onload = function () {
      var canvas = document.querySelector("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0, 0, canvas.width, canvas.height);

      trimCanvas(ctx);

      canvas.style.width = "";
      canvas.style.height = "";

      foe = x;
    };

    document.querySelector(".opening").classList.add("start");
  });
}

var textSpeed = 25;
var textInterval;
function say(string) {
  clearInterval(textInterval);
  var array = string;
  array = array.split("<br/>").join("|");
  array = array.split("");
  var dialogue = document.querySelector(".dialogue > span");
  dialogue.innerHTML = "";
  var index = 0;

  clearInterval(textInterval);
  var textInterval = setInterval(function () {
    if (array[index] == "|") dialogue.innerHTML += "<br/>";else if (array[index] == "@") dialogue.innerHTML += "<span class='indicator'></span>";else dialogue.innerHTML += array[index];

    index++;
    if (index >= array.length) clearInterval(textInterval);
  }, textSpeed);
}

function selectMove(elem) {
  if (!player.name || !foe.name) return;
  if (elem.classList.length == 1) return;
  var move = elem.classList[1];
  if (move != selectedMove) selectedMove = elem.classList[1];else {
    document.querySelector(".moveselection").style.display = "none";
    ATTACK();
  }

  var a = document.querySelector(".moveselection > .moves > .arrow");
  var t = document.querySelector(".moveselection > .moveinfo > .type");
  var p = document.querySelector(".moveselection > .moveinfo > .pp");
  switch (elem.id) {
    case "0":
      a.classList.add("topleft");
      a.classList.remove("botleft");
      a.classList.remove("topright");
      a.classList.remove("botright");

      t.innerHTML = "NORMAL";
      p.innerHTML = pp[0] + "/35";
      break;
    case "1":
      a.classList.remove("topleft");
      a.classList.remove("botleft");
      a.classList.add("topright");
      a.classList.remove("botright");

      t.innerHTML = "WATER";
      p.innerHTML = pp[1] + "/40";
      break;
    case "2":
      a.classList.remove("topleft");
      a.classList.add("botleft");
      a.classList.remove("topright");
      a.classList.remove("botright");

      t.innerHTML = "NORMAL";
      p.innerHTML = pp[2] + "/10";
      break;
    case "3":
      a.classList.remove("topleft");
      a.classList.remove("botleft");
      a.classList.remove("topright");
      a.classList.add("botright");
      break;
  }
}

var attacking = false;
var attack;
function ATTACK() {
  if (health_player <= 0 || health_foe <= 0 || selectedMove == "-") return;

  if (!player.name) return;else if (attacking === false) {
    moves[selectedMove]("you");
    document.querySelector(".selectionmenu").style.display = "none";

    attacking = "you";
  }
}

function NEXT() {
  if (health_player <= 0 || health_foe <= 0 || selectedMove == "-" || attacking === false) return;

  if (attacking == "you" && attack == 99) {
    setTimeout(function () {
      foeMoves[Math.floor(Math.random() * foeMoves.length)]("foe");
    }, 500);
    attacking = "foe";
    attack = 90;
  } else if (attacking == "foe" && attack == 99) {
    say("What will<br/>" + player.name.toUpperCase() + " do? @");
    document.querySelector(".moveselection").style.display = "block";
    attacking = false;
  }
}

function tackle(dealer) {
  if (pp[0] == 0) return;
  pp[0]--;

  var taker = dealer == "you" ? "foe" : "you";
  if (taker == "you") say("Wild " + foe.name.toUpperCase() + " used<br/>TACKLE! @");else say(player.name.toUpperCase() + " used<br/>TACKLE! @");

  attack = setTimeout(function () {
    document.querySelector(".pokemon." + dealer).classList.add("tackle");
    setTimeout(function () {
      document.querySelector(".pokemon." + dealer).classList.remove("tackle");
      attack = 99;
    }, 800);

    takeDamage(taker, true, true, 600);
  }, 1000);
}

function splash(dealer) {
  if (pp[1] == 0) return;
  pp[1]--;
  var taker = dealer == "you" ? "foe" : "you";
  if (taker == "you") say("Wild " + foe.name.toUpperCase() + " used<br/>SPLASH!");else say(player.name.toUpperCase() + " used<br/>SPLASH!");

  attack = setTimeout(function () {
    document.querySelector(".pokemon." + dealer).classList.add("splash");
    setTimeout(function () {
      document.querySelector(".pokemon." + dealer).classList.remove("splash");
      say("But nothing happened! @");
      attack = 99;
    }, 2050);
  }, 1000);
}

var slapCount;
var slaps;
var slapInterval;
var taker;
function doubleslap(dealer) {
  if (pp[2] == 0) return;
  pp[2]--;

  taker = dealer == "you" ? "foe" : "you";
  if (taker == "you") say("Wild " + foe.name.toUpperCase() + " used<br/>DOUBLESLAP!");else say(player.name.toUpperCase() + " used<br/>DOUBLESLAP!");
  slapCount = 0;
  slaps = Math.floor(Math.random() * 4);

  attack = setTimeout(function () {
    takeDamage(taker, true, true, 1);
    slapInterval = setInterval(slap, 1500);
  }, 1000);
}
function slap() {
  if (taker == "foe") {
    if (health_foe <= 0) {
      clearInterval(slapInterval);
      attack = 99;
      return;
    }
  } else {
    if (health_player <= 0) {
      clearInterval(slapInterval);
      attack = 99;
      return;
    }
  }

  takeDamage(taker, true, true, 1);
  slapCount++;

  if (slapCount > slaps) {
    clearInterval(slapInterval);

    if (taker == "foe") {
      if (health_foe <= 0) {
        attack = 99;
        return;
      }
    } else {
      if (health_player <= 0) {
        attack = 99;
        return;
      }
    }

    setTimeout(function () {
      say("Hit " + (slaps + 2) + " time(s)! @");
      attack = 99;
    }, 1500);
  }
}

function takeDamage(taker, shaking, hitmarker, timeout) {
  setTimeout(function () {
    if (shaking) {
      document.querySelector(".pokemon." + taker).classList.add("shaking");
      setTimeout(function () {
        document.querySelector(".pokemon." + taker).classList.remove("shaking");
      }, 340);
    }
    if (shaking) {
      document.querySelector(".pokemon." + taker).classList.add("showHitmarker");
      setTimeout(function () {
        document.querySelector(".pokemon." + taker).classList.remove("showHitmarker");
      }, 550);
    }
    document.querySelector(".pokemon." + taker).classList.add("damaged");
    setTimeout(function () {
      document.querySelector(".pokemon." + taker).classList.remove("damaged");

      var critical = Math.random() < 0.125;
      if (taker == "foe") {
        health_foe -= 5;
        healthTo(Math.round(health_foe), "foe", critical);
      } else {
        health_player -= 5;
        healthTo(Math.round(health_player), "you", critical);
      }
    }, 800);
  }, timeout);
}

function healthTo(target, taker, crit) {
  var interval;
  if (taker == "you") {
    var health = document.querySelector(".info.you > .wrap > .health");
    var initialHealth = parseInt(health.innerHTML.split("/")[0]);
    initialHealth--;
    health.innerHTML = initialHealth + "/" + health.innerHTML.split("/")[1];

    interval = setInterval(function () {
      initialHealth--;

      health.innerHTML = initialHealth + "/" + health.innerHTML.split("/")[1];

      if (initialHealth == target) {
        clearInterval(interval);
        //if(crit)
        //  say("A critical hit! @");

        if (target <= 0) {
          health.innerHTML = "0/" + health.innerHTML.split("/")[1];
          say(player.name.toUpperCase() + " fainted!");
          document.querySelector(".pokemon.you").classList.add("fainted");
          return;
        }
      }
    }, 100);

    var bar = document.querySelector(".info.you > .wrap > .healthbar");
    bar.style.transition = "all " + 0.1 * (initialHealth - target) + "s linear";
    bar.style.width = "calc(14vmin * " + target / parseInt(health.innerHTML.split("/")[1]) + ")";
    bar.style.right = "calc(var(--font-size) + (14vmin - 14vmin * " + target / parseInt(health.innerHTML.split("/")[1]) + "))";
  } else {
    var health = document.querySelector(".info.foe > .wrap > .health");
    document.querySelector(".info.foe > .wrap > .healthbar").style.width = "calc(15vmin * " + target / parseInt(health.innerHTML.split("/")[1]) + ")";
    document.querySelector(".info.foe > .wrap > .healthbar").style.right = "calc(var(--font-size) + (15vmin - 15vmin * " + target / parseInt(health.innerHTML.split("/")[1]) + "))";
    if (target <= 0) {
      health.innerHTML = "0/" + health.innerHTML.split("/")[1];
      say("Wild " + foe.name.toUpperCase() + " fainted!");

      document.querySelector(".pokemon.foe").classList.add("fainted");

      setTimeout(function () {

        if (confirm("Do you want to take on another Pokémon?")) {
          document.querySelector(".pokemon.foe").classList.remove("fainted");

          document.querySelector(".info.foe > .wrap > .healthbar").style.width = "15vmin";
          document.querySelector(".info.foe > .wrap > .healthbar").style.right = "var(--font-size)";

          loadFoe(true);
          attack = 99;
          attacking = "foe";
          NEXT();
        }
      }, 3500);
      return;
    }
  }
}

// https://stackoverflow.com/questions/45866873/cropping-an-html-canvas-to-the-width-height-of-its-visible-pixels-content
// ctx is the 2d context of the canvas to be trimmed
// This function will return false if the canvas contains no or no non transparent pixels.
// Returns true if the canvas contains non transparent pixels
function trimCanvas(ctx) {
  // removes transparent edges
  var x, y, w, h, top, left, right, bottom, data, idx1, idx2, found, imgData;
  w = ctx.canvas.width;
  h = ctx.canvas.height;
  if (!w && !h) {
    return false;
  }
  imgData = ctx.getImageData(0, 0, w, h);
  data = new Uint32Array(imgData.data.buffer);
  idx1 = 0;
  idx2 = w * h - 1;
  found = false;
  // search from top and bottom to find first rows containing a non transparent pixel.
  for (y = 0; y < h && !found; y += 1) {
    for (x = 0; x < w; x += 1) {
      if (data[idx1++] && !top) {
        top = y + 1;
        if (bottom) {
          // top and bottom found then stop the search
          found = true;
          break;
        }
      }
      if (data[idx2--] && !bottom) {
        bottom = h - y - 1;
        if (top) {
          // top and bottom found then stop the search
          found = true;
          break;
        }
      }
    }
    if (y > h - y && !top && !bottom) {
      return false;
    } // image is completely blank so do nothing
  }
  top -= 1; // correct top
  found = false;
  // search from left and right to find first column containing a non transparent pixel.
  for (x = 0; x < w && !found; x += 1) {
    idx1 = top * w + x;
    idx2 = top * w + (w - x - 1);
    for (y = top; y <= bottom; y += 1) {
      if (data[idx1] && !left) {
        left = x + 1;
        if (right) {
          // if left and right found then stop the search
          found = true;
          break;
        }
      }
      if (data[idx2] && !right) {
        right = w - x - 1;
        if (left) {
          // if left and right found then stop the search
          found = true;
          break;
        }
      }
      idx1 += w;
      idx2 += w;
    }
  }
  left -= 1; // correct left
  if (w === right - left + 1 && h === bottom - top + 1) {
    return true;
  } // no need to crop if no change in size
  w = right - left + 1;
  h = bottom - top + 1;
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  ctx.putImageData(imgData, -left, -top);
  return true;
}