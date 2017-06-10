import _config  from '../../app.config'


const DB = new class Database {
	constructor() {
		this.data = require('gun')()
	}

	// localforage compatibility
	getItem(key, callback){
		this.data.get(key, ack => {
			if(!ack.put){
				callback('not_found')
			} else {
				callback(null, ack.put)
			}
		})
	}
	setItem(key, data, callback){
		this.data.get(key).put(data, callback)
	}

	removeItem(key){
		this.data.get(key).put(null)
	}
}

export default DB
