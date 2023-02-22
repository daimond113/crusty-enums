import { z, ZodError } from "zod"
import { makeEnum } from "../src/index"
import { it, expect, describe } from "vitest"

describe("crusty-enums", () => {
	it("differentiates between 2 enums", () => {
		const { Ok, Err } = makeEnum(["Ok", "Err"] as const)

		expect(Err.is(Ok("yes"))).toBe(false)
		expect(Ok.is(Ok("yes"))).toBe(true)
	})

	it("validates properly", () => {
		const { Ok } = makeEnum(
			{
				Ok: z.string(),
			},
			{ validate: true }
		)

		expect(Ok.is(Ok("yes"))).toBe(true)
		/** @ts-expect-error */
		expect(() => Ok(123)).toThrowError(ZodError)
	})
})
