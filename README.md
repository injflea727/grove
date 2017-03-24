# The Grove Virtual PC

The **Grove** is a virtual personal computer that runs in a web browser.
You can use it to run the [MOSS](https://github.com/druidic/MOSS) operating system.
It's also possible to write your own operating system or program that runs directly on a Grove.

![Screenshot of a Grove computer running a simple program](screenshot.png)

## What's in the box?

This repository houses a general-purpose version of the Grove computer
that has no operating system or other software installed. The intended
audience is software developers who want to write an operating system
or other software for the Grove. If you want a virtual computer that's
actually usable out of the box, check out the repo for the
[MOSS](https://github.com/druidic/MOSS) operating system, which contains
a Grove image with an OS already installed.

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
and we've made an effort to ensure that the Grove has no unnecessary
moving parts.

### Immutable File Storage

The Grove uses a [quine](https://en.wikipedia.org/wiki/Quine_(computing))-based file storage system:
rather than destructively updating its persistent state,
the Grove emits the source code for a new virtual computer that has the updated state.
This makes it easy to restore an earlier version of your system if
you accidentally make unwanted changes.

### Functional API

The Grove's API encourages you to write your programs in a functional style.
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

We'll be the first to admit that the Grove's text-only
user interface is restrictive, and even primitive.
If you come in expecting a tech-level similar to the Apple II,
we think you'll be pleasantly surprised.

However, we believe that these restrictions
can actually be a boon to programmers.
They help focus your efforts on features and functionality,
and relieve you of the endless visual tweaking that attends
GUI development.

Although the Grove is restricted to text-only programs, that
doesn't mean it can't *produce* multimedia software. The
[MOSS](https://github.com/druidic/MOSS) operating system gives you tools to
create fully-featured HTML and JavaScript applications that run in your
web browser.

## API Reference

### The Data Storage System

The **data storage system** holds *entries*, which may be documents,
programs, or any other data. An entry has a *name*, which must be unique among
all entries in the system. It also has *content*.

Data written to the data storage system will persist across
restarts of the computer.

Most of the time, the programs you use will
interact with the data storage system on your behalf. However,
you can also write to data storage directly by
clicking the small button on the right side of
the computer's case. This is the only way to install an
operating system on a Grove computer that doesn't yet have
one.

### Starting up

When a Grove system starts up, it looks for a data entry called
`system/startup.js`. It expects this entry to contain the
definition of a function `main()`. If the `main()`
function exists, the Grove
will run it. If not, it will display an error message to
explain what went wrong.

Here is an example `system/startup.js`:

```javascript
function main() {
  return 'Hello, world!'
}
```

This is not a very interesting program. It will cause the
Grove to display just the text `Hello, world!`. It
will not react to any input; the text will just remain on
the screen forever. Kind of pointless, but it does
illustrate the fact that whatever text is returned from
`main()` will be displayed on the screen.

Let's write a more interesting program. Here is one that
counts the number of keys the user has pressed since the
computer started up.

```javascript
var count = 0
function main(event) {
  if (event.type === 'keyDown') {
    count++
  }
  return 'Keys pressed: ' + count
}
```

What's going on here? The key to understanding this is that
`main` is called more than once. In fact, `main` is called
every time the Grove detects an *event* in the system.
An event can be any of the following:

- a keypress or key release
- a file change
- a web request returning some data or failing
- an animation timer ticking ahead to a new frame

The `main` function also receives the current state of the
data storage system as its second argument.

Here is an example of a program that reads from data storage
to print its own source code.

```javascript
function main(event, data) {
  return data.read('system/startup.js').split('\n')
}
```
