
const stream = require('mithril/stream')

const robot = stream({
    m0: 0,
    m1: 0,
    suck: false,
    sw0: false,
    sw1: false,
    x: 0,
    y: 10,
    stackMax: 15,
    queue: [
        {stackMax: true},
        {stack: 3},
        {first: true},
        {suck:true},
        {stackMax: true},
        {stack: 2},
        {first:true},
        {nosucky: true},
        {stackMax: true},
        {stack: 0},
        // {first: true},
        // {suck:true},
        // {stackMax: true},
        // {stack: 4},
        // {first:true},
        // {nosucky: true},
        // {stackMax: true},
        // {home: true}
    ],
    stacks: [
        {h: 4},
        {h: 7},
        {h: 5}
        // ,
        // {h: 0},
        // {h: 1},
        // {h: 0},
        // {h: 0},
        // {h: 7},
        // {h: 8}
    ]
})

const r_switch = (k, a, b) => {
    let r = robot()
    r[k] = (r[k] == a) ? b : a
    robot(r)
}

const r_set = (k,v) => {
    let r = robot()
    r[k] = v
    robot(r)
}

module.exports = {robot, r_set, r_switch}