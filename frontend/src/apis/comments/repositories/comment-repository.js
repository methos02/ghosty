import { req } from '@/services/shortcuts/services-shortcut.js'

const createOnChapter = async options => {
  return await req('comment.createOnChapter', options)
}

const createOnCover = async options => {
  return await req('comment.createOnCover', options)
}

const createOnNovel = async options => {
  return await req('comment.createOnNovel', options)
}

const createReply = async options => {
  return await req('comment.reply', options)
}

const destroy = async options => {
  return await req('comment.destroy', options)
}

const listForChapter = async options => {
  return await req('comment.chapterThread', options)
}

const listForCover = async options => {
  return await req('comment.coverThread', options)
}

const listForNovel = async options => {
  return await req('comment.novelThread', options)
}

export const CommentRepository = {
  createOnChapter,
  createOnCover,
  createOnNovel,
  createReply,
  destroy,
  listForChapter,
  listForCover,
  listForNovel,
}
