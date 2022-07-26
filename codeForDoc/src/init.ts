import { getFirelord } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'
import { getFirestore } from '@react-native-firebase/firestore'

initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###',
})

export const db = getFirestore()

const firelordExample = getFirelord<Example>(db)
// OR
const firelordExample_Alt = getFirelord<Example>()

export const example = firelordExample('SomeCollectionName')
