import 'whatwg-fetch'
import {fetch as fetchPolyfill} from 'whatwg-fetch'

//JSON.stringify(params)

export function method(method, params) {
	//FormData
	const formData = new FormData();
	formData.append('method', method);
	for (var name in params) {
		formData.append(name, params[name]);
	}
	//Promise
	return new Promise(function(resolve, reject) {
		fetch('https://mwidget.ru/api.php', {method:'POST', cache:'no-cache', body:formData })
		.then(response => response.json())
		.then(json => {
			if (json.response) {
				resolve(json.response);
			} else if (json.error) {
				reject(json.error);
			}
		})
	  .catch(error => {
      reject(error);
	  })
	})
};
