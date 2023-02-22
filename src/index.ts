import type { z } from "zod"

interface EnumValue<T> {
	_enumSymbol: symbol
	value: T
}

interface StaticEnumValue<T> {
	is: (value: unknown) => value is EnumValue<T>

	(value: T): EnumValue<T>
}

type Mappings = Record<string, z.ZodTypeAny>

type MappingsToValues<T extends Mappings> = {
	[K in keyof T]: StaticEnumValue<
		T[K] extends z.ZodTypeAny ? z.output<T[K]> : T[K]
	>
}

export function makeEnum<T extends Mappings>(
	mappings: ReadonlyArray<keyof T>,
	opts?: { validate: false | undefined }
): MappingsToValues<T>
export function makeEnum<T extends Mappings>(
	mappings: T,
	opts: { validate: true }
): MappingsToValues<T>
export function makeEnum<T extends Mappings>(
	mappings: T | ReadonlyArray<keyof T>,
	{ validate }: { validate?: boolean } = {}
): MappingsToValues<T> {
	mappings = (Array.isArray(mappings)
		? mappings.reduce((acc, v) => ({ ...acc, [v]: undefined }), {})
		: mappings) as unknown as T
	const values = {} as MappingsToValues<T>

	for (const key of Object.keys(mappings)) {
		const symbol = Symbol(key)
		const validator = mappings[key]

		const fn = ((value) => {
			if (validate && validator) value = validator.parse(value)
			return { value, _enumSymbol: symbol }
		}) as StaticEnumValue<T>

		fn.is = (val): val is EnumValue<any> =>
			typeof val === "object" &&
			val !== null &&
			"_enumSymbol" in val &&
			val._enumSymbol === symbol

		values[key as keyof T] = fn as never
	}

	return values
}
