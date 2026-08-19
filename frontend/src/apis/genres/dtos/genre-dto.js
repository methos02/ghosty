const fromList = (datas = []) => {
  return datas.map(data => GenreDto.fromShow(data))
}

const fromShow = data => ({
  id: data.id,
  label: data.name,
})

export const GenreDto = { fromList, fromShow }
