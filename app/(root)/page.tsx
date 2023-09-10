import ThreadCard from '@/components/cards/ThreadCard'
import { fetchThreads } from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
	const { threads, isThereNextPage } = await fetchThreads(1, 30)
	const user = await currentUser()
	if (!user) return null

	return (
		<section className='flex flex-col gap-10'>
			<h1 className='head-text text-left'>Home</h1>
			{!threads?.length ? (
				<p className='no-result'>No threads to display</p>
			) : (
				<>
					{threads.map(thread => (
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
					))}
				</>
			)}
		</section>
	)
}
