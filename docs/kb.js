const dropdownOptions = [
    {
        title: 'Basic Example',
        program: `
likes(alice, pizza).
likes(bob, sushi). 
likes(alice, chocolate).
`,
        placeholder: 'likes(alice, X).',
    },
    {
        title: 'Definite Clause Grammars (DCGs)',
        program: `
% DCG rules
sentence --> noun_phrase, verb_phrase.

noun_phrase --> determiner, noun.
verb_phrase --> verb, noun_phrase.

determiner --> [the].
determiner --> [a].

noun --> [cat].
noun --> [dog].

verb --> [chased].
verb --> [saw].
`,
        placeholder: 'phrase(sentence, X).',
    },
    // https://github.com/stefanrodrigues2/Prolog-Adventure-game/blob/main/treasure_hunt.pl
    {
        title: "stefanrodrigues2's Adventure Game",
        program: `
:- dynamic(i_am_at/1).
:- dynamic(at/2).
:- dynamic(holding/1).
:- dynamic(lives/1).

:- retractall(at(_, _)).
:- retractall(i_am_at(_)).
:- retractall(holding(_)).
:- retractall(lives(_)).

/* Initial state */
i_am_at(campsite).
lives(3).

/* Paths */
path(campsite, left, shelter).
path(shelter, right, campsite).

path(campsite, down, woods_1) :- flashlight_on, !.
path(campsite, down, woods_1) :-
    at(flashlight, holding),
    write('You need a battery to turn on the flashlight. Get a battery from the shack.'), nl,
    !, fail.
path(campsite, down, woods_1) :-
    write('You need light to go into the woods. Grab a flashlight with a battery.'), nl,
    !, fail.
path(woods_1, up, campsite).

path(campsite, right, woods) :- flashlight_on, !.
path(campsite, right, woods) :-
    at(flashlight, holding),
    write('You need a battery to turn on the flashlight. Get a battery from the shack.'), nl,
    !, fail.
path(campsite, right, woods) :-
    write('You need light to go into the woods. Grab a flashlight with a battery.'), nl,
    !, fail.
path(woods, left, campsite).

path(campsite, up, shack) :- at(key, holding), !.
path(campsite, up, shack) :-
    write('The shack is locked. Please get the key from the shelter.'), nl,
    !, fail.
path(shack, down, campsite).

path(woods, right, castle) :-
    write('You are at the castle, but do you have a blueprint to find the treasure?'), nl, !.
path(castle, left, woods).

path(castle, up, tower).
path(tower, down, castle) :-
    at(blueprint, holding),
    write('You have the blueprint. Use find. to get the treasure.'), nl, !.
path(tower, down, castle) :-
    write('Did you get the blueprint from the tower? Or did you forget to collect it?'), nl, !.

path(castle, down, deepforest_4) :-
    use_lives,
    write('Bad luck. Go back to save yourself.'), nl.
path(deepforest_4, up, castle).

path(castle, right, deepforest_3) :-
    use_lives,
    write('Bad luck. Go back to save yourself.'), nl.
path(deepforest_3, left, castle).

path(woods, up, deepforest_1) :-
    use_lives,
    write('Bad luck. Go back to save yourself.'), nl.
path(deepforest_1, down, woods).

path(woods, down, deepforest_2) :-
    use_lives,
    write('Bad luck. Go back to save yourself.'), nl.
path(deepforest_2, up, woods).

/* Item locations */
at(flashlight, campsite).
at(battery, shack).
at(key, shelter).
at(blueprint, tower).

flashlight_on :- at(flashlight, holding), at(battery, holding).

/* Movement */
up :- go(up).
down :- go(down).
right :- go(right).
left :- go(left).

/* This rule tells how to move in a given direction. */

go(Direction) :-
    i_am_at(Here),
    path(Here, Direction, There),
    retract(i_am_at(Here)),
    assertz(i_am_at(There)),
    !, look.

go(_) :-
    write('You can''t go that way.').

/* Inventory */
i :-
    at(_, holding),
    write('You are holding:'), nl,
    list_inventory, !.
i :-
    write('You don''t hold anything.'), nl.

list_inventory :-
    at(X, holding),
    write('- '), write(X), nl,
    fail.
list_inventory.

/* Taking items */
take(X) :-
    at(X, holding),
    write('Already holding it.'), nl, !.
take(X) :-
    i_am_at(Place),
    at(X, Place),
    retract(at(X, Place)),
    assertz(at(X, holding)),
    (X == treasure ->
        write('CONGRATULATIONS!!! YOU HAVE THE TREASURE IN HAND. YOU WON!!'), nl, end_game
    ;
        true),
    write('OK.'), nl, !.
take(_) :-
    write('I don''t see it here.'), nl.

/* Dropping items */
drop(X) :-
    at(X, holding),
    i_am_at(Place),
    retract(at(X, holding)),
    assertz(at(X, Place)),
    write('OK.'), nl, !.
drop(_) :-
    write('You don''t have it!'), nl.

/* This rule will reduce the number of lives when player goes into deep forest. */
use_lives :-
    lives(X),
    Y is X - 1,
    retract(lives(X)),
    assertz(lives(Y)),
    (Y =:= 1 -> write('Be careful. You just have 1 life left.'), nl ; true),
    (Y =:= 0 -> die ; true), nl.

/* This rule tells how to move in a given direction. */
go(Direction) :-
    i_am_at(Here),
    path(Here, Direction, There),
    retract(i_am_at(Here)),
    assertz(i_am_at(There)),
    !, look.
go(_) :-
    write('You can''t go that way.'), nl.

/* Directional commands */
up :- go(up).
down :- go(down).
right :- go(right).
left :- go(left).


/* Die */
die :-
    write('You have 0 lives left. GAME OVER!'), nl,
    end_game.

/* Game end stub for Tau Prolog */
end_game :-
    write('<< GAME HALTED >> Please type "start." to restart or "halt." to quit.'), nl.

/* Look around */
look :-
    lives(X),
    i_am_at(Place),
    describe(Place),
    nl,
    notice_objects_at(Place),nl,
    write('You have '),write(X), write(' lives.'), nl.

notice_objects_at(Place) :-
    at(X, Place),
    write('There is a '), write(X), write(' here.'), nl,
    fail.
notice_objects_at(_).

/* Finding the treasure */
find :-
    i_am_at(castle),
    at(blueprint, holding),
    \+ at(treasure, castle),
    assertz(at(treasure, castle)),
    write('AMAZING!! You found the treasure.'), nl,
    write('Collect the treasure and finish the game.'), nl, !.
find :-
    i_am_at(castle),
    write('You don''t have a blueprint to find the treasure.'), nl, !.
find :-
    write('You are not at the castle.'), nl.

/* Instructions */
instructions :-
    nl,
    write('Available commands:'), nl,
    write('- start.                 -- to start the game'), nl,
    write('- up. down. left. right. -- to move'), nl,
    write('- take(Object).          -- to pick up an object'), nl,
    write('- drop(Object).          -- to drop an object'), nl,
    write('- look.                  -- to look around'), nl,
    write('- i.                     -- show inventory'), nl,
    write('- find.                  -- search for treasure'), nl,
    write('- halt.                  -- quit the game'), nl.

start :-
    instructions,
    look.

/* Descriptions */
describe(campsite) :-
    at(flashlight, campsite),
    write('You are at the campsite. There is a flashlight here.'), !.
describe(campsite) :-
    write('You are at the campsite.').

describe(shack) :-
    at(battery, shack),
    write('You are inside the shack. There is a battery here.'), !.
describe(shack) :-
    write('You are inside the shack.').

describe(shelter) :-
    at(key, shelter),
    write('You are inside the shelter. There is a key here.'), !.
describe(shelter) :-
    write('You are inside the shelter.').

describe(woods) :-
    write('You are in the woods. Make sure your flashlight is on.').

describe(woods_1) :-
    write('You are in a darker part of the woods.').

describe(deepforest_1) :-
    write('You walked into the deep forest. You are about to lose 1 life.').

describe(deepforest_2) :-
    write('You walked into the deep forest. You are about to lose 1 life.').

describe(deepforest_3) :-
    write('You walked into the deep forest. You are about to lose 1 life.').

describe(deepforest_4) :-
    write('You walked into the deep forest. You are about to lose 1 life.').

describe(castle) :-
    write('You reached the castle. There is hidden treasure inside.').

describe(tower) :-
    at(blueprint, tower),
    write('You are inside the tower. Grab the blueprint.'), !.
describe(tower) :-
    write('You are inside the tower.').
`,
        placeholder: 'i_am_at(X). go(up). // messages will appear in the console',
    },
];