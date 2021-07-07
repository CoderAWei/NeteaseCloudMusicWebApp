import { ITopListInfo } from '@/typings'
import { handleGetUserId } from '@/utils'

export const handleFormatTopList = (res: any): ITopListInfo[] => {
  const { list } = res
  const topList: ITopListInfo[] = []
  list.forEach((item: any) => {
    topList.push({
      id: item.id,
      name: item.name,
      updateFrequency: item.updateFrequency,
      coverImgUrl: item.coverImgUrl + '?param=150y150',
      trackCount: item.trackCount
    })
  })
  return topList
}

export const handleFormatPlaylist = (res: any): {create: ITopListInfo[], collect: ITopListInfo[]} => {
  const { playlist } = res
  const createdPlaylist: ITopListInfo[] = []
  const collectedPlaylist: ITopListInfo[] = []

  playlist.forEach((item: any) => {
    if (item.creator.userId === handleGetUserId()) {
      createdPlaylist.push({
        id: item.id,
        name: item.name,
        updateFrequency: item.updateFrequency ? item.updateFrequency : '拖更没鸡鸡',
        updateTime: item.updateTime,
        coverImgUrl: item.coverImgUrl + '?param=50y50',
        trackCount: item.trackCount
      })
    } else {
      collectedPlaylist.push({
        id: item.id,
        name: item.name,
        updateFrequency: item.updateFrequency ? item.updateFrequency : '拖更没鸡鸡',
        updateTime: item.updateTime,
        coverImgUrl: item.coverImgUrl + '?param=50y50',
        trackCount: item.trackCount
      })
    }
  })

  return {
    create: createdPlaylist,
    collect: collectedPlaylist
  }
}
