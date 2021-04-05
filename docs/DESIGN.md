# DESIGN

## About geometry

Each hexagon has a vertex pointing on top. Its side $s$, width $w$, and height $h$ are such that their are dimensions $s/2$ , $w/2$, and $h/2$ of a rectangular triangle such that:
$$
(h/2)^2=(w/2)^2+(s/2)^2 \iff h^2=w^2+s^2
$$

The following angular equality also holds:
$$
(s/2)=(h/2)sin (\frac{1}{2}\frac{2\pi}{6}) \iff s = h sin(\frac{\pi}{6})=\frac{h}{2}
$$
One concludes with a relationship between the width $w$ and the height $h$:
$$
\frac{w}{h}=cos (\frac{\pi}{6})=\frac{\sqrt{3}}{2}\approx 0.866
$$
The jersi field has a with $W$ equivalent to 9 hexagon widths, and an height $H$ equivalent to 5 hexagon widths plus 4 hexagon sides. It leads to:
$$
(W, H)=(9w, 5h+4s)=(9hcos(\pi/6),(5+4sin(\pi/6))h)
$$
$$
\frac{W}{H}=\frac{9\sqrt{3}}{14}\approx 1.113
$$

So the width $W$ is greater than the height $H$ for about 10%.

From the board width $W$ one can retrieve the hexagon width $w$, and its height $h$ and side $s$:
$$
(w, h, s)=(\frac{W}{9},\frac{W}{9}\frac{2\sqrt{3]}}{3},\frac{W}{9}\frac{\sqrt{3]}}{3})
$$
Inserting two squares of side $c$, separated each other by $\epsilon$, inside an hexagon, implies the following constraint on the square side $c$:
$$
c=\frac{h-\epsilon}{1+tg(\frac{\pi}{6})}=\frac{h-\epsilon}{1+\frac{\sqrt{3}}{3}}
$$
In turn, inserting two squares of side $c$, separated each other by $\epsilon$, inside a squared box of side $b$, the inner squares being distant by $\epsilon$ from the enclosing box, implies the following constraint on such box:
$$
b=2c+3\epsilon
$$
Such enclosing box and the hexagon must have the same center.