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
import { Input } from '../ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { Textarea } from '../ui/textarea'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'

type User = {
	id: string
	objectId: string
	username: string
	name: string
	bio: string
	image: string
}

type Props = {
	user: User
	btnTitle: string
}

export default function AccountProfile({ user, btnTitle }: Props) {
	const [files, setFiles] = useState<File[]>([])
	const { startUpload } = useUploadThing('media')
	const pathname = usePathname()
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			profile_photo: user?.image || '',
			name: user?.name || '',
			username: user?.username || '',
			bio: user?.bio || ''
		}
	})

	const handleImage = (
		e: ChangeEvent<HTMLInputElement>,
		fieldChange: (value: string) => void
	) => {
		const fileReader = new FileReader()

		if (!e.target.files?.length) return

		const file = e.target.files[0]
		setFiles(Array.from(e.target.files))

		if (!file.type.includes('image')) return

		fileReader.onload = async event => {
			const imageUrl = event.target?.result?.toString() || ''
			fieldChange(imageUrl)
		}

		fileReader.readAsDataURL(file)

		e.preventDefault()
	}

	const onSubmit = async (values: z.infer<typeof UserValidation>) => {
		const blob = values.profile_photo

		const hasImageChanged = isBase64Image(blob)

		if (hasImageChanged) {
			const imgRes = await startUpload(files)

			if (imgRes && imgRes[0].url) {
				values.profile_photo = imgRes[0].url
			}
		}

		await updateUser({
			userId: user.id,
			username: values.username,
			name: values.name,
			bio: values.bio,
			image: values.profile_photo,
			path: pathname
		})

		pathname === '/profile/edit' ? router.back() : router.push('/')
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-10'
			>
				<FormField
					control={form.control}
					name='profile_photo'
					render={({ field }) => (
						<FormItem className='flex items-center gap-4'>
							<FormLabel className='account-form_image-label'>
								<Image
									src={field.value || '/assets/profile.svg'}
									alt='Profile photo'
									width={field.value ? 96 : 24}
									height={field.value ? 96 : 24}
									className={`${
										field.value && 'rounded-full'
									} object-cover aspect-square`}
									priority={!!field.value}
								/>
							</FormLabel>
							<FormControl className='flex-1 text-base-semibold text-gray-200'>
								<Input
									type='file'
									accept='image/*'
									placeholder='Upload a photo'
									className='account-form_image-input'
									onChange={e => handleImage(e, field.onChange)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>
								Name
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>
								Username
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>
								Bio
							</FormLabel>
							<FormControl>
								<Textarea
									rows={10}
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='bg-primary-500'
				>
					{btnTitle}
				</Button>
			</form>
		</Form>
	)
}
