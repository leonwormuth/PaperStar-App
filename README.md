# PaperStar App

An automated art generator which posts to Facebook every two hours. Built using Express/NodeJS. It is based on a personal hobby of mine which involves cutting fractal stars from folded paper.

### Content
The app uses a virtual JavaScript canvas (node-canvas) to generate different kinds of stars:
<details>
  <summary>LineStar/CurveStar (Click for example)</summary>
  
  <p align="left">Here the lines have no awareness of each other and can overlap. The star below is made up only of curved lines. The line endpoints fall onto an invisible grid.</p>
  <img width="800" alt="Example CurveStar" src="https://i.imgur.com/wciIeUr.png">
</details>
<details>
  <summary>AwareStar (Click for example)</summary>
  
  <p align="left">Here the lines that form the star have an awareness of each other and cannot touch or overlap. The lines are bound to the same invisible grid, and are generated in a stepwise fashion.</p>
  <img width="800" alt="Example AwareStar" src="https://i.imgur.com/m24yesb.png">

  <p align="left">The generator has been designed with future improvements in mind, such as the ability to generate stars at varying scales:</p>
  <img width="800" alt="Example AwareStar" src="https://i.imgur.com/UokC0zi.png">
</details>

### Functionality
Most of the work occurs within `paperStar.js`:
* Initialisation of the canvas and data structures
* Algorithms which generate the stars
* Saving the generated canvas locally as a png
* Sending a request (using axios) to the Facebook API to create a post on Facebook

Scheduling and selection of which type of star to post is done within `app.js` using node-cron.
