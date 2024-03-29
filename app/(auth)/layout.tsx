import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import '../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Threads',
	description: 'A Next.js 13 Meta Threads Application'
}

const inter = Inter({ subsets: ['latin'] })

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={`${inter.className} bg-dark-1`}>
					<div className='w-full flex justify-center items-center min-h-screen'>
						{children}
					</div>
				</body>
			</html>
		</ClerkProvider>
	)
}
