var qb = {
  "init":function() {
    this.loadQuickbuildData("js/xwing-quickbuild-cards.json");
    this.loadXwingData("vendor/xwing-data2/");
  },
  //Load xwing-data
  "loadXwingData":function(vendorRoot) {
    var xwingdata_manifest = this.loadJSON(vendorRoot+"data/manifest.json");
    this.xwingdata = {
      "upgrades":[],
      "pilots":[],
      "factions":[],
      "ships":[]
    };
    //load upgrades
    for (var upgradePath of xwingdata_manifest.upgrades) {
      var data = this.loadJSON(vendorRoot+upgradePath);
      for (var upgrade of data) {
        upgrade.type = this.xws(this.getFileName(upgradePath));
        this.xwingdata.upgrades.push(upgrade);
      }
    }
    //load ships
    for (var faction of xwingdata_manifest.pilots) {
      var faction_ships = [];
      var faction_name;
      for (var shipPath of faction.ships) {
        var data = this.loadJSON(vendorRoot+shipPath);
        var ship_xws = this.xws(this.getFileName(shipPath));
        faction_ships.push(ship_xws)
        data.faction_xws = faction.faction;
        this.xwingdata.ships.push(data);
        for (var pilot of data.pilots) {
          pilot.faction_xws = faction.faction;
          pilot.ship = data;
          pilot.ship.xws = ship_xws;
          faction_name = data.faction;
          this.xwingdata.pilots.push(pilot);
        }
      }
      this.xwingdata.factions.push({"xws":faction.faction, "name":faction_name, "ships":faction_ships});
    }
  },
  "getFileName":function(path) {
    return path.split(/(\\|\/)/g).pop().replace(".json", "");
  },
  "xws":function(fullname) {
    return fullname.toLowerCase().replace(/[\W]+/g,"");;
  },
  "loadJSON":function(path) {
    var json = null;
  	$.ajax({
  		'async': false,
  		'global': false,
  		'url': path,
      'dataType': "json",
      'mimeType': "application/json",
  		'success': function (data) {
  			json = data;
  		},
      'error': function (data) {
        console.log("Error", path)
  		},
  	});
    return json;
  },

  //Load Quickbuild cards data
  "loadQuickbuildData":function(path) {
    this.quickbuilds = this.loadJSON(path);
  },

  //Display cards
  "cards":[],
  "updateSelectedCards":function(container_id, filters) {
    var ship_counter = 0;
    const page_size = 18;
    var current_page;

    $(".sheet").remove();

    for (var card of this.cards) {
      if (this.isFiltered(card, filters)) {
        continue;
      }
      if (ship_counter%page_size == 0) {
        current_page = $("<section>", {"class":"sheet", "id":"page-"+ship_counter/page_size});
        current_page.appendTo(container_id);
      }
      card.div.appendTo(current_page);
      ship_counter++;
    }
  },
  "isFiltered":function(card, filters) {
    if (card.qb.dual != null && card.qb.hasOwnProperty("docked") && filters.indexOf(this.xws(card.qb.docked.faction)+":"+card.qb.docked.ship) !== -1) {
      return true;
    }
    return filters.indexOf(card.pilot.faction_xws+":"+card.pilot.ship.xws) !== -1;
  },

  //Build cards
  "nextDual":"A",
  "dualCards":[],
  "buildCards":function() {
    for (var ship_model of this.quickbuilds) {
      for (var pilot_qb of ship_model.pilots) {
        pilot_qb.faction = ship_model.faction;
        pilot_qb.ship = ship_model.ship;
        this.buildCard(pilot_qb, null);
      }
    }
    for (var dualCard of this.dualCards) {
      this.buildCard(dualCard[0], dualCard[1]);
    }
  },
  "buildCard":function(pilot_qb, dual) {
    var card = $("<div>", {"class":"card"});
    var cost = 0;
    var cost_text = "<span class='cost-tooltip'>";

    var pilot = this.getPilot(pilot_qb.pilot, pilot_qb.ship);

    //Ship icon
    $("<i>", {"class":"ship xwing-miniatures-ship xwing-miniatures-ship-"+pilot.ship.xws}).appendTo(card);

    //Pilot name + limited
    var limited = pilot.limited == 1 ?" limited":"";
    var variant = (pilot_qb.hasOwnProperty("variant")?" variant-"+pilot_qb.variant:"");
    var force = (pilot.hasOwnProperty("force")?" forcepower forcepower-"+pilot.force:"");
    var title_text = (pilot_qb.hasOwnProperty("title")?pilot_qb.title:"") + pilot.name;
    var title = $("<div>", {"class":"name faction-"+pilot.faction_xws+limited+variant+force, "text":title_text, "title":""});
    title.tooltip({"content":"<img class='ship-card' src='"+pilot.image+"'/>"});
    title.appendTo(card);
    //update cost
    cost += pilot.cost;
    cost_text += pilot.cost+"<br/>";

    //Get all upgrades
    var upgrades = [];
    for (var qb_upg of pilot_qb.upgrades) {
      var upgrade = this.getUpgrade(qb_upg);
      if (upgrade != null){
        var upgrade_cost = this.getUpgradeCostForShip(upgrade.cost, pilot.ship);
        cost += upgrade_cost;
        cost_text += upgrade_cost+"<br/>";
        upgrades.push(upgrade);
      }
    }
    cost_text += "</span>";

    //double ship
    if (pilot_qb.hasOwnProperty("title") && pilot_qb.title == "2x ") {
      cost = cost * 2;
    }

    //Threat + Cost
    $("<span>", {"class":"threat threat-"+pilot_qb.threat, "text":pilot_qb.threat}).appendTo(card);
    var cost_span = $("<span>", {"class":"cost", "text":cost, "data-cost-detail":cost_text, "title":""});
    cost_span.tooltip({"content":function() {
      return $(this).data("cost-detail");
    }});
    cost_span.appendTo(card);

    //List of upgrades
    var upgrade_overflow = upgrades.length > 7?" upgrades-8":"";
    var ul = $("<ul>", {"class":"upgrades"+upgrade_overflow});
    for (var upgrade of upgrades) {
      if (upgrade == null) {
        $("<li>", {"class":"upgrade threat-4", "text":"ERROR"}).appendTo(ul);
      } else {
        var limited = upgrade.limited == 1 ?" limited":"";
        var force = (upgrade.sides[0].hasOwnProperty("force")?" forcepower forcepower-"+upgrade.sides[0].force:"");
        var doubleslot =  (upgrade.sides[0].slots.length == 2?" upgrade-slots-2":"");
        var li = $("<li>", {"class":"upgrade upgrade-"+upgrade.type+doubleslot, "title":""});
        li.tooltip({"content":"<img class='upgrade-card' src='"+upgrade.sides[0].image+"'/>"});
        var span = $("<span>", {"class":"upgrade-name"+limited+force, "text":upgrade.name}).appendTo(li);
        li.appendTo(ul);
      }
    }
    ul.appendTo(card);

    if (pilot_qb.hasOwnProperty("docked")) {
      dual = this.getNextDual();
      pilot_qb.docked.dual = dual;
      pilot_qb.dual = dual;
      pilot_qb.docked.faction = pilot.ship.faction;
      this.dualCards.push([pilot_qb.docked, dual]);
    }
    if (dual != null) {
      $("<span>", {"class":"dual", "text":dual}).appendTo(card);
    }

    var data = {"div":card, "pilot":pilot, "qb":pilot_qb, "upgrades":upgrades, "id":pilot_qb.id};

    var icon = $("<i>", {"class":"faction-icon faction-"+pilot.faction_xws, "data-id":data.id}).appendTo(card);
    icon.on('click', function() {
        qb.viewCard($(this).data("id"));
    });
    $("<span>", {"class":"card-id", "text":data.id}).appendTo(card);

    this.cards.push(data);
  },
  "getNextDual":function () {
      var dual = this.nextDual;
      this.nextDual = dual.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
        var c= a.charCodeAt(0);
        switch(c){
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(++c);
          }
      });
      return dual;
  },

  //card to xws
  "xwsSample": {
    "faction": null,
    "pilots": [
        {
            "id": null,
            "upgrades": {},
            "vendor": {
                "xwing-quickbuild-cards": {
                    "card_id": 30
                }
            }
        }
    ],
    "vendor": {
        "xwing-quickbuild-cards": {
            "builder": "Elaum's Quickbuild card viewer",
            "builder_link": "https://mootoneu.github.io/xwing-quickbuild-cards"
        }
    }
  },
  "exportCardXWS": function(card) {
    var xws = {};
    xws.version = "2.0.0";
    xws.name = "Quickbuild "+card.pilot.xws+" #"+card.id;
    xws.faction = card.pilot.faction_xws;
    xws.pilots = [];
    var pilot = {};
    pilot.id = card.pilot.xws;
    pilot.ship = card.pilot.ship.xws;
    var upgrades = {};
    for (var up of card.upgrades) {
      if (!upgrades.hasOwnProperty(up.type)) {
        upgrades[up.type] = [];
      }
      upgrades[up.type].push(up.xws);
    }
    pilot.upgrades = upgrades;
    pilot.vendor = {};
    pilot.vendor["xwing-quickbuild-cards"] = {};
    pilot.vendor["xwing-quickbuild-cards"].card_id = card.id;
    xws.pilots.push(pilot);
    xws.vendor = {
        "xwing-quickbuild-cards": {
            "builder": "Elaum's Quickbuild card viewer",
            "builder_link": "https://mootoneu.github.io/xwing-quickbuild-cards"
        }
    };
    return xws;
  },

  //card viewer
  "viewCard": function(card_id) {
    card = this.getCardById(card_id);
    $([document.documentElement, document.body]).animate({
        scrollTop: card.div.offset().top
    }, 200);
    $(".search-selected").removeClass("search-selected");
    card.div.addClass("search-selected");
    menu.exportXWSInput.val(JSON.stringify(this.exportCardXWS(card)));
  },

  //search data
  "getCardById": function(card_id) {
    for (var i = 0; i < this.cards.length; ++i) {
      var card = this.cards[i];
      if (card.id === card_id ) {
        return card;
      }
    }
    console.warn("Unknown card ", card);
    return null;
  },
  "getPilot": function(pilot_xws, ship_xws) {
    for (var s = 0; s < this.xwingdata.pilots.length; ++s) {
      var pilot = this.xwingdata.pilots[s];
      if (pilot.xws === pilot_xws && pilot.ship.xws === ship_xws) {
        return pilot;
      }
    }
    console.warn("Unknown pilot ", pilot_xws, ship_xws);
    return null;
  },
  "getShip": function(ship_xws) {
    for (var s = 0; s < this.xwingdata.pilots.length; ++s) {
      var pilot = this.xwingdata.pilots[s];
      if (pilot.ship.xws === ship_xws ) {
        return pilot.ship;
      }
    }
    console.warn("Unknown pilot ", pilot_xws, ship_xws);
    return null;
  },
  "getUpgrade":function(name) {
    for (var t = 0; t < this.xwingdata.upgrades.length; ++t) {
      var upgrade = this.xwingdata.upgrades[t];
      if (upgrade.xws === name) {
        return upgrade;
      }
    }
    console.warn("Unknown upgrade ", name);
    return null;
  },
  "getUpgradeCostForShip":function (cost, ship) {
    if (cost.hasOwnProperty("value")) {
      return cost.value;
    }
    if (cost.hasOwnProperty("variable")) {
      if (cost.variable === "size") {
        return cost.values[ship.size];
      } else {
        return cost.values[this.getStatByName(ship, cost.variable)];
      }
    }
    console.warn("Unknown ship cost ", ship);
    return null;
  },
  "getStatByName":function (ship, statname) {
    for (var i = 0; i < ship.stats.length; ++i) {
      var stat = ship.stats[i];
      if (stat.type === statname) {
        return stat.value;
      }
    }
    console.warn("Unknown ship stat ", statname, ship);
    return null;
  }
};
qb.init();
console.log(qb);
