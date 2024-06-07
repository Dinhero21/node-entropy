function chance (probability: number): boolean {
  return Math.random() < probability
}

function getRandomItem<T> (array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomize<T> (something: T): T {
  try {
    if (something === null || something === undefined) return something

    if (something instanceof Object) {
      randomizeObject(something)

      return something
    }

    switch (typeof something) {
      case 'bigint':
        return randomizeBigInt(something) as T
      case 'boolean':
        return randomizeBoolean(something) as T
      case 'number':
        return randomizeNumber(something) as T
      case 'string':
        return randomizeString(something) as T
      case 'symbol':
        break
    }
  } catch {}

  return something
}

function randomizeObject<T extends object> (object: T): T {
  if (chance(0.1)) {
    const prototype = Object.getPrototypeOf(object)

    randomize(prototype)

    return object
  }

  const keys = Object.getOwnPropertyNames(object)
  const key = getRandomItem(keys)

  const descriptor = Object.getOwnPropertyDescriptor(object, key)

  if (descriptor === undefined) return object

  if (chance(0.1)) {
    randomizeObject(descriptor)
  } else {
    descriptor.value = randomize(descriptor.value)
  }

  try {
    Object.defineProperty(object, key, descriptor)
  } catch {}

  return object
}

function randomizeBigInt (bigInt: bigint): bigint {
  let delta = 0n

  if (chance(0.1)) {
    delta = chance(0.5) ? 1n : -1n
  }

  return bigInt + delta
}

function randomizeBoolean (boolean: boolean): boolean {
  return chance(0.1) ? !boolean : boolean
}

function randomizeNumber (number: number): number {
  return number + (Math.random() * 2 - 1) * 0.1
}

function randomizeString (string: string): string {
  if (!chance(0.1)) return string

  const chars = string.split('')
  const i = Math.floor(Math.random() * chars.length)

  chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + (chance(0.5) ? 1 : -1))

  return chars.join('')
}

const test = {
  a: 1,
  b: 2,
  c: 3
}

for (let i = 0; i < 10000; i++) {
  randomizeObject(test)
}

console.log(test)
