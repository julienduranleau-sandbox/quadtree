// Axis Aligned Boundary Box
class AABB {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.w = width
    this.h = height
    this.referer = null
  }

  get top() { return this.y }
  get left() { return this.x }
  get right() { return this.x + this.w }
  get bottom() { return this.y + this.h }
  get center() {
    return {
      x: this.x + this.w * 0.5,
      y: this.y + this.h * 0.5
    }
  }

  /**
   * @param  {Object} pt Object with x,y
   * @return {bool}
   */
  containsPoint(pt) {
    return !(
      pt.x < this.left ||
      pt.x > this.right ||
      pt.y < this.top ||
      pt.y > this.bottom
    )
  }

  /**
   * @param  {AABB} aabb
   * @return {bool}
   */
  intersectsAABB(aabb) {
    return !(
      aabb.left > this.right ||
      aabb.right < this.left ||
      aabb.top > this.bottom ||
      aabb.bottom < this.top
    )
  }

  /**
   * @param  {Array} bounds [x,y,width,height]
   * @return {AABB}
   */
  static fromArray(bounds) {
    return new AABB(bounds[0], bounds[1], bounds[2], bounds[3])
  }
}
