import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import ThreadCard from '../cards/ThreadCard'
import { fetchCommunityPosts } from '@/lib/actions/community.actions'

type Props = {
	currentUserId: string
	accountId: string
	accountType: string
}

export default async function ThreadsTab({
	currentUserId,
	accountId,
	accountType
}: Props) {
	const result =
		accountType === 'User'
			? await fetchUserPosts(accountId)
			: await fetchCommunityPosts(accountId)

	if (!result) redirect('/')

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{result.threads.map((thread: any) => (
				<ThreadCard
					key={thread?._id}
					id={thread?._id}
					currentUserId={currentUserId}
					parentId={thread.parentId}
					content={thread.content}
					author={
						accountType === 'User'
							? { name: result.name, image: result.image, id: result.id }
							: {
									name: thread.author.name,
									image: thread.author.image,
									id: thread.author.id
							  }
					}
					community={thread.community}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			))}
		</section>
	)
}
