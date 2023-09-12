import Image from 'next/image'
import Link from 'next/link'
import { threadIcons } from '@/constants'
import { formatDateString } from '@/lib/utils'

type Props = {
	id: string
	currentUserId: string
	parentId: string | null
	content: string
	author: {
		name: string
		image: string
		id: string
	}
	community: {
		id: string
		name: string
		image: string
	} | null
	createdAt: string
	comments: {
		author: {
			image: string
		}
	}[]
	isComment?: boolean
}

// TODO: Impement like, share and repost feature

export default function ThreadCard({
	id,
	currentUserId,
	parentId,
	content,
	author,
	community,
	createdAt,
	comments,
	isComment = false
}: Props) {
	return (
		<article
			className={`flex w-full flex-col rounded-xl ${
				isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
			}`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 flex-row gap-4'>
					<div className='flex flex-col items-center'>
						<Link
							href={`/profile/${author?.id}`}
							className='relative h-11 w-11'
						>
							<Image
								src={author?.image}
								alt={author?.name}
								width={44}
								height={44}
								className='rounded-full object-cover h-11 w-11'
							/>
						</Link>
						<div className='thread-card_bar' />
					</div>
					<div className='flex w-full flex-col'>
						<Link
							href={`/profile/${author?.id}`}
							className='w-fit'
						>
							<p className='text-base-semibold text-light-1'>{author?.name}</p>
						</Link>
						<p className='mt-2 text-small-regular text-light-2'>{content}</p>
						<div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
							<div className='flex gap-3.5'>
								{threadIcons.map(icon => (
									<Link href={`/thread/${id}`}>
										<Image
											src={icon.path}
											alt={icon.alt}
											width={24}
											height={24}
											className='object-contain'
										/>
									</Link>
								))}
							</div>

							{isComment && !!comments?.length && (
								<Link href={`/thread/${id}`}>
									<p className='mt-1 text-subtle-medium text-gray-1'>
										{comments.length} replies
									</p>
								</Link>
							)}
						</div>
					</div>
				</div>
				{/* TODO: Delete thread */}
				{/* TODO: Show comment logos */}
			</div>
			{!isComment && community && (
				<Link
					href={`/communities/${community.id}`}
					className='mt-5 flex items-center'
				>
					<p className='text-subtle-medium text-gray-1'>
						{formatDateString(createdAt)} • {community.name}
					</p>
					<Image
						src={community.image}
						alt={community.name}
						width={14}
						height={14}
						className='ml-1 rounded-full object-cover'
					/>
				</Link>
			)}
		</article>
	)
}
