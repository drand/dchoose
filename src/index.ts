import {program} from "commander"
import {main} from "./main"
import {parseParamsAndExit} from "./params"

// we parse the CLI flags, setting default count to 1 and default drand URL to quicknet
program
    .option("-c,--count <number>", "the number of items you wish to draw", "1")
    .option("-u,--drand-url <url>", "the URL you're using for drand randomness", "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971")

// including the arguments
program.parse(process.argv)

// we parse the params in a synchronous function so errors get output on the current tick
main(parseParamsAndExit(program.opts(), process.stdin.fd))
