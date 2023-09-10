'use client'

import { sidebarLinks } from '@/constants'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Bottombar() {
	const pathname = usePathname()
	const { userId } = useAuth()

	return (
		<section className='bottombar'>
			<ul className='bottombar_container'>
				{sidebarLinks.map(link => (
					<li key={link.route}>
						<Link
							href={
								link.route === '/profile'
									? `${link.route}/${userId}`
									: link.route
							}
							className={`bottombar_link ${
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
							<span className='text-subtle-medium text-light-1 max-sm:hidden'>
								{link.label.split(' ')[0]}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
