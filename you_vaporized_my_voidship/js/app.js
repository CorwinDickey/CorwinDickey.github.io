/*
A game inspired by the classic "Battleship" game. Two players, first player to 300pts wins.

[] Players start off by "buying" ships with a certain number of points (300pts)
    [] orbital station - 100pts
        [] allows player to collect resources on the map
            [] placed on star adds 10pts every 5 turns
            [] placed on an asteroid belt heals 1 damage to 1 ship every 5 turns
            [] placed on a planet generates 1 scout ship every 5 turns
    [] dreadnaught - 100pts
        [] ion beam - every 3 turns allows player to hit the first enemy in a given column and stun the enemy ship for a random amount of time (1-3 turns)
        [] has missles
        [] has mass drivers
    [] battleship - 75pts
        [] has both missles
        [] mass drivers
    [] gun boat - 50pts
        [] has mass drivers
    [] missle cruiser - 50pts
        [] has missles
    [] interceptor - 50pts
        [] intercepts missles within a 3 unit radius of the ship
    [] scout ship - 10pts
        [] scans a small area (2 unit square) of the enemy sector but cannot fight

[] game boards are randomly generated
    [] always has at least 1 star
    [] has 1-3 planets
        [] 80% chance of 1 planet
        [] 15% chance of 2 planets
        [] 5% chance of 3 planets
        [] provides cover from mass drivers and ion cannons
        [] planets hit 3 times by an ion cannon are 'cracked' and no longer provide cover
    [] 20% chance has asteroid belt

[] placing ships on game board
    [] computer randomly places ships
    [] player can place ships as they want, or choose a random placement
    [] orbital stations must be placed on a resource

[] player statistics
    [] player points
    [] list of player ships in play and destroyed
    [] ammunition stockpiles
    [] hit/miss ratio
    [] time to next station/dreadnaught special

[] opponent statistics
    [] number of enemy ships spotted and destroyed
    [] number of enemy missles/mass drivers shot
    [] enemy hit/miss ratio

[] fog of war
    [] can be scanned by a scout ship
    [] scanning lasts for 1 turn, then fog of war is back but stationary objects remain revealed (planets, stars, stations, asteroid belts)

[] ships can move or attack/special each turn
    [] dreadnaught - can move 3 units
    [] battleship - can move 7 units
    [] gun boat - can move 5 units
    [] missle cruiser - can move 5 units
    [] interceptor - can move 5 units
    [] scout ship - can move 2 units

[] auto move for ships
    [] patrol routes for large ships
    [] random movement for scout ships

*/