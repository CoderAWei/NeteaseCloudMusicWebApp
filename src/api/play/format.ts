import { ICommentInfo } from '@/typings'
import { handleFormatTime } from '@/utils'

/*
 * @Author: XuZhongWei
 * @Date: 2021-03-22 13:59:11
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-22 14:22:09
 */
export const handleFormatMusicComment = (res: any): ICommentInfo => {
  console.log(res)

  const total = res.total
  const showTotal = handleFormatTotal(res.total)
  let hotComments: any = []
  let comments: any = []
  if (res.hotComments) {
    hotComments = handleFormatComment(res.hotComments)
  }
  //  else {
  //   comments.concat(handleFormatComment(res.comments))
  // }

  comments = handleFormatComment(res.comments)

  return {
    total,
    showTotal,
    hotComments,
    comments
  }
}

const handleFormatTotal = (total: number): string => {
  return total >= 1000 ? '999+' : '999'
}

const handleFormatComment = (comments: any): any => {
  const arr: any = []
  comments.forEach((item: any) => {
    arr.push({
      nickname: item.user.nickname,
      avatarUrl: item.user.avatarUrl,
      content: item.content,
      time: item.time,
      timeStr: handleFormatTime(item.time, '{y}年{m}月{d}日'),
      likedCount: item.likedCount,
      liked: item.liked,
      isVip: item.user.vipType !== 0
    })
  })
  return arr
}
