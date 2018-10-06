const R = require('ramda')
const m = require('mithril')

const Geom = require('./geom.js')
const prng = require('./prng.js')

const prngColor = function (x, opacity) {
    // pseudo random colors
    let H = (n) => prng(n)
    let l = (n,i) => H((n + 1337346) * (i*i)) * 9 % 256
    
    let r = o => l(o,3)
    let g = o => l(o,5)
    let b = o => l(o,7)
    let pseudoRandomColour = seed => `rgb(${r(seed)},${g(seed)},${b(seed)},${opacity || 1.0})`
    return pseudoRandomColour(x)    
}

const {
    margin, s,
    w, h, cw, ch,
    ph,
    qh, qw,
    dw, dh, sp, stacksLeft,
    xi, hi,
    stackY, stackX
} = require('./geom.js')

var MachineView = {
    rect: (x,y,w,h,c) => {
        let ctx = MachineView.ctx
        ctx.beginPath()
        ctx.rect(x,y,w,h)
        ctx.fillStyle = c ? c : 'gray'
        ctx.fill()
    },
    oncreate: (vnode) => {
        MachineView.canvas = vnode.dom
        MachineView.ctx = MachineView.canvas.getContext('2d')
        MachineView.onupdate(vnode)
    },
    onupdate: (vnode) => {
        let robot = vnode.attrs.robot || {}

        // resize canvas
        MachineView.canvas.width  = cw
        MachineView.canvas.height = ch
        
        // clear background
        MachineView.rect(0,0,cw,ch, 'rgb(200,200,200)')
        MachineView.rect(margin,margin,cw-margin*2,ch-margin*2, 'rgb(100,100,0,0.2)')
        
        // draw robot position
        let [x,y] = [robot.x, robot.y]

        // plateu
        MachineView.rect(margin, margin + y, cw - margin*2, ph*2, 'orange')

        // crane
        MachineView.rect(margin + x, margin + y - qh, qw*2, 1 + qh*2, 'rgba(20,100,100,0.3)')
        
        // sucker
        if (robot.suck)
            MachineView.rect(margin + x + 4, margin + y - 7, qw*2 - 8, 6, 'rgba(250,0,0,1)')

        // "rope"
        MachineView.rect(margin + x + qw, 0, 1, ch, 'black')
        MachineView.rect(0, margin + y + ph, cw, 1, 'black')
        
        // stacks of discs
        var i = 0
        for(let si of robot.stacks) {
            let left = stackX(i)
            let top = stackY(si.h)
            MachineView.rect(left, top, dw * 2, hi(si.h) - 1, 'rgba(200,200,200,0.4)')

            MachineView.rect(left + dw - 3, stackY(robot.stackMax), 6, hi(robot.stackMax) - 1, 'rgba(40,40,40,0.4)')

            // draw cd's
            for(let j of R.range(0, si.h)) {
                MachineView.rect(left, top + hi(j), dw*2,dh*2, prngColor(j + i * 999, 0.6))
            }
            i++
        }
    },
    view: () => m('canvas')
}

module.exports = MachineView