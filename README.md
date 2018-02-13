# Node.js Loginapp

This is a user login and registration app using Node.js, Express, Passport and Mongoose. It is part of the YouTube series [here](https://www.youtube.com/watch?v=Z1ktxiqyiLA)

### Version
1.1.0

### Usage


### Installation

Loginapp requires [Node.js](https://nodejs.org/) v4+ to run.

```sh
$ npm install
```

```sh
$ npm start
```
End of term project assignment

Create a multi-threaded socket server and client implementing online multipayer space game:

3-mark:
* users can log into a game using unername and password
* players are spaceship pilots and can fly through universe. Universe is N x N grid. If theplayer is about to exceed bounds of the space, "You are at the edge of the universe" message is displayed.
* players can collect minerals when landing on given spots. Players can only see N near spots (in Chebyshev distance).


xxxxxxxxx
xxxxxxxxx
xxoooooxx
xxomoooxx
xxoopooxx
xxoooooxx
xxoooooxx
xxxxxxxxx
example map with seeing distance of 2
x - unknown
o - spot in sight
m- spot with mineral
p - player

4-mark:
* a server is tracking the current user count
* a server has a connected user limit. If the limit is reached, server instead of "accepting the connection" sends back information about the overload.
* supernova explosion: players with GM privilage can make the star explode: near the given position multiple spots with minerals appear

5-mark:
4-mark version and additionaly:
* player can see other players movements in realtime. Two players cannot occupy the same spot at the same time
