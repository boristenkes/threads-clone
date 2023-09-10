import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Activity() {
	const user = await currentUser()
	if (!user) return

	const userInfo = await fetchUser(user.id)
	if (!userInfo?.onboarded) redirect('/onboarding')

	const activity = await getActivity(userInfo?._id)

	return (
		<section>
			<h1 className='text-light-1'>Activity</h1>
			<section className='mt-10 flex flex-col gap-5'>
				{activity.length ? (
					<>
						{activity.map(notification => (
							<Link
								key={notification._id}
								href={`/thread/${notification._id}`}
							>
								<article className='activity-card'>
									<Link href={`/profile/${notification.author._id}`}>
										<Image
											src={notification.author.image}
											alt={`${notification.author.name}'s profile`}
											width={20}
											height={20}
											className='rounded-full object-cover'
										/>
									</Link>
									<p className='!text-small-regular text-light-1'>
										<Link
											className='mr-1 text-primary-500'
											href={`/profile/${notification.author._id}`}
										>
											{notification.author.name}
										</Link>
										replied to your thread
									</p>
								</article>
							</Link>
						))}
					</>
				) : (
					<p className='no-result'>No activity to display</p>
				)}
			</section>
		</section>
	)
}
