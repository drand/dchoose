import {describe, it, expect} from "@jest/globals"
import {parseParams} from "../src/params"
import fs, {writeFileSync} from "fs"

describe("param parsing", () => {
    it("should fail if the count is a string", () => {
        const opts = {
            count: "banana"
        }
        const result = parseParams(opts, process.stdin.fd)
        expect(result).toEqual("count must be a non-negative number")
    })
    it("should fail if the count is less than 0", () => {
        const opts = {
            count: "-5"
        }
        const result = parseParams(opts, process.stdin.fd)
        expect(result).toEqual("count must be a non-negative number")
    })
    it("should fail if the drand URL is missing", () => {
        const opts = {
            count: "1",
        }
        const result = parseParams(opts, process.stdin.fd)
        expect(result).toEqual("drand URL was not a valid URL")
    })
    it("should fail if the drand URL is a number", () => {
        const opts = {
            count: "1",
            drandUrl: "55555"
        }
        const result = parseParams(opts, process.stdin.fd)
        expect(result).toEqual("drand URL was not a valid URL")
    })
    it("should fail if the drand URL is an invalid URL", () => {
        const opts = {
            count: "1",
            drandUrl: "somefakeurl"
        }
        const result = parseParams(opts, process.stdin.fd)
        expect(result).toEqual("drand URL was not a valid URL")
    })
    it("should succeed if all the params are valid", () => {
        const opts = {
            count: "1",
            drandUrl: "https://example.org"
        }

        const path = "/tmp/blah"
        writeFileSync("/tmp/blah", "a\nb\nc\n")

        const result = parseParams(opts, path)

        fs.rmSync(path)

        expect(result).toEqual({
            count: 1,
            drandURL: "https://example.org",
            values: ["a", "b", "c"]
        })
    })
})