# The Stone Virtual PC

The **Stone** is a virtual personal computer that runs in a web browser. 
You can use it to run the [MOSS](https://github.com/druidic/MOSS) operating system.
It's also possible to write your own operating system or program that runs directly on a Stone.

This repository houses a general-purpose version of the Stone computer
that has no operating system or other software installed. The intended
audience is software developers who want to write an operating system
or other software for the Stone. If you want a virtual computer that's
actually usable out of the box, check out the repo for the
[MOSS](https://github.com/druidic/MOSS) operating system, which contains
a Stone image with an OS already installed.

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

### Sturdy Walls, Open Gates

We'll be the first to admit that the Stone's user interface is restrictive,
and even primitive. If you come in expecting a tech-level similar to the Apple II,
we think you'll be pleasantly surprised.

We think that these restrictions can actually be a boon to programmers.
They encourage you to focus more on features and functionality,
and less on making a glossy UI.

Although the Stone can only run certain, restricted types of programs, that
doesn't mean it can't *produce* more complex software. The
[MOSS](https://github.com/druidic/MOSS) operating system gives you tools to
create fully-featured HTML and JavaScript applications that run in your
web browser. The Stone is, almost paradoxically, both ascetic and cosmopolitan.

