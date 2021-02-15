/*
A game inspired by the classic "Battleship" game. Two players, first player to 300pts wins.

[] Players start off by "buying" ships with a certain number of points (300pts)
    [] orbital station - 100pts
        [] allows player to collect resources on the map
            [] placed on star adds 10pts every 5 turns
            [] placed on an asteroid belt heals 1 damage to 1 ship every 5 turns
            [] placed on a planet generates 1 scout ship every 5 turns
        [] has missiles
        [] has mass drivers
    [] dreadnaught - 100pts
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

[X] list of names for ships
    [x] dreadnaughts
    [x] orbital stations
    [X] battleships
    [x] missile cruisers
    [x] gunboats
    [X] interceptors

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

[] ships can move or attack/special each turn
    [] dreadnaught - can move 3 units
    [] battleship - can move 7 units
    [] gun boat - can move 5 units
    [] missile cruiser - can move 5 units
    [] interceptor - can move 5 units
    [] scout ship - can move 2 units

[] auto move for ships
    [] patrol routes for large ships
    [] random movement for scout ships

*/

orbitalStationNames = [
    'BEIJING', 'NEW DELHI', 'WASHINGTON', 'JAKARTA', 'ISLAMABAD'
    ,'BRASILIA', 'ABUJA', 'DHAKA', 'MOSCOW', 'MEXICO CITY'
    ,'TOKYO', 'ADDIS ABABA', 'MANILA', 'CAIRO', 'HANOI'
    ,'KINSHASA', 'ANKARA', 'TEHRAN', 'BERLIN', 'BANGKOK'
    ,'LONDON', 'PARIS', 'ROME', 'DODOMA', 'PRETORIA'
]

dreadnaughtNames = [
    'ARIZONA', 'AJAX', 'BISMARK', 'DIXMUDE', 'DREADNOUGHT'
    ,'ENTERPRISE', 'FURIOUS', 'BABYLON', 'HOOD', 'KAGA'
    ,'KAWACHI', 'MARAT', 'MISSOURI', 'ODIN', 'STEAMBOAT WILLY'
    ,'TEXAS', 'VIKRANT', 'VULCAN', 'WARSPITE', 'YAMATO'
    ,'YORKTOWN', 'AGAMEMNON', 'VALIANT', 'REVOLUTSIYA', 'SAO PAULO'
]

battleshipNames = [
    'KARL GALSTER', 'AKIZUKI', 'JOHNSTON', 'ALVISE DA MOSTO', 'ALPINO'
    ,'AVIERE', 'CARRISTA', 'KIDD', 'SOUTHERLAND', 'STORD'
    ,'GABBARD', 'LAGOS', 'TRAGALGAR', 'BORDELON', 'CHEVALIER'
    ,'AULT', 'LENINGRAD', 'BLACK', 'CALLAGHAN', 'GROM'
    ,'MINEGUMO', 'NOOTKA', 'REGINA MARIA', 'NESTOR', 'SHARK'
]

missileCruiserNames = [
    'BRAND', 'DRAZKI', 'FRESIA', 'GUACOLDA', 'GUALE'
    ,'HAVKATTEN', 'HAVORNEN', 'HOGEN', 'HU NGO', 'HU YING'
    ,'HVALEN', 'IKU-TURSO', 'KALEV', 'KJELL', 'MAKRELEN'
    ,'MARSUINUI', 'NAJADEN', 'NYMPHEN', 'QUIDORA', 'RECHINUL'
    ,'RUCAMILLA', 'RYS', 'SALTA', 'SAUKKO', 'WILK'
]

gunboatNames = [
    'AHTI', 'BAIRE', 'BOGOTA', 'CARTAGENA', 'CHEN SHEN'
    ,'CHIEN CHUNG', 'CORDOBA', 'DRAGEN', 'GENERAL HALLER', 'HAFIR'
    ,'HEJMDAL', 'HSIEN NING', 'ILMATAR', 'JUNIN', 'KARJALA'
    ,'KING', 'KOMENDANT PILSUDSKI', 'LAINE', 'MAAGEN', 'MARDUS'
    ,'PANAY', 'SANTA MARTA', 'TAARA', 'TIRANE', 'TURUNMAA'
]

interceptorNames = [
    'AJONPAA', 'AURA', 'BATHURST', 'BOUCHARD', 'CZAJKA'
    ,'DRSKI', 'DURRES', 'FREJA', 'HAI YEN', 'IGUAPE'
    ,'ITAJAHY', 'JASKOLKA', 'KHRABRY', 'MAAGEN', 'MEWA'
    ,'NORDKAPP', 'PICHINCHA', 'PORKALA', 'RYBITWA', 'SMELY'
    ,'TERNEN', 'TURSAS', 'VILPPULA', 'WAKAKURA', 'ZURAW'
]
