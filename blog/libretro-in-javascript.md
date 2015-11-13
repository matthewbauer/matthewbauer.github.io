# Retrospective on "libretro" in the browser

This is a retrospective on some projects I've been working on: namely [retrojs](retrojs), [x-retro](x-retro), [GameTime](gametime), [gametime-player](gametime-player), [gpemu](gpemu) and learning how best to structure a project using the "Do One Thing Well".

## The beginning: the wonderful world of Node bindings

I've been interested in emulators for a while now.

###qwerty
```
q  w  e  r  t  y  u  i  o  p  [  ]
 a  s  d  f  g  h  j  k  l  ;  '
  z  x  c  v  b  n  m  ,  .  /
```

###ascii
```
81  87  69  82  84  89  85  73  79  80   [   ]
 65  83  68  70  71  72  74  75  76  ;   '
  90  88  67  86  66  78  77  ,   .   /
```

###standard
```
1  2  3  0  0  3  0  2  1  2  3  1
 0  3  2  1  2  1  1  3  0  1  2
  1  2  0  3  1  3  0  1  2  0
```

###gamepad
```
 L       R
 ↑       Y
← → - - X A
 ↓       B
```

###standard
```
  4            5
  12           3
14  10  8  9  2 1
  13           0
```

###libretro
```
 11       12
 4        1
6 7 2 3  9 0
 5        8
```
