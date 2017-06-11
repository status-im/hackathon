
import './style.less'

// import Game from './game.js'

let parseHashParams = hash=>{
	if (hash.length<3) {
		return {}
	}

	let params = {}
	hash.split('#').forEach(str=>{
		if (!str) { return }

		let kv = str.split('=')
		params[kv[0]]=kv[1]
	})
	return params
}

document.addEventListener('DOMContentLoaded', ()=>{
	// window.Game = new Game(parseHashParams(window.location.hash))
})
