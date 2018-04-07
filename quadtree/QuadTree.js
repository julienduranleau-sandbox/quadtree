class QuadTree extends AABB {
  /**
   * @param {int} capacity      Number of entities in a quad before it subdivides
   * @param {array|AABB} bounds [x,y,width,height] or an AABB instance
   */
  constructor(capacity, bounds) {
    if (bounds instanceof AABB) {
      super(bounds.x, bounds.y, bounds.w, bounds.h)
    } else if (bounds) {
      super(bounds[0], bounds[1], bounds[2], bounds[3])
    } else {
      super(0, 0, window.innerWidth, window.innerHeight)
    }

    this.capacity = capacity
    this.entities = []
    this.subsections = null
  }

  /**
   * Adds an object with it's boundary box to the quad tree
   * @param {Object} el           Object to bind to the AABB referer
   * @param {Array} entityBounds  [x,y,width,height]
   */
  add(el, entityBounds) {
    let entity = AABB.fromArray(entityBounds)
    entity.referer = el
    this.addAABB(entity)
  }

  /**
   * Adds an AABB object to the quad tree
   * @param {AABB} el
   */
  addAABB(el) {
    if (this.entities.length < this.capacity) {
      this.entities.push(el)
    } else {
      if (this.subsections) {
        if ((el.center.y - this.y) / this.h < 0.5) {
          if ((el.center.x - this.x) / this.w < 0.5) {
            this.subsections[0].addAABB(el) // top-left
          } else {
            this.subsections[1].addAABB(el) // top-right
          }
        } else {
          if ((el.center.x - this.x) / this.w < 0.5) {
            this.subsections[3].addAABB(el) // bottom-left
          } else {
            this.subsections[2].addAABB(el) // bottom-right
          }
        }
      } else {
        this._subdivide()
        this.addAABB(el)
      }
    }
  }

  /**
   * Empty all entities and subdivisions
   */
  clear() {
    this.entities = []
    this.subsections = null
  }
  
  /**
   * Query the entities contained in bounds
   * @param  {Array|AABB} bounds  [x,y,width,height] or AABB instance
   * @return {Array}              List of AABB objects
   */
  query(bounds) {
    if ( !(bounds instanceof AABB)) {
      bounds = AABB.fromArray(bounds)
    }

    return this._queryWithAccumulator(bounds, [])
  }

  /**
   * Private. Recursively query the subdivisions to get entities
   * @param  {AABB} bounds
   * @param  {Array} resultAccumulator
   * @return {Array}
   */
  _queryWithAccumulator(bounds, resultAccumulator) {
    if (this.intersectsAABB(bounds)) {
      for (const entity of this.entities) {
        if (bounds.intersectsAABB(entity)) {
          resultAccumulator.push(entity)
        }
      }

      if (this.subsections) {
        this.subsections[0]._queryWithAccumulator(bounds, resultAccumulator)
        this.subsections[1]._queryWithAccumulator(bounds, resultAccumulator)
        this.subsections[2]._queryWithAccumulator(bounds, resultAccumulator)
        this.subsections[3]._queryWithAccumulator(bounds, resultAccumulator)
      }
    }

    return resultAccumulator
  }

  /**
   * Private. Subdivide current quad into four sub-parts
   */
  _subdivide() {
    let topLeftAABB = new AABB(
      this.x,
      this.y,
      this.w * 0.5,
      this.h * 0.5
    )
    let topRightAABB = new AABB(
      this.x + this.w * 0.5,
      this.y,
      this.w * 0.5,
      this.h * 0.5
    )
    let bottomRightAABB = new AABB(
      this.x + this.w * 0.5,
      this.y + this.h * 0.5,
      this.w * 0.5,
      this.h * 0.5
    )
    let bottomLeftAABB = new AABB(
      this.x,
      this.y + this.h * 0.5,
      this.w * 0.5,
      this.h * 0.5
    )

    this.subsections = [
      new QuadTree(this.capacity, topLeftAABB),
      new QuadTree(this.capacity, topRightAABB),
      new QuadTree(this.capacity, bottomRightAABB),
      new QuadTree(this.capacity, bottomLeftAABB)
    ]
  }

  /**
   * P5js draw instruction to visually represent the quad
   */
  draw() {
    rect(this.x, this.y, this.w, this.h)

    if (this.subsections) {
      this.subsections[0].draw()
      this.subsections[1].draw()
      this.subsections[2].draw()
      this.subsections[3].draw()
    }
  }
}
