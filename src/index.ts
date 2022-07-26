import getFirestore from '@react-native-firebase/firestore'
import {
	MetaType,
	IsValidID,
	GetNumberOfSlash,
	ErrorNumberOfForwardSlashIsNotEqual,
	DocumentReference,
	CollectionReference,
	Query,
	FirestoreAndFirestoreTesting,
} from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'

/**
 Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 
 @param firestore 
 Optional. A reference to the Firestore database. If no value is provided, default Firestore instance is used.
 
 @param path 
 A slash-separated full path to a collection.
 
 @returns 
 DocumentReference, CollectionReference and CollectionGroupReference instance.
 */
export const getFirelord =
	<T extends MetaType>(firestore?: FirestoreAndFirestoreTesting) =>
	<CollectionPath extends T['collectionPath'] = T['collectionPath']>(
		collectionPath: CollectionPath extends never
			? CollectionPath
			: GetNumberOfSlash<CollectionPath> extends GetNumberOfSlash<
					T['collectionPath']
			  >
			? IsValidID<CollectionPath, 'Collection', 'Path'>
			: ErrorNumberOfForwardSlashIsNotEqual<
					GetNumberOfSlash<T['collectionPath']>,
					GetNumberOfSlash<CollectionPath>
			  >
	): FirelordRef<T> => {
		const fStore = firestore || getFirestore()
		const doc = docCreator<T>(fStore, collectionPath)
		const collection = collectionCreator<T>(fStore, collectionPath)
		const collectionGroup = collectionGroupCreator<T>(
			fStore,
			collectionPath.split('/').pop() as string
		)
		return Object.freeze({
			doc,
			collection,
			collectionGroup,
		})
	}

export type FirelordRef<T extends MetaType> = Readonly<{
	doc: {
		<DocumentId extends T['docID']>(
			documentID: DocumentId extends never
				? DocumentId
				: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
				? T['docID']
				: IsValidID<DocumentId, 'Document', 'ID'>
		): DocumentReference<T>
		<DocumentId extends T['docID']>(
			firestore: FirestoreAndFirestoreTesting,
			documentID: DocumentId extends never
				? DocumentId
				: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
				? T['docID']
				: IsValidID<DocumentId, 'Document', 'ID'>
		): DocumentReference<T>
	}
	collection: (
		firestore?: FirestoreAndFirestoreTesting
	) => CollectionReference<T>
	collectionGroup: (firestore?: FirestoreAndFirestoreTesting) => Query<T>
}>

export * from './batch'
export * from './transaction'
export * from './fieldValue'
export * from './fieldPath'
export * from './onSnapshot'
export * from './operations'
export * from './queryClauses'
export { query } from './refs'
export * from './equal'

export type {
	MetaType,
	MetaTypeCreator,
	ServerTimestamp,
	DeleteField,
	PossiblyReadAsUndefined,
	DocumentReference,
	CollectionReference,
	Query as Query,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from './types'
