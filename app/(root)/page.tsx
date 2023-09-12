import ThreadCard from '@/components/cards/ThreadCard'
import { fetchPosts } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Home() {
	const user = await currentUser()
	if (!user) redirect('/sign-in')

	const userInfo = await fetchUser(user.id)
	if (!userInfo?.onboarded) redirect('/onboarding')

	const { threads, isThereNextPage } = await fetchPosts(1, 30)

	return (
		<section className='flex flex-col gap-10'>
			<h1 className='head-text text-left'>Home</h1>
			{!threads?.length ? (
				<p className='no-result'>No threads to display</p>
			) : (
				threads.map((thread: any) => (
					<ThreadCard
						key={thread._id}
						id={thread._id}
						currentUserId={user?.id}
						parentId={thread.parentId}
						content={thread.content}
						author={thread.author}
						community={thread.community}
						createdAt={thread.createdAt}
						comments={thread.children}
					/>
				))
			)}
		</section>
	)
}
