# Working Sudoku Webpage using HTML, CSS and JS
## File structure

The only unused file is *sudoku.py*, it was the previious code I made in Python.

The rest of the files compose a webpage in which you can play a sudoku game.

## Project timeline

#### First of all, who am I?:

I am an engineering student that likes solving sudokus, and since I am always looking for new challenges, I thought making a functional Sudoku game would keep me entertained for a while.

---
### The process
####  Initial goal

When I first started the project, my initial goal was to make a program that could **print playable sudokus** in a terminal. I chose **Python** as a language (since it's the one I am most familiar with) and started implementing code.

---
#### First steps

The first thing I did was the **easier methods** which I would later need to create the board. These methods allowed the program to know which numbers were safe to put in a position.

> Note: The content of the sudoku is stored in a 81-position array, since I found it easier to iterate through it than a 9x9 matrix.

#### The juicy part
---
Next, I faced one of the **biggest challenges**, if not the biggest, of the journey: making the *"sudoku maker"* algorithm. This took me a while, mostly because I didn't allow myself to look anything up on the Internet, except some basic concepts I had forgotten, of course. (Let's be real, who doesn't). 

The first working methods I managed to pull off were purely brute-force-based, let's say they were not the best in terms of time complexity.

After a lot of work, I finally managed to complete a **recursive method** that was able to print complete valid sudokus. That kept my motivation, which I sould indeed need for the next part: **Making incomplete valid sudokus**

At first I thought it would not be as complicated as what I had just done, "It's just about removing numbers from the board, right?" Well, it turns out it was. Yes, I only had to remove certain numbers from the board, but **which and when** were the factors that would determine if incomplete sudoku was valid or not. 

To make it possible, I had to use more recursive functions, which basically created a complete sudoku and made sure every number they removed was safe to be removed.
I finally got it done after a few days of work, and now I had a full *"sudoku maker"* with 3 possible difficulties.

At this point I was already satisfied with my creation, but I decided to keep pushing and made some purely aesthetic methods like the ``__str__()``
> Note: When I say *valid sudoku*, i refer to a sudoku that has just one possible solution.

#### Now what?

Well, the next step was jumping from terminal text to a GUI. At first, I decided to use some Python libraries like *Flet* or *PyGame*, but I wasn't happy with the results. I have to say that I did not have a clear goal, so at that point I was purely testing stuff out in order to see which of those suited most what I had in mind (to make a sudoku game playable in any device).

After some progress was made in PyGame, I realised that the game would be limited to be a desktop application, so I had to make a **paradigm change**. I finally had a good idea: i thought "Just make a website, everyone can acces a website on the Internet".
I will leave this to the next chapter.

---

### Second challenge: Web environment

Okay, I now had a goal in mind, but did not now how to make it happen. I had previously made some webpages, so I wasn't scared of the *web world*, but never had I learnt JavaScript, and it was the perfect time to start.

I decided to migrate the code (yes, the full *sudoku.py* code), to a new *.js* file. This forced me to learn the JS syntax, which wasn't as hard as I had expected. 

After the dirty work was done, now I had to make the webpage. I chose to integrate the logic in a *canvas* element in the HTML, since I thought that would be the best alternative.

From then on, I started to allow myself to use GPT (it helped me a lot with my rookie mistakes), and after more than a week, I finally came to the final product: This Sudoku game I am happy to be now posting (November 13, 2024, altough the game was finished about a month ago).

## Personal thoughts

I think I left my thoughts clear as I was writing the timeline above, but I like leaving space for a section like this.

This project **helped me a lot** in my programming logic, recursive function making, improved my understanding of web environment, etc.

I have to say that this is my **biggest project** to this date, and it was made entirely by me (I used some help for the web part since I am a beginner), and being able to write this makes me happy, because I am sure I have learned a lot throughout the process.

I would **definately recommend** trying to code some stuff like this by yourself if you are starting to learn about some more advanced programming and you like new challenges. Don't take it from me though, just do it and you will see how much you learn.



#### 2t0rHub on GitHub, the long README master.

