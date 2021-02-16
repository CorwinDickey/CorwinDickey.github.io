/*
A game inspired by the classic "Battleship" game. Two players, first player to 300pts wins.

[] Players start off by "buying" ships with a certain number of points (300pts)
    [] orbital station - 150pts
        [] allows player to collect resources on the map
            [] placed on star - adds 10pts every 5 turns
            [] placed on an asteroid belt - heals 1 damage to 1 ship every 5 turns
            [] placed on a planet generates - 1 scout ship every 5 turns
            [] placed on a gas giant - generates 5 missles and 10 shells every 5 turns
        [] has missiles
        [] has mass drivers
    [] dreadnaught - 150pts
        [] ion beam - every 3 turns allows player to hit the first enemy in a given column and stun the enemy ship for a random amount of time (1-3 turns)
        [] has missiles
        [] has mass drivers
    [] battleship - 75pts
        [] has missiles
        [] has mass drivers
    [] gun boat - 50pts
        [] has mass drivers
    [] missile cruiser - 50pts
        [] has missiles
    [] interceptor - 50pts
        [] intercepts missiles within a 3 unit radius of the ship
    [] scout ship - 10pts
        [] scans a small area (2 unit square) of the enemy sector but cannot fight

[] list of names for ships
    [] dreadnaughts
    [] orbital stations
    [] battleships
    [] missile cruisers
    [] gunboats
    [] interceptors

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
    [] number of enemy missiles/mass drivers shot
    [] enemy hit/miss ratio

[] fog of war
    [] can be scanned by a scout ship
    [] scanning lasts for 1 turn, then fog of war is back but stationary objects remain revealed (planets, stars, stations, asteroid belts)



[] auto move for ships
    [] patrol routes for large ships
    [] random movement for scout ships

[] things a ship should be able to do
    [] ships can move or attack/special each turn
        [] dreadnaught - can move 3 units
        [] battleship - can move 7 units
        [] gun boat - can move 5 units
        [] missile cruiser - can move 5 units
        [] interceptor - can move 5 units
        [] scout ship - can move 2 units
    [] attack
        [] missiles - 1 dmg in a 3 unit radius
        [] shell - 2 dmg single point
    [] miss
    [] take damage
        [x] lose accuracy when damaged

*/

orbitalStationNames = [
    'BASTION', 'BABYLON', 'ORBITAL 3', 'ORBITAL 4', 'ORBITAL 5'
    ,'ORBITAL 6', 'ORBITAL 7', 'ORBITAL 8', 'ORBITAL 9', 'ORBITAL 10'
]

dreadnaughtNames = [
    'DREADNAUGHT 1', 'DREADNAUGHT 2', 'DREADNAUGHT 3', 'DREADNAUGHT 4', 'DREADNAUGHT 5'
    ,'DREADNAUGHT 6', 'DREADNAUGHT 7', 'DREADNAUGHT 8', 'DREADNAUGHT 9', 'DREADNAUGHT 10'
]

battleshipNames = [
    'BATTLESHIP 1', 'BATTLESHIP 2', 'BATTLESHIP 3', 'BATTLESHIP 4', 'BATTLESHIP 5'
    ,'BATTLESHIP 6', 'BATTLESHIP 7', 'BATTLESHIP 8', 'BATTLESHIP 9', 'BATTLESHIP 10'
]

missileCruiserNames = [
    'CRUISER 1', 'CRUISER 2', 'CRUISER 3', 'CRUISER 4', 'CRUISER 5'
    ,'CRUISER 6', 'CRUISER 7', 'CRUISER 8', 'CRUISER 9', 'CRUISER 10'
]

gunboatNames = [
    'GUNBOAT 1', 'GUNBOAT 2', 'GUNBOAT 3', 'GUNBOAT 4', 'GUNBOAT 5'
    ,'GUNBOAT 6', 'GUNBOAT 7', 'GUNBOAT 8', 'GUNBOAT 9', 'GUNBOAT 10'
]

interceptorNames = [
    'INTERCEPTOR 1', 'INTERCEPTOR 2', 'INTERCEPTOR 3', 'INTERCEPTOR 4', 'INTERCEPTOR 5'
    ,'INTERCEPTOR 6', 'INTERCEPTOR 7', 'INTERCEPTOR 8', 'INTERCEPTOR 9', 'INTERCEPTOR 10'
]

app = {
    checkIntercept: function() {
        // checks if one area intercepts another area
    }
}

class Ship {
    constructor(
        shipLength // size of ship in y direction
        ,shipWidth // size of ship in x direction
        ,hullPoints // health of ship, determines when ship is destroyed and can affect targeting accuracy
        ,movement // how far the ship can move in both x and y directions in 1 turn
        ,targetingSensors // how accurate a ship is when firing at an enemy
        ,currentX  // current x position of the lower left most unit of the ship's profile
        ,currentY  // current y position of the lower left most unit of the ship's profile
        ,missileStorage // starting and maximum amount of missiles the ship can carry
        ,shellStorage // starting and maximum amount of shells the ship can carry
        ){
            this.shipLength = shipLength
            this.shipWidth = shipWidth
            this.maxHullPoints = hullPoints
            this.currentHullPoints = hullPoints
            this.movement = movement
            this.targetingSensors = targetingSensors
            this.currentX = currentX
            this.currentY = currentY
            this.ammunitionStores = {
                missile: missileStorage
                ,shell: shellStorage
            }

            this.attacks = {
                missile: 1
                ,shell: 2
            }
    }

    attack(target, weapon) {
        if (this.checkHit()) {
            target.takeDamage(this.attacks(weapon))
        }
    }

    fireMissile(target) {
        this.missileStorage --
        this.attack(target, 'missile')
    }

    fireShell(target) {
        this.shellStorage--
        this.attack(target, 'shell')
    }

    takeDamage(damage) {
        this.currentHullPoints -= damage
    }

    checkHit() {
        // the level of a ship's targeting sensors determine outcome of attack
        // sensors of level 10 always result in a hit

        let currentTargeting = this.targetingSensors
        let hullIntegrity = Math.ceil((this.currentHullPoints / this.maxHullPoints) * 10) / 10

        switch(hullIntegrity) {
            case .8:
            case .7:
                currentTargeting -= 1
                // console.log(currentTargeting, 'checkHit: 1')
                break
            case .6:
            case .5:
                currentTargeting -= 2
                // console.log(currentTargeting, 'checkHit: 2')
                break
            case .4:
            case .3:
                currentTargeting -= 3
                // console.log(currentTargeting, 'checkHit: 3')
                break
            case .2:
                currentTargeting -= 4
                // console.log(currentTargeting, 'checkHit: 4')
                break
            case .1:
                currentTargeting -= 5
                // console.log(currentTargeting, 'checkHit: 5')
                break
        }

        if (Math.random() < currentTargeting * .1) {
            return true
        } else {
            return false
        }
    }

}
