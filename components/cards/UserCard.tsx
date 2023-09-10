import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

type Props = {
	id: string
	name: string
	username: string
	imageUrl: string
	userType: string
}

export default function UserCard({
	id,
	name,
	username,
	imageUrl,
	userType
}: Props) {
	return (
		<article className='user-card'>
			<Link
				href={`/profile/${id}`}
				className='user-card_avatar'
			>
				<Image
					src={imageUrl}
					alt={`${name}'s profile`}
					width={48}
					height={48}
					className='rounded-full object-cover'
				/>
				<div className='flex-1 text-ellipsis'>
					<h2 className='text-base-semibold text-light-1'>{name}</h2>
					<p className='text-small-medium text-gray-1'>@{username}</p>
				</div>
			</Link>
		</article>
	)
}
