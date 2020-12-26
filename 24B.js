class Tile {
    constructor(q, r, offset) {
        this.q = q;
        this.r = r;
        this.flipped = false;
        this.id = r*mapRadius*2 + q + offset;
        this.adjacent = this.getAdjacent();
    }

    getAdjacent() {
        var adjacent = [
            this.id-1,
            this.id-2*mapRadius-1+(this.r % 2 ? 1 : 0),
            this.id-2*mapRadius+(this.r % 2 ? 1 : 0),
            this.id+1,
            this.id+2*mapRadius+(this.r % 2 ? 1 : 0),
            this.id+2*mapRadius-1+(this.r % 2 ? 1 : 0)
        ];
        return adjacent.filter(id => id >= 0 && id < 4*mapRadius*mapRadius);
    }
}

var mapRadius = 65;
var tiles = [];
var stop = mapRadius*mapRadius*2 + mapRadius;
var minId = mapRadius*mapRadius*4;
var maxId = 0;

for (var r = 0; r < mapRadius * 2; r++) {
    var rOffset = Math.floor(r/2);
    for (var q = -rOffset; q < (mapRadius*2) - rOffset; q++) {
        tiles.push(new Tile(q, r, rOffset));
    }
}

function move(step) {
    stop += step + (((step < -1 || step > 1) && tiles[stop].r % 2) ? 1 : 0);
}

function flip(i) {
    tiles[i].flipped = !tiles[i].flipped;
}

function read() {
    tiles.forEach(t => t.flipped = false);
    stop = mapRadius*mapRadius*2 + mapRadius;
    steps.value.split(/\r?\n/).forEach(s => {
        stop = mapRadius*mapRadius*2 + mapRadius;
        var position = 0;
        while (position < s.length) {
            switch (s[position]) {
                case 'e':
                    move(1);
                    break;
                case 'w':
                    move(-1);
                    break;
                case 'n':
                    move(-2*mapRadius - ((s[position+1] == 'w') ? 1 : 0));
                    position++;
                    break;
                case 's':
                    move(2*mapRadius - ((s[position+1] == 'w') ? 1 : 0));
                    position++;
                    break;
            }
            position++;
        }
        flip(stop);
        if (stop < minId) {
            minId = stop;
        } else if (stop > maxId) {
            maxId = stop;
        }
    });
    for (var i = 0; i < 100; i++) {
        retile();
    }
    res.innerHTML = tiles.filter(t => t.flipped).length;
}

function retile() {
    minId = Math.max(0, minId-2*mapRadius);
    maxId = Math.min(mapRadius*mapRadius*4, maxId+2*mapRadius);
    var change = [];
    tiles.filter(t => t.id > minId && t.id < maxId).forEach(t => {
        var adjacentBlack = t.adjacent.filter(t => tiles[t].flipped).length;
        if ((t.flipped && adjacentBlack != 1 && adjacentBlack != 2) || (!t.flipped && adjacentBlack == 2)) {
            change.push(t.id);
            if (t.id < minId) {
                minId = t.id;
            } else if (t.id > maxId) {
                maxId = t.id;
            }
        }
    });
    change.forEach(t => flip(t));
}
