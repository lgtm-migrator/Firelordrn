<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->

# firelordrn(BETA, React Native)

<p align="center">
 <a href="https://github.com/tylim88/Firelord/blob/main/img/ozai.png" rel="nofollow"><img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px" align="center" /></a>
  <h1 align="center">Firelordrn</h1>
</p>

<p align="center">
 <a href="https://www.npmjs.com/package/firelordrn" rel="nofollow"><img src="https://img.shields.io/npm/v/firelordrn" alt="Created by tylim88"></a>
 <a href="https://github.com/tylim88/firelordrn/blob/main/LICENSE" rel="nofollow"><img src="https://img.shields.io/github/license/tylim88/firelordrn" alt="License"></a>
 <a href="https://github.com/tylim88/firelordrn/pulls" rel="nofollow"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"></a>
</p>

🐤 Write truly scalable Firestore code with complete deep typing Firestore wrapper.

💪🏻 Type object, array, any combination of array and object, regardless of the nesting level.

🚀 The wrapper type all read and write operations, query field path, field value, collection path, document path.

🥙 All `Snapshot`(response) are recursively typed, no more type casting.

🔥 Convert all value types to corresponding `read` types, `write` types and `compare` types (good at handling timestamp and field values).

💥 Safe typing with masked Firestore Field Value(serverTimestamp, arrayRemove, arrayUnion and increment) types.

🌈 Strictly one-time setup per document. Once configured, you are ready. No more confusing setup in the future, simplicity at its finest.

🍡 Prevent empty array from hitting `in`, `not-in`, `array-contains-any`, `arrayUnion` and `arrayRemove`, peace in mind.

🍧 Use `in`, `not-in` and `array-contains-any` with more than 10 elements array. (`not-in` has a caveat)

🍁 `write` operations reject unknown member and enforce partial but no undefined.

🍹 Avoid `order` and `query` limitations for you, stopping potential run-time errors before they happen.

✨ API closely resembles Firestore API, low learning curve.

🦊 Zero dependencies.

⛲️ Out of box typescript support.

Variants:

1. [nodejs](https://www.npmjs.com/package/firelord)
2. [js](https://www.npmjs.com/package/firelordjs)

## 🦙 Usage

This is a wrapper for [react-native-firebase](https://www.npmjs.com/package/react-native-firebase)

work exactly like [firelord](https://github.com/tylim88/Firelord)<-- read the doc here

there are few differences:

1. any kind of `create` operations is not available, you can only create a document using `set` or `add`
2. no `offset`
3. more parameters for `get` and `onSnapshot`

instead of

```ts
// from firelord doc
// don't do this
import { firelord } from 'firelord'
import { firestore } from 'firebase-admin'

// create wrapper
const {
	fieldValue: { increment, arrayUnion, arrayRemove, serverTimestamp },
	wrapper,
} = firelord(firestore)
```

do

```ts
// do this
import { firelord } from 'firelordrn'
import firestore from '@react-native-firebase/firestore'

// create wrapper
const {
	fieldValue: { increment, arrayUnion, arrayRemove, serverTimestamp },
	wrapper,
} = firelord(firestore)
```

get and onSnapshot

```ts
// import user

// options?:{source: 'default' | 'server' |  'cache'}
user.get(options)
user.where('age', '==', 20).get(options)

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
