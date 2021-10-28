import {
	OmitKeys,
	PartialNoImplicitUndefinedAndNoExtraMember,
	ExcludePropertyKeys,
	Firelord,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { queryCreator } from './queryCreator'
import { firelord as fl } from './index_'

export const firelord: fl =
	(firestore: FirelordFirestore.Firestore) =>
	<
		T extends {
			colPath: string
			docPath: string
			colGroupPath: string
			read: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedRead
			write: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedWrite
			writeNested: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedWrite
			compare: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedCompare
			base: FirelordFirestore.DocumentData
		} = never
	>() => {
		type Write = OmitKeys<T['write'], 'updatedAt' | 'createdAt'>
		type WriteNested = OmitKeys<T['writeNested'], 'updatedAt' | 'createdAt'>
		type Read = T['read']
		type Compare = T['compare']
		type WithoutArrayTypeMember = ExcludePropertyKeys<Compare, unknown[]>
		const time = firestore.FieldValue.serverTimestamp()

		const newTime = {
			createdAt: time,
			updatedAt: new Date(0),
		}

		const col = (collectionPath: T['colPath']) => {
			const colRefWrite = firestore().collection(
				collectionPath
			) as FirelordFirestore.CollectionReference<Write>
			const colRefRead =
				colRefWrite as FirelordFirestore.CollectionReference<Read>

			const doc = (documentPath: T['docPath']) => {
				const docWrite = colRefWrite.doc(documentPath)

				const docRead = colRefRead.doc(documentPath)

				const transactionCreator = (
					transaction: FirelordFirestore.Transaction
				) => {
					return {
						set: <
							J extends Partial<WriteNested>,
							Z extends { merge?: true; mergeField?: (keyof Write)[] }
						>(
							data: J extends never
								? J
								: Z extends undefined
								? WriteNested
								: Z['merge'] extends true
								? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
								: Z['mergeField'] extends (keyof Write)[]
								? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
								: WriteNested,
							options?: Z
						) => {
							if (options) {
								return transaction.set(
									docWrite,
									{
										updatedAt: time,
										...data,
									},
									options
								)
							} else {
								return transaction.set(docWrite, {
									...newTime,
									...data,
								})
							}
						},
						update: <J extends Partial<Write>>(
							data: J extends never
								? J
								: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
						) => {
							return transaction.update(docWrite, {
								updatedAt: time,
								...(data as Partial<Write>), // !
							})
						},
						delete: () => {
							return transaction.delete(docWrite)
						},
						get: () => {
							return transaction.get(docRead)
						},
					}
				}

				return {
					firestore: docRead.firestore,
					id: docRead.id,
					parent: docRead.parent,
					path: docRead.path,
					isEqual: (
						other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
					) => {
						return docRead.isEqual(
							other as FirelordFirestore.DocumentReference<Read>
						)
					},
					onSnapshot: (
						observer: {
							next?: (
								snapshot: FirelordFirestore.DocumentSnapshot<Read>
							) => void
							error?: (error: Error) => void
						},
						options?: FirelordFirestore.SnapshotListenOptions
					) => {
						return docRead.onSnapshot(
							options || { includeMetadataChanges: false },
							{
								next: snapshot => {
									return observer.next && observer.next(snapshot)
								},
								error: err => {
									return observer.error && observer.error(err)
								},
							}
						)
					},
					set: <
						J extends Partial<WriteNested>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? WriteNested
							: Z['merge'] extends true
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: WriteNested,
						options?: Z
					) => {
						if (options) {
							return docWrite.set(
								{
									updatedAt: time,
									...data,
								},
								options
							)
						} else {
							return docWrite.set({
								...newTime,
								...data,
							})
						}
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return docWrite.update({
							updatedAt: time,
							...(data as Partial<Write>), // !
						})
					},
					get: (options?: FirelordFirestore.GetOptions) => {
						return docRead.get(options)
					},
					delete: () => docWrite.delete(),
					batch: (batch: FirelordFirestore.WriteBatch) => {
						return {
							commit: () => {
								return batch.commit()
							},
							delete: () => {
								return batch.delete(docWrite)
							},
							update: <J extends Partial<Write>>(
								data: J extends never
									? J
									: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
							) => {
								return batch.update(docWrite, {
									updatedAt: time,
									...(data as Partial<Write>), // !
								})
							},
						}
					},
					runTransaction: (
						callback: (
							transaction: ReturnType<typeof transactionCreator>
						) => Promise<unknown>
					) => {
						firestore().runTransaction(async transaction => {
							return callback(transactionCreator(transaction))
						})
					},
				}
			}

			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				doc,
				add: (data: WriteNested) => {
					return colRefWrite.add({
						...newTime,
						...data,
					})
				},
				...queryCreator<Read, Compare, WithoutArrayTypeMember>(colRefRead),
			}
		}

		const colGroup = (collectionPath: T['colGroupPath']) => {
			const colRefRead = firestore().collectionGroup(
				collectionPath
			) as FirelordFirestore.CollectionGroup<Read>
			return queryCreator<Read, Compare, WithoutArrayTypeMember>(colRefRead)
		}

		return {
			col,
			colGroup,
			fieldValue: {
				increment: (value: number) => {
					return firestore.FieldValue.increment(
						value
					) as unknown as Firelord.NumberMasked
				},

				serverTimestamp: () => {
					return firestore.FieldValue.serverTimestamp() as unknown as Firelord.ServerTimestampMasked
				},
				arrayUnion: <T>(...values: T[]) => {
					return firestore.FieldValue.arrayUnion(
						...values
					) as unknown as Firelord.ArrayMasked<T>
				},
				arrayRemove: <T>(...values: T[]) => {
					return firestore.FieldValue.arrayRemove(
						...values
					) as unknown as Firelord.ArrayMasked<T>
				},
			},
		}
	}

export const ozai = firelord

export { flatten } from './flat'

export type { Firelord } from './firelord'
