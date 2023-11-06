# dchoose

Choose an item from a file or input stream using drand


## Installation
`npm install -g dchoose`

## Usage
`cat /some/path/to/file | dchoose --count 2`

## Parameters
* `-c, --count`
 
the number of items to select from the input. Default is 1.
 
* `-u, --drand-url`

the drand URL to use. The default is `quicknet` (i.e. `https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971`)