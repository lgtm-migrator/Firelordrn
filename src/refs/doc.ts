import {
	MetaType,
	DocumentReference,
	FirestoreAndFirestoreTesting,
	IsValidID,
} from '../types'
import { isFirestore } from '../utils'

// tested with update
export const docCreator =
	<T extends MetaType>(
		fStore: FirestoreAndFirestoreTesting,
		collectionPath: T['collectionPath']
	): Doc<T> => // @ts-expect-error
	(firestore, documentId) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docId = isFirestore(firestore) ? documentId : firestore
		return fs.doc(
			collectionPath + '/' + docId
		) as unknown as DocumentReference<T>
	}

type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param path - A slash-separated path to a document.
	 * @throws If the final path has an odd number of segments and does not point to
	 * a document.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
			? T['docID']
			: IsValidID<DocumentId, 'Document', 'ID'>
	): DocumentReference<T>
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param firestore - A reference to the root `Firestore` instance.
	 * @param path - A slash-separated path to a document.
	 * @throws If the final path has an odd number of segments and does not point to
	 * a document.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		firestore: FirestoreAndFirestoreTesting,
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
			? T['docID']
			: IsValidID<DocumentId, 'Document', 'ID'>
	): DocumentReference<T>
}
