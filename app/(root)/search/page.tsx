import UserCard from '@/components/cards/UserCard'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Search() {
	const user = await currentUser()
	if (!user) return

	const userInfo = await fetchUser(user.id)
	if (!userInfo?.onboarded) redirect('/onboarding')

	const { searchResults, isThereNextPage } = await fetchUsers({
		userId: user.id,
		searchString: '',
		pageNumber: 1,
		pageSize: 25
	})

	return (
		<section>
			<h1 className='head-text mb-10'>Search</h1>

			{/* SearchBar */}

			<div className='mt-14 flex flex-col gap-9'>
				{!searchResults.length ? (
					<p className='no-result'>Search something...</p>
				) : (
					<>
						{searchResults.map(user => (
							<UserCard
								key={user.id}
								id={user.id}
								name={user.name}
								username={user.username}
								imageUrl={user.image}
								userType='User'
							/>
						))}
					</>
				)}
			</div>
		</section>
	)
}
