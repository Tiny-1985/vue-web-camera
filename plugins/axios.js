import * as axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
  options.headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    //'x-api-key': '2fEbUCLhbP3Izlun3dZgE6lRStLw0xJb9ygP2fi7' //api秘钥
  }
  options.responseType = 'json'
}

export default axios.create(options)
