;(() => {
  const MAX_ENTITY_PER_QUAD = 3

  class Game {
    constructor() {
      createCanvas(window.innerWidth, window.innerHeight)

      this.stats = new Stats()

      this.entities = []
      this.qtree = new QuadTree(MAX_ENTITY_PER_QUAD, [0,0,width,height])
      this.qtreeEnabled = true
      this.qtreeGridEnabled = true
      this.manuallyAddedEntities = 0

      this.spawnQuantity(document.getElementById('entitySlider').value)

      this.initGui()
    }

    initGui() {
      document.getElementById('disableCheckbox').onchange = (e) => {
        this.qtreeEnabled = !e.target.checked
      }

      document.getElementById('hideCheckbox').onchange = (e) => {
        this.qtreeGridEnabled = !e.target.checked
      }

      document.getElementById('entitySlider').onchange = (e) => {
        this.spawnQuantity(e.target.value)
      }

      document.body.appendChild(this.stats.dom)
    }

    spawnQuantity(n) {
      document.getElementById('entitiesLabel').innerHTML = ''+n
      this.entities = []
      this.qtree.clear()

      for (let i = 0; i < n; i++) {
        this.entities.push(this.generateNewEntity())
      }
    }

    generateNewEntity(x,y) {
      let a = random(0, 2*PI)
      return {
        x: x || random(width),
        y: y || random(height),
        w: random(5, 20),
        h: random(5, 20),
        vx: cos(a),
        vy: sin(a)
      }
    }

    mousePressed(e) {
      let el = this.generateNewEntity(mouseX, mouseY)

      this.entities.push(el)
      this.qtree.add(el, [el.x, el.y, el.w, el.h])

      this.manuallyAddedEntities++
      document.getElementById('entitiesLabel').innerHTML = this.entities.length
    }

    refreshQTree() {
      this.qtree.clear()

      for (let i = 0, cnt = this.entities.length; i < cnt; i++) {
        let el = this.entities[i]
        this.qtree.add(el, [el.x, el.y, el.w, el.h])
      }
    }

    update() {
      for (let i = 0, cnt = this.entities.length; i < cnt; i++) {
        let el = this.entities[i]

        el.x += el.vx
        el.y += el.vy

        if (el.x < 0 || el.x + el.w > width) el.vx *= -1
        if (el.y < 0 || el.y + el.h > height) el.vy *= -1
      }

      if (this.qtreeEnabled) {
        this.refreshQTree()
      }
    }

    drawWithQTree() {
      for (let i = 0, len = this.entities.length; i < len; i++) {
        let el = this.entities[i]
        let elBounds = new AABB(el.x, el.y, el.w, el.h)
        let collision = false

        let nearbyEntities = this.qtree.query(elBounds)
        for (let j = 0, jcnt = nearbyEntities.length; j < jcnt; j++) {
          let el2 = nearbyEntities[j]
          if (el !== el2.referer && elBounds.intersectsAABB(el2)) {
            collision = true
            break
          }
        }
        if (collision) {
          fill(255, 0, 0)
        } else {
          fill(255, 100)
        }
        rect(el.x, el.y, el.w, el.h)
      }
    }

    drawWithoutQTree() {
      for (let i = 0, len = this.entities.length; i < len; i++) {
        let el = this.entities[i]
        let elBounds = new AABB(el.x, el.y, el.w, el.h)
        let collision = false

        for (let j = 0, jcnt = this.entities.length; j < jcnt; j++) {
          let el2 = this.entities[j]
          let el2Bounds = new AABB(el2.x, el2.y, el2.w, el2.h)

          if (el !== el2 && elBounds.intersectsAABB(el2Bounds)) {
            collision = true
            break
          }
        }
        if (collision) {
          fill(255, 0, 0)
        } else {
          fill(255, 100)
        }
        rect(el.x, el.y, el.w, el.h)
      }
    }

    draw() {
      this.update()

      background(15)

      let area = [mouseX - 50, mouseY - 50, 100, 100]

      noStroke()
      if (this.qtreeEnabled) {
        this.drawWithQTree()
      } else {
        this.drawWithoutQTree()
      }

      noStroke()
      fill(0,255,0)
      let selectedItems = this.qtree.query(area)
      selectedItems.forEach(item => {
        rect(item.x, item.y, item.w, item.h)
      })

      strokeWeight(1)
      stroke(0,255,0)
      noFill()
      rect(area[0], area[1], area[2], area[3])

      if (this.qtreeEnabled && this.qtreeGridEnabled) {
        noFill()
        stroke(100)
        strokeWeight(1)
        this.qtree.draw()
      }

      this.stats.update()
    }
  }

  window.Game = Game
})()
