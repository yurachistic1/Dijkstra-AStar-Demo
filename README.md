## Visualisation of Dijkstra and A* Pathfinding Algorithms
Can be viewed [here](https://yurachistic1.github.io/Dijkstra-AStar-Demo/).

### How To Use
- Click on the algorithm name in the page header to select A* or Dijkstra. 
- Click on the grid to draw walls. 
- Drag start and end tiles with your mouse to change their position.
- Click Start button to start the visualisation.  

### Colour Legend 
| Colour | Description |
| :-: | ----------- |
| 🟩  | Start position |
| 🟥 | End position |
| ⬛ | Walls |
| 🟦  | Explored nodes |
| 🟨  | Fringe or nodes in the open set of the algorithm |
|🟪| Path|
|⬜| Unexplored nodes |

Note: I tried to pick [colourblind suitable](https://mikemol.github.io/technique/colorblind/2018/02/11/color-safe-palette.html) colours, the tones in the visualisations differ from these available emojis. 

### Background

I have been watching some [coding train](https://www.youtube.com/user/shiffman) videos and I decided to give p5.js a try. I have always really enjoyed visualisations of pathfinding algorithms on square grids so I thought it would be a good project to do with p5.js. 

In my implementation diagonal movement is allowed and octile distance is used to calculate edge costs and as heuristic function for A*. I found this [blog](http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html) very interesting and accessible when trying to figure out what kind of heuristic function I should be using, and it also gave me the idea to add Dijkstra to the demo since all I had to do was to set the heuristic function result to 0 for all nodes.
