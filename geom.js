
// canvas margin
let margin = 24

// scale
let s = 14

// model width/height
let [w,h] = [70,20]

// canvas scaled width/height
let [cw,ch] = [s*w,s*h]

// plateu heigth
let ph = 3

// crane
let qh = 16 // half crane height
let qw = 40 // half crane width

// stacks of discs
let dw = 32 // half disc width
let dh = 3  // half disc height
let sp = 17  // padding between stacks
let stacksLeft = margin // left margin of the stacks

let xi = i => i * (dw*2 + sp)
let hi = i => (i * (dh*2 + 1))

let stackX = i => stacksLeft + margin + xi(i)
let stackY = j => ch - hi(j) - margin

module.exports = {
    margin, s,
    w, h, cw, ch,
    ph,
    qh, qw,
    dw, dh, sp, stacksLeft,
    xi, hi,
    stackY, stackX
}