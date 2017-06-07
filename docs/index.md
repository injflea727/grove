# Grove User Manual

development build

## Introduction

This file comprises the documentation for the Grove computer
system created and distributed by Druidic Technologies. By
reading and referring to it, you should be able to figure
out how to do just about anything that's possible to do with
your Grove system.

Though this manual aims to be comprehensive, it cannot be
exhaustive. For instance, the details of programming with
JavaScript have been glossed over, since extensive
JavaScript tutorials and documentation are available
elsewhere. When the manual must omit details like these, I
have provided references to other resources.

In preparing the manual, I have aimed for clarity, and,
where possible, brevity. If you find places where the manual
could be improved, please send feedback to

the.wizard.ben@gmail.com

## Tutorial: Getting started

If you're reading this, you've already downloaded a Grove
and its accompanying documentation. What now?

### Opening the grove.html file

On many systems, you can double-click the `grove.html` file
you downloaded to open it in your favorite web browser. If
that doesn't work, open a browser (such as Firefox, Chrome,
or Safari) and select the `File > Open File...` menu. In
the dialog box that pops up, find the `grove.html` file and
open it.

### A tour of the Grove

Once you've opened the `grove.html` file, you'll be greeted
by the Grove's boxy virtual monitor and a message informing
you that the Grove doesn't yet have an operating system
installed. Ignore that message for now; before we install
anything, let's get familiar with the Grove's (virtual)
hardware.

#### The power button

The power button is located on the bottom left size of
the virtual computer case. Try clicking it; the virtual
monitor will blank out, indicating that the Grove has turned
off. Click the button again to turn the Grove back on.

#### The disk drive

Just to the right of the power button is the Grove's virtual
disk drive. It's reminiscent of floppy drives of old, and
serves a similar function. It allows you to save a copy of
your Grove system.

Click the disk drive slot. A file will download. If you open
that file in your browser, you'll see that it's simply a
copy of the Grove computer you already have open.

Since you haven't yet stored any data to your brand-new
Grove, the save file is redundant. Feel free to delete it.

#### The data recorder

Speaking of storing data, how about we try to do that now?

Near the bottom-right corner of the Grove's case is a small,
unlabeled button that gives you access to the Data Recorder.
It's small and unlabeled because most users will never
touch it, unless they're software developers.

But *you're* not afraid of being a software developer,
right? Let's write a simple program to demonstrate just how
easy it is to program a Grove.

Click the button. The Data Recorder window will pop up.
In the narrow text field near the top, type `startup`.
In the bigger text field, type (or paste) the code below.
Either way, make sure to enter it exactly as shown.

```javascript
function main(event) {
if (event.type === 'startup') return 'Press any key.'
if (event.type === 'keyDown') return 'It worked.'
return null
}
```

When you're done, it should look like this:

![The Data Recorder with code entered in the startup record](./tutorial-data-recorder.png)

Click the "Save" button and close the window by clicking
the red `X` button at the top.

Now click the power button twice to turn the Grove off and
on again. You should see your program running—it will have
displayed "Press any key" on the screen. Press any key
and watch what happens.

### Software
#### Rune
#### Calculator
#### Timer
#### File Browser
## The Grove Operating System (Grove OS)
## Adding and removing applications
## Installing A Different Operating System
## Writing new applications
## Writing new operating systems
