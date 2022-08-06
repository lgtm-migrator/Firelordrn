import { MetaType, DocumentReference, IsValidID, Firestore } from '../types'
import { isFirestore } from '../utils'

// tested with update
export const docCreator =
	<T extends MetaType>(
		fStore: Firestore,
		collectionPath: T['collectionPath']
	): Doc<T> => // @ts-expect-error
	(firestore, documentId) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docId = isFirestore(firestore) ? documentId : firestore
		return fs.doc(
			collectionPath + '/' + docId
		) as unknown as DocumentReference<T>
	}

export type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentId - A document ID. ID is not path, ID is the last segment of the path.
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
	 * @param documentId - A document ID. ID is not path, ID is the last segment of the path.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		firestore: Firestore,
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
			? T['docID']
			: IsValidID<DocumentId, 'Document', 'ID'>
	): DocumentReference<T>
}
