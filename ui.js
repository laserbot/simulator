// const Y = require('js-yaml')
const R = require('ramda')
const m = require('mithril')
const Opstack = require('./machine.js')


const {robot, r_set, r_switch} = require('./robot.js')

const controller = require('./controller.js')

var start = undefined;
function step(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;
    // if (progress < 2000) {

        let r = robot()
        r.x = Math.max(0, r.x + r.m0)
        r.y = Math.max(0, r.y + r.m1)
        robot(r)

        controller()

      window.requestAnimationFrame(step);
    // }
}

const prop = (label, val) => m('p', [m('span',`${label}: `), m('b', val)])
const btn = (label, fn) => m('button', {onclick: fn}, label)

var UI = {
    oninit: (vnode) => {
        // if loaded initially, update the stream (before first drawing)
        // if (vnode.attrs.state && robot() !== vnode.attrs.diag) {
        //     numbers(vnode.attrs.diag)
        // }

        // update the route when the contents are changed
        robot.map(s => m.route.set('/:state', {state: JSON.stringify(s)}))
    },
    oncreate: () => {
        window.requestAnimationFrame(step)
    },
    view: (vnode) => {
        // let isBetter = array().length < (2 * graph().length)

        let s = robot()
        let sw = x => x ? m('span.switch.on', 'on') : m('span.switch.off', 'off')
        let M = x => x === 0 ? m('span.motor.off', 'off') : (x < 0 ? m('span.motor.left', '«««') : m('span.motor.right', '»»»'))

        return m('.ui', [
            m('div',[
                m('div.manual', [
                    btn('left', () => r_switch('m0', -1,0)),
                    btn('right', () => r_switch('m0', 1,0)),
                    btn('up', () => r_switch('m1', -1,0)),
                    btn('down', () => r_switch('m1', 1,0))
                ]),
                m('div.controller', [
                    btn('s1', () => controller({stack:1})),
                    btn('s2', () => controller({stack:2})),
                    btn('s3', () => controller({stack:3})),
                    btn('s4', () => controller({stack:4})),
                    btn('s5', () => controller({stack:5})),
                    btn('first', () => controller({first:true})),
                    btn('top', () => controller({top:true})),
                    btn('stackMax', () => controller({stackMax:true})),
                    btn('suck', () => controller({suck:true})),
                    btn('no sucky', () => controller({nosucky:true})),
                ]),
                m('p', [
                    prop('y', s.y),
                    prop('x', s.x),
                ]),
                m('hr'),
                prop('commands ', [
                    prop('cmd', s.cmd),
                    m('pre',R.join('\n', R.map(JSON.stringify.bind(JSON), s.queue || [])))
                ]),
                m('hr'),
                m('p', [
                    prop('m0', s.m0),
                    prop('m1', s.m1),
                    prop('suck', sw(s.suck)),
                    prop('sw0', sw(s.sw0)),
                    prop('sw1 ', sw(s.sw1)),
                    prop('stacks ', R.join('_', R.map(R.prop('h'), s.stacks))),
                ])    
            ]),
            m('.opstack', [
                m('h4', 'Operator Stack'),
                m(Opstack, {robot: robot()})
            ]),
            
        ])
    }
}

module.exports = UI