# DCollector
Data collector web application.

## Goals
This application is ment to be a general purpose data collector. It does not use a DB but json files. This is because I wanted to make it as flexible as possible. This way there is no model by which I have to store data. I can store whatever I want, whenever I want, although for data processing purposes it is wise to keep a soft-model.
Currently I'm using it to track my weight and other weight related stuff (and I managed to invite another user).

## Extensions
Being a data collector application, it was unavoidable to have some sort of data processing functionality. Thats why I creted the DProcessor, which uses the above mentioned json files, and creates charts (using HighChartsJS) to visualise the changes and results. It has gone through many iterations, currently you can see the one entry on one chart although they have unified positioners. You can change their order, position and even merge them. Needs a lot of work (unmerge, merge visuals, etc).

## If you want to try
I will add a json file, since without it you won't be able to see the actual functionality.

## Branches
Branch names indicate iterations. The names show alphabetical order using the solar system's moons' names.
