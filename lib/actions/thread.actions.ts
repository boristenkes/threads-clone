'use server'

import connectToDB from '../mongoose'
import Thread from '../models/thread.model'
import User from '../models/user.model'
import { revalidatePath } from 'next/cache'

type CreateThreadParams = {
	content: string
	author: string
	communityId: string | null
	path: string
}

type CommentToThreadParams = {
	threadId: string
	content: string
	userId: string
	path: string
}

export async function createThread({
	content,
	author,
	communityId,
	path
}: CreateThreadParams) {
	try {
		connectToDB()

		const createdThread = await Thread.create({
			content,
			author,
			community: communityId
		})

		// Update user model
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id }
		})

		revalidatePath(path)
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`)
	}
}

export async function fetchThreads(pageNumber = 1, postsPerPage = 20) {
	try {
		connectToDB()

		// calculate the number of threads to skip
		const skipAmount = (pageNumber - 1) * postsPerPage

		// fetch threads that have no parent (top-level threads...)
		const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
			.sort({ createdAt: 'desc' })
			.skip(skipAmount)
			.limit(postsPerPage)
			.populate({ path: 'author', model: User })
			.populate({
				path: 'children',
				populate: {
					path: 'author',
					model: User,
					select: '_id name parentId image'
				}
			})
			.exec()

		const totalThreadsCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] }
		})

		const isThereNextPage = totalThreadsCount > skipAmount + threads.length

		return { threads, isThereNextPage }
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`)
	}
}

export async function fetchThreadById(id: string) {
	try {
		connectToDB()

		// TODO: populate community
		const thread = await Thread.findById(id)
			.populate({
				path: 'author',
				model: User,
				select: '_id id name image'
			})
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id name parentId image'
					},
					{
						path: 'children',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id id name parentId image'
						}
					}
				]
			})
			.exec()

		return thread
	} catch (error: any) {
		throw new Error(`Failed to fetch thread (${id}): ${error.message}`)
	}
}

export async function addCommentToThread({
	threadId,
	content,
	userId,
	path
}: CommentToThreadParams) {
	try {
		connectToDB()

		const threadPost = await Thread.findById(threadId)
		if (!threadPost) {
			throw new Error(`Thread with an ID of ${threadId} does not exist`)
		}

		const threadComment = new Thread({
			content: content,
			author: userId,
			parentId: threadId
		})

		const savedThreadComment = await threadComment.save()

		threadPost.children.push(savedThreadComment._id)

		await threadPost.save()

		revalidatePath(path)
	} catch (error: any) {
		throw new Error(
			`Failed to add comment "${content}" to thread(${threadId}): ${error.message}`
		)
	}
}
