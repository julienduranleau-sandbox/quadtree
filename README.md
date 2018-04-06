## [Quadtree](https://en.wikipedia.org/wiki/Quadtree) Utility Library

### TODO:
- Support entity width and height and not only xy coords
- Add entity relocation methods

Live demo: https://julienduranleau-sandbox.github.io/quadtree/

#### Creation
```js
const SUBDIVIDE_COUNT = 5
let qtreeArea = new AABB(0,0,500,500) // x,y,w,h
let qtree = new QuadTree(SUBDIVIDE_COUNT, qtreeArea)
```

#### Adding entities
```js
qtree.add(item)
```

#### Querying an area
```js
let queryArea = new AABB(10,10,50,50) // x,y,w,h
let list = qtree.query(area)
```

#### Moving an entity
```js
// TODO
```
