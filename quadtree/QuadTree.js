;(() => {

  class QuadTree extends AABB {

    constructor(capacity, bounds) {
      if (bounds) {
        super(bounds.x, bounds.y, bounds.w, bounds.h)
      } else {
        super(0, 0, window.innerWidth, window.innerHeight)
      }

      this.capacity = capacity
      this.items = []
      this.subsections = null
    }

    add(item) {
      if (this.items.length < this.capacity) {
        this.items.push(item)
      } else {
        if (this.subsections) {
          if ((item.y - this.y) / this.h < 0.5) {
            if ((item.x - this.x) / this.w < 0.5) {
              this.subsections[0].add(item) // top-left
            } else {
              this.subsections[1].add(item) // top-right
            }
          } else {
            if ((item.x - this.x) / this.w < 0.5) {
              this.subsections[3].add(item) // bottom-left
            } else {
              this.subsections[2].add(item) // bottom-right
            }
          }
        } else {
          this.subdivide()
          this.add(item)
        }
      }
    }

    query(bounds) {
      return this.queryWithAccumulator(bounds, [])
    }

    queryWithAccumulator(bounds, resultAccumulator) {
      if (this.intersectsAABB(bounds)) {
        for (const item of this.items) {
          if (bounds.containsPoint(item)) {
            resultAccumulator.push(item)
          }
        }

        if (this.subsections) {
          this.subsections[0].queryWithAccumulator(bounds, resultAccumulator)
          this.subsections[1].queryWithAccumulator(bounds, resultAccumulator)
          this.subsections[2].queryWithAccumulator(bounds, resultAccumulator)
          this.subsections[3].queryWithAccumulator(bounds, resultAccumulator)
        }
      }

      return resultAccumulator
    }

    subdivide() {
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

    draw() {
      noFill()
      stroke(255)
      rect(this.x, this.y, this.w, this.h)

      if (this.subsections) {
        this.subsections[0].draw()
        this.subsections[1].draw()
        this.subsections[2].draw()
        this.subsections[3].draw()
      }
    }
  }

  window.QuadTree = QuadTree

})()
