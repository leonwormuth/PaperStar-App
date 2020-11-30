# PaperStar App

An automated art generator which posts to Facebook every two hours. Built using Express/NodeJS. It is based on a personal hobby of mine which involves cutting fractal stars from folded paper.

### Content
The app uses a virtual JavaScript canvas (node-canvas) to generate different kinds of stars:
<details>
  <summary>LineStar/CurveStar (Click for example)</summary>
  
  <p align="left">Here the lines have no awareness of each other and can overlap. The star below is made up only of curved lines. The line endpoints fall onto an invisible grid.</p>
  <img width="800" alt="Example CurveStar" src="https://scontent.fper8-1.fna.fbcdn.net/v/t1.0-9/121533357_628383294710503_3404520603675441397_n.png?_nc_cat=106&ccb=2&_nc_sid=9267fe&_nc_ohc=7Jf0POTZfL0AX-Rw6VY&_nc_ht=scontent.fper8-1.fna&oh=bbbbc057f04c90c302c9856a4fbdf3c3&oe=5FEBEB65">
</details>
<details>
  <summary>AwareStar (Click for example)</summary>
  
  <p align="left">Here the lines that form the star have an awareness of each other and cannot touch or overlap. The lines are bound to the same invisible grid, and are generated in a stepwise fashion.</p>
  <img width="800" alt="Example CurveStar" src="https://scontent.fper8-1.fna.fbcdn.net/v/t1.0-9/118143047_588464118702421_2998490768554201612_n.png?_nc_cat=102&ccb=2&_nc_sid=9267fe&_nc_ohc=6qGJqdIvOjcAX9yv6GB&_nc_ht=scontent.fper8-1.fna&oh=c67e5e2773d17b3775322b9c8c2156f0&oe=5FE8706A">

  <p align="left">The generator has been designed with future improvements in mind, such as the ability to generate stars at varying scales:</p>
  <img width="800" alt="Example CurveStar" src="https://i.imgur.com/UokC0zi.png">
</details>

### Functionality
Most of the work occurs within `paperStar.js`:
* Initialisation of the canvas and data structures
* Algorithms which generate the stars
* Saving the generated canvas locally as a png
* Sending a request (using axios) to the Facebook API to create a post on Facebook

Scheduling and selection of which type of star to post is done within `app.js` using node-cron.
