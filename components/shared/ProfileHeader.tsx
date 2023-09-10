import Image from 'next/image'

type Props = {
	accountId: string
	authUserId: string
	name: string
	username: string
	imageUrl: string
	bio: string
}

export default function ProfileHeader({
	accountId,
	authUserId,
	name,
	username,
	imageUrl,
	bio
}: Props) {
	return (
		<header className='flex w-full flex-col justify-start'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Image
						src={imageUrl}
						alt={`${name}'s profile`}
						width={80}
						height={80}
						className='rounded-full object-cover shadow-2xl'
					/>
					<div className='flex-1'>
						<h1 className='text-left text-heading3-bold text-light-1'>
							{name}
						</h1>
						<p className='text-base-medium text-gray-1'>@{username}</p>
					</div>
				</div>
			</div>
			{/* TODO: Community */}
			<p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

			<div className='mt-12 h-0.5 w-full bg-dark-3' />
		</header>
	)
}
