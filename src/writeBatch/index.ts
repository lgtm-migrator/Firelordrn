import { setCreator } from './set'
import { updateCreator } from './update'
import { deleteCreator } from './delete'
import { WriteBatch, Firestore } from '../types'
import getFirestore from '@react-native-firebase/firestore'

/**
Creates a write batch, used for performing multiple writes as a single atomic operation. The maximum number of writes allowed in a single WriteBatch is 500.

Unlike transactions, write batches are persisted offline and therefore are preferable when you don't need to condition your writes on read data.

@returns
A WriteBatch that can be used to atomically execute multiple writes.
 */
export const writeBatch = (firestore?: Firestore): WriteBatch => {
	const batch = (firestore || getFirestore()).batch()

	return Object.freeze({
		commit: () => batch.commit(),
		set: setCreator(batch),
		update: updateCreator(batch),
		delete: deleteCreator(batch),
	})
}
