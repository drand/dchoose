# dchoose

Choose an item from a file or input stream using drand


## Installation
`npm install -g dchoose`

## Usage
Select some random entries from a file:

`cat /some/path/to/file | dchoose --count 2`

Or alternatively:

`dchoose --count 2 --file /some/path/to/file`

Flip a coin:

`echo -e "heads\ntails" | dchoose`

## Parameters
* `-c, --count`
 
The number of items to select from the input. Default is 1.
 
* `-u, --drand-url`

The drand URL to use. The default is `quicknet` (i.e. `https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971`)

* `-f, --file`

The file to select items from. Each line is considered an entry. Alternatively, you can pass a file via stdin by using e.g. `cat`

* `-r, --randomness`

Custom randomness with which to draw from instead of using the next drand round. 
Must be in hex format. 
This can be useful for verifying past draws or repeatability.

* `-v, --verbose`

A verbose output format for when you want to know a little more about the draw, or want to repeat it.

The output format (prettified) looks something like:
```
{
  "time": 1699439820012,
  "round": 123456,
  "randomness": "f73220684f2a171ffb00ec3b21983e01738bc863e26f374b0a76081416eebda8",
  "totalCount": 2,
  "winners": ["heads"]
}
```