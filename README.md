# Stone

The **Stone** is a virtual personal computer that runs in a web browser.
It uses a quine-based file storage system: rather than destructively
changing its persistent state, the Stone emits the source code for a
new virtual computer with the updated state. This enables you to easily
track changes to your system over time and easily restore a backed-up
copy of your system if needed.

This repository houses a general-purpose version of the Stone computer
that has no operating system or other software installed. The target
audience is software developers who want to write an operating system
or other software for the Stone. If you want a virtual computer that's
actually usable out of the box, check out the repo for the
[MOSS](https://github.com/druidic/MOSS) operating system, which contains
Stone images with an OS already installed.

