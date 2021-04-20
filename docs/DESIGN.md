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
In turn, the two squares of side $c$, separated each other by $\epsilon$, are inserted into a rectangular box of width $w$ and hight $h$.

Such enclosing rectangular box and the hexagon must have the same center.

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
In turn, the rectangular box $B$ enclosing either a cube or a stack of two cubes has same center than the hosting hexagon $H$. But the $left$ and $top$ of the rectangular box $B$ are shifted back from $(x_H, y_H)$ by $(-\frac{w}{2},-\frac{h}{2})$.

## About transmission protocol

### First approach

The concern is the transmission of information between two remote browsers playing *jersi-js*. For simplicity, let us assume that:

- The information is transfered by human thanks to either email, SMS or tchat.
- The information is represented as a string of characters.
- The information is limited to the last move of the active player.

Having made the above assumptions, the solution has to satisfy the following additional requirements:

- The transmitted string should be short.
- The transmitted string should be difficult to corrupt.
- The transmitted string should contain redundancy about the game state.

Our solution:

- Encode a triplet of integers $(k, t, m)$, where:
  - $t$ is the turn number (1 for the first move of whites, 2 for the first move of blacks, ...);
  - $m$ is the rank of the played move amongst all the sorted possible moves at that turn;
  - $k$ is an integer computed recursively turn by turn:
    - $k_t = f(k_{t-1})$ 
    - $k_1$ is determined randomly
    - $k_t$ runs between $0$ and $k_{max}$
- All these three integers $(k,t,m)$ are represented in base $b=34$ which correspond to the $0-9$ digits plus the $A-Z$ letters, where $I$  and $O$ have been removed.
- $k$ uses always the same number of digits; so some $0$ might be put as prefix.
- $t$ and $m$ are ciphered using addition modulo $k$ in the base $b$, applying such addition digit per digit and after padding $t$ and $m$ with zeros so that they are represented by a number of digits which are multiple of the number of digits of the key $k$.
- Example of encoding: F0A-ATD-PQ4.

Notes:

- The representation of the move $m$ implies the computation of all possible moves. This is a good thing for avoiding corruption. But it requires an extra-programming effort.
- Such $m$ representation would not be optimal for compressing the game state in a search algorithm like MCTS.

### Second approach

Let us encode the action:

* Like the first encoding approach, let us define a key $k$, in order to cypher the rest of the information.
* Then let us define the type of action and the involved cells:
  1. one drop: 1 cell 
  2. double drops: 2 cells
  3. one single cube move: 2 cells
  4. one single cube move with king relocation: 3 cells
  5. one single stack move: 2 cells
  6. one single stack move with king relocation: 3 cells
  7. double cube-stack move: 3 cells
  8. double cube-stack move with king relocation: 4 cells
  9. double stack-cube move: 3 cells
  10. double stack-cube move with king relocation: 4 cells
* The type of action requires: 4 bits + 4*7 bits = 4 + 28 = 32 bits = 4 bytes. 
* So an action can be represented by 8 hexadecimal digits ; example: $AF-01-C1-25$

### Third approach

Let us encode the complete state:

- Turn: difficult to anticipate; let say $4 \times 40 = 160$; it requires 8 bits, so 1 byte.
- Credit: an integer between 0 and 40; it requires 8 bits, or 1 byte.
- For each of 42 cubes:
  - Its hexagon amongst 69; it requires 9 bits;
  - It position: top, bottom ; or it not inside some hexagon: reserved or captured; it requires 2 bits;
  - So for each cube, it requires 11 bits
- For all cubes, it requires $42 \times 11 = 420 + 42 = 462$ bits, or 58 bytes

All in all, it requires 60 bytes.
