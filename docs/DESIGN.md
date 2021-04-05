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
