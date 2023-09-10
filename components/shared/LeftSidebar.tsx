'use client'

import { sidebarLinks } from '@/constants'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function LeftSidebar() {
	const router = useRouter()
	const pathname = usePathname()
	const { userId } = useAuth()

	return (
		<aside className='custom-scrollbar leftsidebar'>
			<ul className='flex w-full flex-1 flex-col gap-6 px-6'>
				{sidebarLinks.map(link => (
					<li key={link.route}>
						<Link
							href={
								link.route === '/profile'
									? `${link.route}/${userId}`
									: link.route
							}
							className={`leftsidebar_link ${
								(pathname.includes(link.route) && link.route.length > 1) ||
								pathname === link.route
									? 'bg-primary-500'
									: ''
							}`}
						>
							<Image
								src={link.imgURL}
								alt={link.label}
								width={24}
								height={24}
							/>
							<span className='text-light-1 max-lg:hidden'>{link.label}</span>
						</Link>
					</li>
				))}
			</ul>

			<div className='mt-auto px-6'>
				<SignedIn>
					<SignOutButton signOutCallback={() => router.push('/sign-in')}>
						<button className='flex cursor-pointer gap-4 p-4'>
							<Image
								src='/assets/logout.svg'
								alt='Logout'
								width={24}
								height={24}
							/>
							<span className='text-light-2 max-lg:hidden'>Sign out</span>
						</button>
					</SignOutButton>
				</SignedIn>
			</div>
		</aside>
	)
}
