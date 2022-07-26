import {
	MetaType,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
	OriQuery,
	IsEqual,
} from '../types'
import { handleEmptyArray } from './utils'

/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export const query = <
	T extends MetaType,
	Q extends Query<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never
		? Q
		: IsEqual<Q, Query<T>> extends true
		? Query<T>
		: IsEqual<Q, CollectionReference<T>> extends true
		? CollectionReference<T>
		: never, // has to code this way to infer T perfectly
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QC,
				[],
				QC
		  >
) => {
	const ref = query as unknown as OriQuery<T>
	// ! need revisit
	// @ts-expect-error
	return queryConstraints.reduce((ref, qc) => {
		const type = qc.type
		if (type === 'where') {
			// @ts-expect-error
			return ref[type](qc.fieldPath, qc.opStr, qc.value)
		} else if (type === 'orderBy') {
			return ref[type](
				// @ts-expect-error
				qc.fieldPath,
				qc.directionStr
			)
		} else if (type === 'limit' || type === 'limitToLast') {
			return ref[type](qc.value)
		} else if (
			type === 'startAt' ||
			type === 'startAfter' ||
			type === 'endAt' ||
			type === 'endBefore'
		) {
			return handleEmptyArray(qc.values, ref, () => ref[type](...qc.values))
		}
	}, ref) as Query<T>
}
