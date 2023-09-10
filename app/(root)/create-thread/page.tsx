import PostThread from '@/components/forms/PostThread'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function CreateThread() {
	const user = await currentUser()
	if (!user) return

	const userInfo = await fetchUser(user.id)

	if (!userInfo?.onboarded) redirect('/onboarding')

	return (
		<>
			<h1 className='head-text'>CreateThread</h1>
			<PostThread userId={userInfo._id} />
		</>
	)
}
