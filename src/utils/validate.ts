/*
 * @Author: XuZhongWei
 * @Date: 2021-02-01 10:09:45
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-02-01 10:10:29
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): Boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}
