const state = {
  datas: {},
}

const set = current_datas => {
  state.datas = current_datas
}

const get = input_name => {
  if (input_name === undefined) {
    return state.datas
  }
  return state.datas[input_name]
}
export const datasForm = { get, set }
