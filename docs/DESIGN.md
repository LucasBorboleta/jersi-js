# DESIGN

## About sizes

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
The jersi field has a with $W$ equivalent to 13 hexagon widths, and an height $H$ equivalent to 5 hexagon widths plus 6 hexagon sides. It leads to:
$$
(W, H)=(12w, 5h+6s)=(12\frac{\sqrt{3}}{2}h,(5+6\frac{1}{2})h)
$$
$$
\frac{W}{H}=\frac{3\sqrt{3}}{4}\approx 1.299
$$

So the width $W$ is greater than the height $H$ for about 10%.

From the board width $W$ one can retrieve the hexagon width $w$, and its height $h$ and side $s$:
$$
(w, h, s)=(\frac{W}{12},\frac{W}{12}\frac{2\sqrt{3]}}{3},\frac{W}{12}\frac{\sqrt{3]}}{3})
$$
Inserting two squares of side $c$, separated each other by $\epsilon$, inside an hexagon, implies the following constraint on the square side $c$:
$$
c=\frac{h-\epsilon}{2+tg(\frac{\pi}{6})}=\frac{h-\epsilon}{2+\frac{\sqrt{3}}{3}}
$$
In turn, inserting two squares of side $c$, separated each other by $\epsilon$, inside a squared box of side $b$, the inner squares being distant by $\epsilon$ from the enclosing box, implies the following constraint on such box:
$$
b=2c+3\epsilon
$$
Such enclosing box and the hexagon must have the same center.

## About coordinates

Abstractly, from the `rules`module, each hexagon is identified by a pair of integers $(u,v)$ in an oblique coordinates system whose origin $(0,0)$ is the central hexagon $C$ of the board.

From the `draw`module, each hexagon is identifies by its center by a pair of reals $(x,y)$, then rounding as pixels, and interpreted in the orthogonal frame of the `HTML div` whose origin $(0,0)$ is top left.

The x-y coordinates of the central hexagon of $C$ are:
$$
(x_C, y_C)=(6w,\frac{5}{2}h+3s)
$$
The x-y coordinates of the central hexagon of $H$ are:
$$
(x_H, y_H)=(x_C, y_C)+u(w,0)+v(w \sin(\frac{\pi}{6}), -w \cos(\frac{\pi}{6}))=(x_C, y_C)+w(u+\frac{v}{2},-v\frac{\sqrt{3}}{2})
$$
In turn, the box $B$ enclosing either a cube or a stack of two cubes has same center than the hosting hexagon $H$. But the $left$ and $top$ of the box $B$ are shifted back from $(x_H, y_H)$ by $(-\frac{b}{2},-\frac{b}{2})$.