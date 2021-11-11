import {
	OmitKeys,
	ExcludePropertyKeys,
	RemoveArray,
	FirelordUtils,
} from './firelordUtils'
import { FirelordFirestore } from './firelordFirestore'
import {
	QuerySnapshotCreator,
	querySnapshotCreator,
} from './querySnapshotCreator'
import { arrayChunk } from './utils'

// https://stackoverflow.com/questions/69724861/recursive-type-become-any-after-emit-declaration-need-implicit-solution

export type QueryCreator<
	T extends FirelordUtils.MetaType,
	PermanentlyOmittedKeys extends keyof QueryCreator<
		T,
		PermanentlyOmittedKeys,
		M,
		PermanentlyOmittedComparators,
		CompoundSameField
	> = never,
	M extends 'col' | 'colGroup' = 'col',
	PermanentlyOmittedComparators extends FirelordFirestore.WhereFilterOp = never,
	CompoundSameField extends string | false = false
> = {
	where: <
		P extends string & keyof T['read'],
		J extends FirelordFirestore.WhereFilterOp,
		Q extends ExcludePropertyKeys<T['compare'], unknown[]>
	>(
		fieldPath: P extends never
			? P
			: J extends '<' | '<=' | '>=' | '>'
			? CompoundSameField extends string
				? CompoundSameField
				: P
			: J extends 'not-in' | '!='
			? CompoundSameField extends string
				? CompoundSameField
				: P
			: P,
		opStr: J extends never
			? J
			: Exclude<
					T['compare'][P] extends unknown[]
						? 'array-contains' | 'in' | 'array-contains-any'
						: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
					PermanentlyOmittedComparators
			  >,
		value: J extends 'not-in' | 'in'
			? T['compare'][P][]
			: J extends 'array-contains'
			? RemoveArray<T['compare'][P]>
			: T['compare'][P],
		orderBy?: J extends '<' | '<=' | '>=' | '>' | '==' | 'in' | '!=' | 'not-in'
			? P extends ExcludePropertyKeys<T['compare'], unknown[]>
				? {
						fieldPath: Q extends never
							? Q
							: J extends '<' | '<=' | '>=' | '>'
							? Q extends P
								? ExcludePropertyKeys<T['compare'], unknown[]>
								: never
							: J extends '==' | 'in'
							? Q extends P
								? never
								: ExcludePropertyKeys<T['compare'], unknown[]>
							: J extends 'not-in' | '!='
							? ExcludePropertyKeys<T['compare'], unknown[]>
							: never
						directionStr?: FirelordFirestore.OrderByDirection
						cursor?: {
							clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
							fieldValue:
								| T['compare'][J extends 'not-in' | '!=' ? Q : P]
								| FirelordFirestore.DocumentSnapshot
						}
				  }
				: never
			: never
	) => J extends 'in' | 'array-contains-any'
		? OmitKeys<
				QueryCreator<
					T,
					PermanentlyOmittedKeys,
					M,
					| PermanentlyOmittedComparators
					| (J extends 'array-contains'
							? 'array-contains' | 'array-contains-any'
							: J extends 'in' | 'not-in' | 'array-contains-any'
							? 'in' | 'not-in' | 'array-contains-any'
							: never),
					J extends '<' | '<=' | '>=' | '>' | 'not-in' | '!='
						? P
						: CompoundSameField
				>,
				J extends '<' | '<=' | '>' | '>' | '==' | 'in'
					? 'orderBy' | PermanentlyOmittedKeys
					: PermanentlyOmittedKeys
		  >[]
		: OmitKeys<
				QueryCreator<
					T,
					PermanentlyOmittedKeys,
					M,
					| PermanentlyOmittedComparators
					| (J extends 'array-contains'
							? 'array-contains' | 'array-contains-any'
							: J extends 'in' | 'not-in' | 'array-contains-any'
							? 'in' | 'not-in' | 'array-contains-any'
							: never),
					J extends '<' | '<=' | '>=' | '>' | 'not-in' | '!='
						? P
						: CompoundSameField
				>,
				J extends '<' | '<=' | '>' | '>' | '==' | 'in'
					? 'orderBy' | PermanentlyOmittedKeys
					: PermanentlyOmittedKeys
		  >
	limit: (
		limit: number
	) => OmitKeys<
		QueryCreator<
			T,
			'limit' | 'limitToLast' | PermanentlyOmittedKeys,
			M,
			PermanentlyOmittedComparators,
			CompoundSameField
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	limitToLast: (
		limit: number
	) => OmitKeys<
		QueryCreator<
			T,
			'limit' | 'limitToLast' | PermanentlyOmittedKeys,
			M,
			PermanentlyOmittedComparators,
			CompoundSameField
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	orderBy: <P extends ExcludePropertyKeys<T['compare'], unknown[]>>(
		fieldPath: P,
		directionStr: FirelordFirestore.OrderByDirection,
		cursor?: {
			clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
			fieldValue: T['compare'][P] | FirelordFirestore.DocumentSnapshot
		}
	) => OmitKeys<
		QueryCreator<
			T,
			PermanentlyOmittedKeys,
			M,
			PermanentlyOmittedComparators,
			CompoundSameField
		>,
		PermanentlyOmittedKeys
	>
	onSnapshot: (
		onNext: (snapshot: QuerySnapshotCreator<T, M>) => void,
		onError?: (error: Error) => void
	) => () => void
	get: () => Promise<QuerySnapshotCreator<T, M>>
}

// https://github.com/microsoft/TypeScript/issues/43817#issuecomment-827746462
export const queryCreator: <
	T extends FirelordUtils.MetaType,
	PermanentlyOmittedKeys extends keyof QueryCreator<
		T,
		PermanentlyOmittedKeys,
		M,
		PermanentlyOmittedComparators,
		CompoundSameField
	> = never,
	M extends 'col' | 'colGroup' = 'col',
	PermanentlyOmittedComparators extends FirelordFirestore.WhereFilterOp = never,
	CompoundSameField extends string | false = false
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	query: FirelordFirestore.Query<T['read']>
) => QueryCreator<
	T,
	PermanentlyOmittedKeys,
	M,
	PermanentlyOmittedComparators,
	CompoundSameField
> = <
	T extends FirelordUtils.MetaType,
	PermanentlyOmittedKeys extends keyof QueryCreator<
		T,
		PermanentlyOmittedKeys,
		M,
		PermanentlyOmittedComparators,
		CompoundSameField
	> = never,
	M extends 'col' | 'colGroup' = 'col',
	PermanentlyOmittedComparators extends FirelordFirestore.WhereFilterOp = never,
	CompoundSameField extends string | false = false
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	query: FirelordFirestore.Query<T['read']>
) => {
	const orderByCreator =
		(query: FirelordFirestore.Query<T['read']>) =>
		<P extends ExcludePropertyKeys<T['compare'], unknown[]>>(
			fieldPath: P,
			directionStr: FirelordFirestore.OrderByDirection = 'asc',
			cursor?: {
				clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
				fieldValue: T['compare'][P] | FirelordFirestore.DocumentSnapshot
			}
		) => {
			const ref = query.orderBy(fieldPath, directionStr)

			return queryCreator<
				T,
				PermanentlyOmittedKeys,
				M,
				PermanentlyOmittedComparators,
				CompoundSameField
			>(firestore, colRef, cursor ? ref[cursor.clause](cursor.fieldValue) : ref)
		}

	const getAndOnSnapshotCreator = (
		not_In_Extra: {
			key: string
			elements: unknown[]
		} = { key: '', elements: [] }
	) => {
		return {
			onSnapshot: (
				onNext: (snapshot: QuerySnapshotCreator<T, M>) => void,
				onError?: (error: Error) => void
			) => {
				return query.onSnapshot(snapshot => {
					return onNext(
						querySnapshotCreator<T, M>(
							firestore,
							colRef,
							snapshot,
							not_In_Extra
						)
					)
				}, onError)
			},
			get: () => {
				return query.get().then(querySnapshot => {
					return querySnapshotCreator<T, M>(
						firestore,
						colRef,
						querySnapshot,
						not_In_Extra
					)
				})
			},
		}
	}

	return {
		where: (fieldPath, opStr, value, orderBy) => {
			const whereInnerCreator = (innerValue: typeof value) => {
				let adjustedValue: typeof innerValue = innerValue
				let not_In_Extra_Elements = [] as typeof innerValue

				if (opStr === 'in' || opStr === 'array-contains-any') {
					if (value.length === 0) {
						adjustedValue = [
							'This is a very long string to prevent collision: %$GE&^G^*(N Y(&*T^VR&%R&^TN&*^RMN$BEDF^R%TFG%I%TFDH%(UI<)(UKJ^HGFEC#DR^T*&#$%(<RGFESAXSCVBGNHM(&%T^BTNRV%ITB^TJNTN^T^*T',
						] as typeof value
					}
				} else if (opStr === 'not-in') {
					if (value.length === 0) {
						adjustedValue = [
							'This is a very long string to prevent collision: %$GE&^G^*(N Y(&*T^VR&%R&^TN&*^RMN$BEDF^R%TFG%I%TFDH%(UI<)(UKJ^HGFEC#DR^T*&#$%(<RGFESAXSCVBGNHM(&%T^BTNRV%ITB^TJNTN^T^*T',
						] as typeof value
					}
					adjustedValue = innerValue.slice(0, 10)
					not_In_Extra_Elements = innerValue.slice(10)
				}

				const ref = query.where(fieldPath, opStr, adjustedValue)

				const queryRef = queryCreator<
					T,
					PermanentlyOmittedKeys,
					M,
					PermanentlyOmittedComparators,
					CompoundSameField
				>(firestore, colRef, ref)

				const finalRef = orderBy
					? orderByCreator(ref)(
							orderBy.fieldPath,
							orderBy.directionStr,
							orderBy.cursor
					  )
					: queryRef

				return {
					...finalRef,
					...(opStr === 'not-in'
						? getAndOnSnapshotCreator({
								key: fieldPath,
								elements: not_In_Extra_Elements as unknown[],
						  })
						: {}),
				}
			}
			const fun = () => {
				if (opStr === 'in' || opStr === 'array-contains-any') {
					let adjustedValue: typeof value = value
					if (value.length === 0) {
						adjustedValue = [
							'This is a very long string to prevent collision: %$GE&^G^*(N Y(&*T^VR&%R&^TN&*^RMN$BEDF^R%TFG%I%TFDH%(UI<)(UKJ^HGFEC#DR^T*&#$%(<RGFESAXSCVBGNHM(&%T^BTNRV%ITB^TJNTN^T^*T',
						] as typeof value
					}
					const valueChunks = arrayChunk(
						adjustedValue as unknown[],
						10
					) as typeof value[]
					return valueChunks.map(arr => {
						return whereInnerCreator(arr)
					})
				} else {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return whereInnerCreator(value) as any // ! why this need `any`
				}
			}
			return fun()
		},
		limit: (limit: number) => {
			return queryCreator<
				T,
				'limit' | 'limitToLast' | PermanentlyOmittedKeys,
				M,
				PermanentlyOmittedComparators,
				CompoundSameField
			>(firestore, colRef, query.limit(limit)) as OmitKeys<
				QueryCreator<
					T,
					'limit' | 'limitToLast' | PermanentlyOmittedKeys,
					M,
					PermanentlyOmittedComparators,
					CompoundSameField
				>,
				'limit' | 'limitToLast' | PermanentlyOmittedKeys
			>
		},
		limitToLast: (limit: number) => {
			return queryCreator<
				T,
				'limit' | 'limitToLast' | PermanentlyOmittedKeys,
				M,
				PermanentlyOmittedComparators,
				CompoundSameField
			>(firestore, colRef, query.limitToLast(limit))
		},
		orderBy: orderByCreator(query),
		...getAndOnSnapshotCreator(),
	}
}
