// Axis Aligned Boundary Box
class AABB {

  constructor(x,y,w,h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  get top() { return this.y }
  get left() { return this.x }
  get right() { return this.x + this.w }
  get bottom() { return this.y + this.h }

  containsPoint(pt) {
    return !(
      pt.x < this.left ||
      pt.x > this.right ||
      pt.y < this.top ||
      pt.y > this.bottom
    )
  }

  intersectsAABB(aabb) {
    return !(
      aabb.left > this.right ||
      aabb.right < this.left ||
      aabb.top > this.bottom ||
      aabb.bottom < this.top
    )
  }
}
