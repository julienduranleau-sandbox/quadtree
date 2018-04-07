## [Quadtree](https://en.wikipedia.org/wiki/Quadtree) Utility Library

Live demo: https://julienduranleau-sandbox.github.io/quadtree/

#### Creation
```js
const MAX_ENTITY_PER_QUAD = 3
const qtreeArea = [0,0,500,500] // x,y,width,height
let qtree = new QuadTree(MAX_ENTITY_PER_QUAD, qtreeArea)
```

#### Adding entities
```js
// sprite: Any object. Will be used as referer for AABB
qtree.add(sprite, [10,10,50,50]) //[x,y,width,height]

// OR

// when sprite extends AABB
qtree.addAABB(sprite)
```

#### Querying an area
```js
let queryArea = [10,10,50,50] // x,y,width,height
let list = qtree.query(area)

// OR

let queryArea = new AABB(10,10,50,50) // x,y,width,height
let list = qtree.query(area)
```
If you used qtree.add, you can get the object reference using
```js
list[i].referer
```

#### Refreshing the quadtree when animating entities
```js
qtree.clear()

for (let i = 0, len = entities.length; i < len; i++) {
    let el = this.entities[i]
    qtree.add(el, [el.x, el.y, el.w, el.h])
}
```
