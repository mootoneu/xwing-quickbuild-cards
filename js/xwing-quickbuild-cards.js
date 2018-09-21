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
      "pilots":[]
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
      for (var shipPath of faction.ships) {
        var data = this.loadJSON(vendorRoot+shipPath);
        for (var pilot of data.pilots) {
          pilot.faction_xws = faction.faction;
          pilot.ship = data;
          pilot.ship.xws = this.xws(this.getFileName(shipPath));
          this.xwingdata.pilots.push(pilot);
        }
      }
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
  		'success': function (data) {
  			json = data;
  		}
  	});
    return json;
  },

  //Load Quickbuild cards data
  "loadQuickbuildData":function(path) {
    this.quickbuilds = this.loadJSON(path);
  },

  //Build cards
  "nextDual":"A",
  "dualCards":[],
  "buildCards":function(container_id) {
    var ship_counter = 0;
    const page_size = 18;
    var current_page;

    for (var ship_model of this.quickbuilds) {
      for (var pilot_qb of ship_model.pilots) {
        if (ship_counter%page_size == 0) {
          current_page = $("<section>", {"class":"sheet", "id":"page-"+ship_counter/page_size});
          current_page.appendTo(container_id);
        }
        pilot_qb.faction = ship_model.faction;
        pilot_qb.ship = ship_model.ship;
        this.buildCard(current_page, pilot_qb, null);
        ship_counter++;
      }
    }
    for (var dualCard of this.dualCards) {
      if (ship_counter%page_size == 0) {
        current_page = $("<section>", {"class":"sheet", "id":"page-"+ship_counter/page_size});
        current_page.appendTo(container_id);
      }
      this.buildCard(current_page, dualCard[0], dualCard[1]);
    }
  },
  "buildCard":function(current_page, qb, dual) {
    var card = $("<div>", {"class":"card"});
    var cost = 0;

    var pilot = this.getPilot(qb.pilot, qb.ship);
    if (pilot == null) {
      card.appendTo(current_page);
      return;
    }

    //Ship icon
    $("<i>", {"class":"ship xwing-miniatures-ship xwing-miniatures-ship-"+pilot.ship.xws}).appendTo(card);

    //Pilot name + limited
    var limited = pilot.limited == 1 ?" limited":"";
    var variant = (qb.hasOwnProperty("variant")?" variant-"+qb.variant:"");
    var title_text = (qb.hasOwnProperty("title")?qb.title:"") + pilot.name;
    var title = $("<div>", {"class":"name faction-"+pilot.faction_xws+limited+variant, "text":title_text}).appendTo(card);

    //update cost
    cost += pilot.cost;

    //Get all upgrades
    var upgrades = [];
    for (var qb_upg of qb.upgrades) {
      var upgrade = this.getUpgrade(qb_upg);
      if (upgrade != null)
      cost += this.getUpgradeCostForShip(upgrade.cost, pilot.ship);
      upgrades.push(upgrade);
    }

    //Threat + Cost
    $("<span>", {"class":"threat threat-"+qb.threat, "text":qb.threat}).appendTo(card);
    $("<span>", {"class":"cost", "text":cost}).appendTo(card);

    //List of upgrades
    var upgrade_overflow = upgrades.length > 7?" upgrades-8":"";
    var ul = $("<ul>", {"class":"upgrades"+upgrade_overflow});
    for (var upgrade of upgrades) {
      if (upgrade == null) {
        $("<li>", {"class":"upgrade threat-4", "text":"ERROR"}).appendTo(ul);
      } else {
        $("<li>", {"class":"upgrade upgrade-"+upgrade.type, "text":upgrade.name}).appendTo(ul);
      }
    }
    ul.appendTo(card);

    if (qb.hasOwnProperty("docked")) {
      dual = this.getNextDual();
      qb.docked.faction = pilot.ship.faction;
      qb.docked.ship = qb.docked.ship;
      this.dualCards.push([qb.docked, dual]);
    }
    if (dual != null) {
      $("<span>", {"class":"dual", "text":dual}).appendTo(card);
    }

    card.appendTo(current_page);
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
  //search data
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
