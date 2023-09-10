import ProfileHeader from '@/components/shared/ProfileHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { profileTabs } from '@/constants'
import Image from 'next/image'
import ThreadsTab from '@/components/shared/ThreadsTab'

type Props = {
	params: {
		id: string
	}
}

export default async function Profile({ params: { id } }: Props) {
	const user = await currentUser()
	if (!user) return

	const userInfo = await fetchUser(id)

	if (!userInfo?.onboarded) redirect('/onboarding')

	return (
		<section>
			<ProfileHeader
				accountId={id}
				authUserId={user.id}
				name={userInfo?.name}
				username={userInfo?.username}
				imageUrl={userInfo?.image}
				bio={userInfo?.bio}
			/>

			<div className='mt-9'>
				<Tabs
					defaultValue='threads'
					className='w-full'
				>
					<TabsList className='tab'>
						{profileTabs.map(tab => (
							<TabsTrigger
								key={tab.label}
								value={tab.value}
								className='tab'
							>
								<Image
									src={tab.icon}
									alt={tab.label}
									width={24}
									height={24}
								/>
								<p className='max-sm:hidden'>{tab.label}</p>
								{tab.value === 'threads' && (
									<span className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
										{userInfo?.threads.length}
									</span>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					{profileTabs.map((tab, index) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className='w-full text-light-1'
						>
							<ThreadsTab
								currentUserId={user.id}
								accountId={userInfo.id}
								accountType='User'
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	)
}
