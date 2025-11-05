import { novelsDatas } from '@/apis/novels/datas/novels-datas.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const list = async () => {
  return {
    status: STATUS.SUCCESS,
    data: novelsDatas
  }
}

export const NovelRepository = {
  list
}
