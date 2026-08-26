# Physics & Structural Mechanics Conventions

## 1. Global Coordinate System

- **Origin**: $x = 0$ is at the left-most point of the beam.
- **X-axis ($+x$)**: Horizontal, directed to the right ($0 \le x \le L$).
- **Y-axis ($+y$)**: Vertical, directed upwards.
- **Angles ($\theta$)**: Measured counter-clockwise from the $+x$ axis in degrees/radians.

---

## 2. Force & Moment Sign Conventions

- **Forces**:
  - Vertical forces pointing upwards ($\uparrow$) are positive $+F_y$ (angle $90^\circ$).
  - Vertical loads pointing downwards ($\downarrow$) are negative $-F_y$ (angle $-90^\circ$ / $270^\circ$).
- **Moments**:
  - Counter-Clockwise (`"ccw"`): Positive ($+M$).
  - Clockwise (`"cw"`): Negative ($-M$).
  - Moment of force $\mathbf{F} = (F_x, F_y)$ at $(x_f, y_f)$ about $(x_0, y_0)$:
    $$M = F_y \cdot (x_f - x_0) - F_x \cdot (y_f - y_0)$$

---

## 3. Internal Beam Response Conventions

- **Shear Force $V(x)$**:
  - Standard engineering beam convention: Upward forces to the left of the cut cause positive shear.
  - At point load $P$: $V(x^+) - V(x^-) = -P$ (downward load creates a downward step in SFD).
- **Bending Moment $M(x)$**:
  - Sagging moment (tension on bottom, compression on top) is considered positive.
  - Differential relationship:
    $$\frac{dM}{dx} = V(x)$$
    $$\frac{dV}{dx} = -w(x)$$
- **Discontinuities**:
  - Point forces introduce step discontinuities in $V(x)$ and slope discontinuities in $M(x)$.
  - Concentrated moments introduce step discontinuities in $M(x)$.

---

## 4. Equilibrium Equations

For statically determinate 2D systems, reactions are calculated from:
$$\sum F_x = 0$$
$$\sum F_y = 0$$
$$\sum M_{point} = 0$$

Expressed as a linear system:
$$[A]\{R\} = \{b\}$$
Where $\{R\}$ are unknown reactions, $[A]$ contains geometric moment arms and direction cosines, and $\{b\}$ aggregates applied load contributions.

---

## 5. Beam Deflection (Moment-Curvature / Macaulay)

The elastic curve governing equation:
$$E I \frac{d^2 v}{dx^2} = M(x)$$
- $E$: Young's Modulus of Elasticity ($\text{N/m}^2$ or $\text{Pa}$)
- $I$: Second moment of area / Moment of inertia ($\text{m}^4$)
- $v(x)$: Beam deflection function ($\text{m}$)
- $\theta(x) = \frac{dv}{dx}$: Slope / rotation ($\text{rad}$)

Macaulay brackets $\langle x - a \rangle^n$:
$$\langle x - a \rangle^n = \begin{cases} 0 & \text{if } x < a \\ (x - a)^n & \text{if } x \ge a \end{cases}$$
Used for piecewise continuous integration without splitting into disparate boundary value problems per interval.
