;(() => {
  const MAX_ENTITY_PER_QUAD = 1

  class Game {
    constructor() {
      createCanvas(window.innerWidth, window.innerHeight)

      this.stats = new Stats()

      this.items = []
      this.qtree = new QuadTree(MAX_ENTITY_PER_QUAD, new AABB(0,0,width,height))

      window.qtree = this.qtree

      for (let i = 0; i < 400; i++) {
        let item = new AABB(random(width), random(height))
        this.items.push(item)
        this.qtree.add(item)
      }

      document.body.appendChild(this.stats.dom)
    }

    mousePressed(e) {
      let item = new AABB(mouseX, mouseY)
      this.items.push(item)
      this.qtree.add(item)
    }


    draw() {
      background(15)

      let area = new AABB(mouseX - 50, mouseY - 50, 100, 100)

      this.qtree.draw()

      stroke(0,255,0)
      noFill()
      rect(area.x, area.y, area.w, area.h)

      noStroke()
      fill(255)
      this.items.forEach(item => {
        ellipse(item.x, item.y, 5)
      })

      noStroke()
      fill(0,255,0)
      let selectedItems = this.qtree.query(area)
      selectedItems.forEach(item => {
        ellipse(item.x, item.y, 5)
      })

      this.stats.update()
    }
  }

  window.Game = Game
})()
