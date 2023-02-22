# crusty-enums

## Why?

I was bored

## Functionality

This library adds a Rust-like enum. Compared to TypeScript's enums, which are rather limited to the value they can hold, and are static, these ones are much more dynamic.

## Examples

A Rust-like "Result"

```ts
import { makeEnum } from "crusty-enums"
import { z } from "zod"

const { Ok, Err } = makeEnum({
	Ok: z.any(),
	Err: z.any(),
})

function mightError() {
	if (Math.random() >= 0.5) {
		return Err("Bad luck!")
	}
	return Ok("It's succeeded!")
}

mightError() // => { value: "It's succeeded!", _enumSymbol: Symbol }
mightError() // => { value: "Bad luck!", _enumSymbol: Symbol }

Ok.is(mightError()) // => boolean
Err.is(mightError()) // => boolean
```
