import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type Props = {
	params: {
		id: string
	}
}

export default async function ThreadDetails({ params: { id } }: Props) {
	if (!id) return

	const user = await currentUser()
	if (!user) return

	const userInfo = await fetchUser(user?.id)
	if (!userInfo?.onboarded) redirect('/onboarding')

	const thread = await fetchThreadById(id)

	return (
		<section className='relative'>
			<div>
				<ThreadCard
					id={id}
					currentUserId={user?.id}
					parentId={thread.parentId}
					content={thread.content}
					author={thread.author}
					community={thread.community}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			</div>
			<div className='mt-7'>
				<Comment
					threadId={thread._id}
					currentUserImg={userInfo.image}
					currentUserId={JSON.stringify(userInfo._id)}
				/>
			</div>
			<div className='mt-10'>
				{thread.children.map((comment: any) => (
					<ThreadCard
						key={comment._id}
						id={comment._id}
						currentUserId={user?.id}
						parentId={comment.parentId}
						content={comment.content}
						author={comment.author}
						community={comment.community}
						createdAt={comment.createdAt}
						comments={comment.children}
						isComment
					/>
				))}
			</div>
		</section>
	)
}
