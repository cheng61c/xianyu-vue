import request from '@/utils/request.ts'
import type { PostListQueryDto } from '@/types/PostListQueryDto'
import type { ServerPostListQueryDto } from '@/types/ServerPostListQueryDto'
import type { Post } from '@/types/Post'
import type { ServerPost } from '@/types/ServerPost'
import type { TopPost } from '@/types/TopPost'
import type { PostSelectDto } from '@/types/PostSelectDto'
import type { PostDisabledDto } from '@/types/PostDisabled'
import type { PostCommentDto } from '@/types/PostCommentDto'
import type PostDto from '@/types/PostDto'

export const getPostList = (dto: PostListQueryDto) => {
  return request({
    method: 'get',
    url: '/post/list',
    params: dto,
  })
}
export const getPostListTop = () => {
  return request({
    method: 'get',
    url: '/post/top',
  })
}
export const getServerPostList = (dto: ServerPostListQueryDto) => {
  return request({
    method: 'get',
    url: '/server-post/list',
    params: dto,
  })
}
export const getPostDetail = (id: number) => {
  return request.get(`/post/detail?id=${id}`)
}

export const createPost = (dto: PostDto) => {
  return request.post('/post', dto)
}
export const updatePost = (dto: PostDto) => {
  return request.put('/post', dto)
}
export const createServerPost = (dto: ServerPost) => {
  return request.post('/server-post', dto)
}
export const updateServerPost = (dto: ServerPost) => {
  return request.put('/server-post', dto)
}

export const getPostDocumentList = ({ id }: { id: number }) => {
  return request.get(`/post-version/list?postId=${id}`)
}
export const deletePostAsAdmin = (id: number) => {
  return request.delete(`/admin/post/${id}`)
}
export const postToTopAsAdmin = (dto: TopPost) => {
  return request.post(`/post/top`, dto)
}

export const postListAsAdmin = (dto: PostSelectDto) => {
  return request({
    method: 'GET',
    url: '/post/list',
    params: dto,
  })
}
export const postDisabled = (dto: PostDisabledDto) => {
  return request.post('/admin/post/disabled', dto)
}

export const deletePostInAdmin = (id: number) => {
  return request.delete(`/post/${id}`)
}
export const getPostComment = (id: number, orderType: boolean) => {
  return request.get(
    `/post-comment/postId?postId=${id}&orderType=${orderType ? '2' : '1'}`
  )
}
export const deleteComment = (id: number) => {
  return request.delete(`/post-comment/${id}`)
}
export const postLike = (id: number) => {
  return request.post(`/post/like`, {
    id: id,
  })
}
export const postBad = (id: number) => {
  return request.post(`/post/bad`, {
    id: id,
  })
}
export const postCommentLike = (id: number) => {
  return request.post(`/post-comment/like`, {
    id: id,
  })
}
export const postCommentBad = (id: number) => {
  return request.post(`/post-comment/bad`, {
    id: id,
  })
}
export const replyPost = (dto: PostCommentDto) => {
  return request.post(`/post-comment`, dto)
}

export const searchPost = (keyword: string) => {
  return request.get(`/post/search?title=${keyword}&page=1&limit=30&type=2`)
}

export const getScoreList = (id: number) => {
  return request.get(`/score/list?postId=${id}`)
}
