var menu = {
  "filters":[],
  "buildFactionsMenu":function (container_id, qb) {
    for (var faction of qb.xwingdata.factions) {
      var factiongroup = $("<div>", {"class":"faction faction-"+faction.xws});

      var faction_input = $("<input>",{"type":"checkbox", "name":"faction-"+faction.xws, "checked":true});
      faction_input.change(function() {
          var inputs = $(".ship-"+this.name+" input");
          for (var input of inputs) {
            var $input = $(input);
             $input.prop("checked", this.checked);
            menu.updateFilter( $input, this.checked);
          }
      });
      faction_input.appendTo(factiongroup);

      var faction_label = $("<label>",{"for":"faction-"+faction.xws, "text":" "+faction.name})
      faction_label.on('click', function() {
          $(".ship-"+this.htmlFor).toggle();
      });
      faction_label.appendTo(factiongroup);

      for (var ship_xws of faction.ships) {
        var ship = qb.getShip(ship_xws);

        var shipdiv = $("<div>", {"class":"ship ship-faction-"+faction.xws});

        var ship_input = $("<input>",{"type":"checkbox", "name":"ship-"+ship.xws, "class":"ship-"+ship.xws, "data-xws":ship.xws, "data-factionxws":faction.xws, "checked":true})
        ship_input.change(function() {
          menu.updateFilter($(this), this.checked);
        });
        ship_input.appendTo(shipdiv);

        $("<i>",{"class":"xwing-miniatures-ship xwing-miniatures-ship-"+ship.xws}).appendTo(shipdiv);
        $("<label>",{"for":"ship-"+ship.xws, "text":" "+ship.name+" "}).appendTo(shipdiv);
        shipdiv.appendTo(factiongroup);
      }

      factiongroup.appendTo(container_id);
    }

    var searchmenu = $("#m-search");
    var searchcard_input = $("<input>",{"type":"text", "name":"search-card",  "placeholder":"Card number"})
    searchcard_input.on("change", function() {
      qb.viewCard(parseInt(this.value));
    });
    searchcard_input.appendTo(searchmenu);

  },
  "updateFilter":function (input, checked) {
    var filter = input.data("factionxws")+":"+input.data("xws");
    if (checked) {
      this.filters = this.filters.filter(item => item !== filter);
    } else if (this.filters.indexOf(filter) == -1) {
      this.filters.push(filter);
    }
    qb.updateSelectedCards("#cards-container", this.filters);
    localStorage.filters = this.filters;
  },
  "initFilters":function (f) {
    if (f === undefined || f.length == 0) return;
    this.filters = f.split(",");
    for (var filter of this.filters) {
      var xws = filter.split(":");
      $(".faction-"+xws[0]+" .ship-"+xws[1]).prop("checked", false);
    }
  }
};

/**
<label for="faction-rebelalliance">Rebel Alliance</label>
<input type="checkbox" name="faction-rebelalliance">
*/
