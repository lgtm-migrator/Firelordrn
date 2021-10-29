<!-- markdownlint-disable MD010 -->

# firelordrn(BETA, react native only)

[![npm](https://img.shields.io/npm/v/firelordrn)](https://www.npmjs.com/package/firelordrn) [![GitHub](https://img.shields.io/github/license/tylim88/firelordrn)](https://github.com/tylim88/firelordrn/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelordrn/pulls)

🐤 Write truly scalable firestore code with complete deep typing firestore wrapper, no more typing hell in your firestore code.

💪🏻 handle object, array, array object, object array...and all kinds of type, regardless of the nesting level!

🚀 The wrapper type all read and write operations; query field path, field value, collection path, document path, type everything!

🔥 Automatically convert all value types to corresponding read types, write types and compare types (good at handling timestamp and field values).

✋🏻 Not only does it safeguard your types, but it also stops you from making any incorrect implementation(use the wrapper incorrectly).

💥 Even the seemly un-type-able Firestore Field Value(serverTimestamp, arrayRemove, arrayUnion and increment) is taken care of, EVERYTHING is typed, NO TYPE IS LEFT BEHIND!!

✨ API closely resembles firestore API, low learning curve.

🌈 Strictly one-time setup per document. Once configured, you are ready. No more confusing setup in the future, simplicity at its finest.

🐉 Zero dependencies.

⛲️ Out of box typescript support.

Variants:

1. [nodejs](https://www.npmjs.com/package/firelord)
2. [js](https://www.npmjs.com/package/firelordjs)

## 🦙 Usage

This is a wrapper for [react-native-firebase](https://www.npmjs.com/package/react-native-firebase)

work exactly like [firelord](https://github.com/tylim88/Firelord)(doc), except that:

1. any kind of `create` operations is not available, you can only create a document using `set` or `add`
2. no `offset`
3. more parameters for `get` and `onSnapshot`

instead of

```ts
// from firelord doc
// don't do this
import { firelord, Firelord } from 'firelord'
import { firestore } from 'firebase-admin'

// create wrapper
const wrapper = firelord(firestore)
```

do

```ts
// do this
import { firelord, Firelord } from 'firelordrn'
import firestore from '@react-native-firebase/firestore'

// create wrapper
const wrapper = firelord(firestore)
```

get and onSnapshot

```ts
// import user

// options?:{source: 'default' | 'server' |  'cache'}
user.get(options)

// observer: {
// 	next?: (
// 		snapshot: FirelordFirestore.DocumentSnapshot<Read>
// 	) => void
// 	error?: (error: Error) => void
// },
// options?: { includeMetadataChanges: false }
user.onSnapshot(observer, options)
```

no surprise here, everything is similar to firestore api

the rest is exactly the same as [firelord](https://github.com/tylim88/Firelord)
