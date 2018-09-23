# X-Wing 2.0 Quickbuild cards viewer

A simple tool to print quickbuild cards for X-Wing the miniature game 2.0

## How to print
1. Download one of the ready-to-print pdfs in the [dist](https://github.com/mootoneu/xwing-quickbuild-cards/tree/master/dist) folder:
- [xwing-quickbuild-cards_all-factions.pdf](https://github.com/mootoneu/xwing-quickbuild-cards/tree/master/dist/xwing-quickbuild-cards_all-factions.pdf)
- [xwing-quickbuild-cards_galactic-empire.pdf](https://github.com/mootoneu/xwing-quickbuild-cards/tree/master/dist/xwing-quickbuild-cards_galactic-empire.pdf)
- [xwing-quickbuild-cards_rebel-alliance.pdf](https://github.com/mootoneu/xwing-quickbuild-cards/tree/master/dist/xwing-quickbuild-cards_rebel-alliance.pdf)
- [xwing-quickbuild-cards_scum.pdf](https://github.com/mootoneu/xwing-quickbuild-cards/tree/master/dist/xwing-quickbuild-cards_scum.pdf)

or

1. Go to [xwing-quickbuild-cards.html](https://mootoneu.github.io/xwing-quickbuild-cards/xwing-quickbuild-cards.html)
2. Select the ships you want on the left side bar (clicking on a faction title will hide/show its ships)
3. Reload the page
4. Print it

## What's on the card
- On the top row from left to right:
  - Ship icon
  - Pilot name with
    - A dot (•) to indicate that the pilot is limited
    - A force power symbol to indicate that the pilot has force power tokens
    - An illicit symbol for saw gerrera's partisant ships
  - Point cost
  - Threat level
- In the middle:
  - List of all upgrade names with
    - One/Two symbols of the upgrade type
    - A dot (•) to indicate that the upgrade is limited
    - A force power symbol to indicate that the upgrade has force power tokens
- To the right:
  - A vertical "DUAL CARD #" to indicate the card is part of a pair named #. You must use both cards in your build. Note the costs are independent
- At the bottom:
  - Faction icon
  - Card id (generated automatically, subject to change with future release)

## Ship cost & other informations
The data come from [Guido Kessels' project xwing-data2](https://github.com/guidokessels/xwing-data2/)

## Quickbuild Data
The data come from the following quickbuild references pdf available on https://www.fantasyflightgames.com/en/products/x-wing-second-edition/ :
- Rebel Alliance Quick Build Reference (v3 dl on 20 Sep 2018)
- Galactic Empire Quick Build Reference (v2 dl on 19 Sep 2018)
- Scum and Villainy Quick Build Reference (v2 dl on 19 Sep 2018)

##### Change from the FFG references
 Some pilot names are corrected (eg. Lieutenant Kasarbi -> Lieutenant Karsabi)

##### Point cost vs Threat level
In FFG quickbuild, the threat level is not a real indicator of a ship cost.
As stated in the rulebook p.15:
>    QUICK BUILD
>    This mode of play offers players a way to create a squad quickly using predefined selections. Each ship comes with Quick Build cards that list different options for that ship. Each option consists of a ship card, a number of upgrade cards, and a threat level (a number of bars 1–5). This threat level represents the approximate strength of that particular combination of pilot and upgrade cards.

Nevertheless, whether you prefer the point cost or threat level, both are printed on the cards top right.
For the curious, I've noted that usualy the correspondence is the following:
| Threat | Cost range |
| --- | --- |
| 1 | 0-30 |
| 2 | 45-55 |
| 3 | 70-80 |
| 4 | 100-135 |
| 5 | 105-125 |
| 6 | 110+ |

But there are some exceptions such as:
 - Rebel's X-Wing pilot Leevan Tenza is threat 2 for 71 points
 - Rebel's U-Wing pilot Cassian Andor is threat 3 for 60 points
 - Scum's Quadjumper pilot 2x Jakku Gunrunner are threat 2 for 80 points
 - Scum's Quadjumper pilot Sarco Plank is threat 3 for 51 points

## Authors

* **Mooton.eu** - *Initial work* - [mootoneu](https://github.com/mootoneu)


## License

This project is licensed under the MIT License
