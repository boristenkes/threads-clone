'use client'

import { useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { usePathname, useRouter } from 'next/navigation'
import { CommentValidation } from '@/lib/validations/thread'
import { Button } from '../ui/button'
// import { createThread } from '@/lib/actions/thread.actions'
import * as z from 'zod'
import Image from 'next/image'
import { addCommentToThread } from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs'

type Props = {
	threadId: string
	currentUserImg: string
	currentUserId: string
}

export default function Comment({
	threadId,
	currentUserImg,
	currentUserId
}: Props) {
	const pathname = usePathname()
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: ''
		}
	})

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToThread({
			threadId,
			content: values.thread,
			userId: currentUserId,
			path: pathname
		})

		form.reset()
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='comment-form'
			>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex items-center w-full gap-3'>
							<FormLabel>
								<Image
									src={currentUserImg}
									alt='Profile image'
									width={48}
									height={48}
									className='rounded-full object-cover'
								/>
							</FormLabel>
							<FormControl className='border-none bg-transparent'>
								<Input
									type='text'
									placeholder='Comment...'
									className='no-focus text-light-1 outline-none'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='comment-form_btn'
				>
					Reply
				</Button>
			</form>
		</Form>
	)
}
