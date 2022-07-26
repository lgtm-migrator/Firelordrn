import { MetaType, Query, OriQuery } from '../types'
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export const queryEqual = (left: Query<MetaType>, right: Query<MetaType>) => {
	return (left as unknown as OriQuery).isEqual(right as unknown as OriQuery)
}
