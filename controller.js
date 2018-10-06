const R = require('ramda')

const {
    margin, s,
    w, h, cw, ch,
    ph,
    qh, qw,
    dw, dh, sp, stacksLeft,
    xi, hi,
    stackY, stackX
} = require('./geom.js')

const {robot, r_set} = require('./robot.js')

function pop (r) {
    r.queue = R.tail(r.queue) || []
    if(r.queue.length === 0) {
        r.cmd = 'sleep'
    }
}

function push(r, newCmd) {
    r.queue = R.concat(r.queue, newCmd ? [newCmd] : [])
}


let safety = 10

// function stackMax (r) {
//     return R.reduce(R.min, 1000, R.map(s => stackY(s.h) - margin - safety, r.stacks))
// }

module.exports = function controller (newCmd) {
    let r = robot()

    push(r, newCmd)

    let cmd = R.head(r.queue)
    
    // sleep
    if(!cmd) return;
    
    if(cmd.home) {
        let sx = 0
        let sy = 0
        let x = r.x
        let y = r.y
        
        r.cmd = `moving x=y=0`
        
        if ((x === sx) && (y === sy)) {
            pop(r)
            r.m0 = 0
            r.stack = cmd.stack
        }
        else {
            if(x !== sx) {
                r.m0 = x < sx ? 1 : -1
            }
            if(y !== sy) {
                r.m1 = y < sy ? 1 : -1
            }
        }
    }
    

    if(cmd.stack) {
        let sx = stackX(cmd.stack - 1) - dw
        let x = r.x
        r.cmd = `moving x=${x} to ${sx}`
        
        if (x === sx) {
            pop(r)
            r.m0 = 0
            r.stack = cmd.stack
        }

        else {
            r.m0 = x < sx ? 1 : -1
        }
    }
    if(cmd.stackMax) {
        let y = r.y
        let sy = stackY(r.stackMax) - margin - safety
        r.cmd = `moving y=${y} to ${sy}`
        
        if (y === sy) {
            pop(r)
            r.m1 = 0
        }

        else {
            r.m1 = y < sy ? 1 : -1
        }
    }
    if(cmd.top) {
        let y = r.y
        let sy = 0
        r.cmd = `moving y=${y} to ${sy}`
        
        if (y === sy) {
            pop(r)
            r.m1 = 0
        }

        else {
            r.m1 = y < sy ? 1 : -1
        }
    }

    if(cmd.suck) {
        r.cmd = `sucking`
        r.suck = true
        
        let y = r.y
        let sy = stackY(r.stacks[r.stack - 1].h) - margin
        r.cmd = `moving y=${y} to ${sy}`
        
        if (y === sy) {
            r.stacks[r.stack - 1].h = Math.max(0, r.stacks[r.stack - 1].h - 1)
        }

        pop(r)
    }

    if(cmd.nosucky) {
        r.cmd = `no sucking`
        r.suck = false
        r.stacks[r.stack - 1].h = r.stacks[r.stack - 1].h + 1
        pop(r)
    }

    if(cmd.first) {
        let y = r.y
        let sy = stackY(r.stacks[r.stack - 1].h) - margin
        r.cmd = `moving y=${y} to ${sy}`
        
        if (y === sy) {
            pop(r)
            r.m1 = 0
        }

        else {
            r.m1 = y < sy ? 1 : -1
        }
    }

    robot(r)
}