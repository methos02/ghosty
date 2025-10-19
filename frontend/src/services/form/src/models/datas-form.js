let datas = {};

const set = current_datas => {
  datas = current_datas 
}

const get = input_name =>{ 
  if(input_name === undefined) { return datas }
  return datas[input_name]
}
export const datasForm = { get, set }
