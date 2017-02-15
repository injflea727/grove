# The Stone Virtual PC

The **Stone** is a virtual personal computer that runs in a web browser.
You can use it to run the [MOSS](https://github.com/druidic/MOSS) operating system.
It's also possible to write your own operating system or program that runs directly on a Stone.

![Screenshot of a Stone computer running a simple program](screenshot.png)

## What's in the box?

This repository houses a general-purpose version of the Stone computer
that has no operating system or other software installed. The intended
audience is software developers who want to write an operating system
or other software for the Stone. If you want a virtual computer that's
actually usable out of the box, check out the repo for the
[MOSS](https://github.com/druidic/MOSS) operating system, which contains
a Stone image with an OS already installed.

## Installation

It couldn't be easier! Just visit https://druidic.github.io/MOSS.
When you save your progress, your save file will be downloaded as HTML.
You can open this file (just double-click it on most systems)
to start from where you left off.

## Features and Philosophy

### Human-Scale Computing

The underlying technologies of the Mac and Linux operating systems
we use every day were not designed for personal use, but for mainframes
and servers. This legacy often leaks through into our daily experience,
in the form of byzantine file organization schemes, confusing user permission
issues, and outmoded APIs.

The alternative is Windows, which is designed for personal and business
use but which has its own rough edges, and is particularly unsuited to
programming.

We believe that computers don't have to be complicated to be useful,
and we've made an effort to ensure that the Stone has no unnecessary
moving parts.

### Immutable File Storage

The Stone uses a [quine](https://en.wikipedia.org/wiki/Quine_(computing))-based file storage system:
rather than destructively updating its persistent state,
the Stone emits the source code for a new virtual computer that has the updated state.
This makes it easy to restore an earlier version of your system if
you accidentally make unwanted changes.

### Functional API

The Stone's API encourages you to write your programs in a functional style.
This means that, whenever feasible, programs are built out of *pure functions*
that merely transform inputs into outputs.
Pure functions have no side effects or dependencies on global state.
These properties make programs easy to debug, because if a function produces
unexpected output, the problem must lie either in the inputs to the function
or in the logic of the function itself.
For the same reasons, it is easy to write automated tests for functional
programs. The [MOSS](https://github.com/druidic/MOSS) operating system
takes advantage of this and has automated testing facilities
built into its very core.

At Druidic, experience has taught us that functional programming is a
delightful and effective way to build software. We think you'll agree.

### A Walled Garden with Open Gates

We'll be the first to admit that the Stone's text-only
user interface is restrictive, and even primitive.
If you come in expecting a tech-level similar to the Apple II,
we think you'll be pleasantly surprised.

However, we believe that these restrictions
can actually be a boon to programmers.
They help focus your efforts on features and functionality,
and relieve you of the endless visual tweaking that attends
GUI development.

Although the Stone is restricted to text-only programs, that
doesn't mean it can't *produce* multimedia software. The
[MOSS](https://github.com/druidic/MOSS) operating system gives you tools to
create fully-featured HTML and JavaScript applications that run in your
web browser.

## API Reference

When a Stone system starts up, it tries to run the program defined in the global `main()` function.

```javascript
function main(state, event) {
  // ...
}
```

This function will be called many times as the system runs. Specifically, it will be called for
every *event* that occurs in the system. Events can include:

- Keypresses on the keyboard
- Animation timer events
- HTTP calls returning or failing

The `main()` function takes two arguments: the `state` of the system and the `event` that occurred.
It should return a new `state` object, which will be passed back to `main()`, possibly with some changes,
on the next `event`.

On the first call to `main()`, the event will be `{type: 'boot'}` and the `state` will be an object containing
only the *system section*, described below.

The state object has a *system section* which is a description
of the state of the filesystem, screen buffer, keyboard, clock, and random number generator.

```
{
  __SYSTEM__: {
    keyboard: {
      lastKeyPressed: [number | null],
      keysHeld: [number]
    },
    screen: [
      [string | [[string | {format: string, text: string}]]]
    ],
    clock: Date,
    random: number,
    files: {[string]: string}
  }
}
```

### Global functions

```
http(['get' | 'put' | 'post' | 'patch' | 'delete'], string, {
  headers: {[string]: string},
  body: string
})
```

```
{
  status: ['pending' | 'succeeded' | 'failed'],
  error: string,
  statusCode: [number | null],
  response: string
}
```
