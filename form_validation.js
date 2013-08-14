/*
* Copyright 2012 Kapitanluffy Pirata
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License. 
* You may obtain a copy of the License at:
* 
* http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, 
* software distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
* either express or implied. See the License for the specific language governing permissions 
* and limitations under the License.
*/

var form_validation = new (function() {

	var self = this;
	var fvuuid = 0;

	this.rules = {}

	this.set_rule = function(name, rule, object) {
		if( self.rules[name] == undefined){
			self.rules[name] = {};
		}
		self.rules[name][rule] = object;
	}

	/* main method */
	this.run = function(selector, callback) {

		try {
			var callback = callback || function() {};
			var selector = selector || 'body';
			var errors = [];

			for(var input in self.rules) {

				for(var ktn in self.rules[input]) {
					var input_selector = $(selector).find('[name="'+ input +'"]');
					var rule_object = self.rules[input];

					$(input_selector).each(function(i,e){
						var result = true;
						var uuid = 'fv-' + ++fvuuid;
						$(e).data('fvuuid', uuid);
						$(e).addClass('fv-item');
						
						switch(ktn.toLowerCase()) {
							case 'required':	
								rule_object[ktn]['result'] = is_required(e);
							break;
							case 'number':
								rule_object[ktn]['result'] = is_number(e);
							break;
						}

						if(! rule_object[ktn]['result']) {
							rule_object[ktn]['name'] = ktn.toLowerCase();

							var error = { 'element': e, 'rule': rule_object[ktn], 'uuid': uuid }
							errors.push(error);
						}

						if(typeof(rule_object[ktn]['callback']) == 'function') {
							rule_object[ktn]['callback'](e, rule_object[ktn], uuid);
						}
					});
				}
			}

			errors.length = count(errors);

			if(typeof(callback) == 'function') {
				callback(errors);
			}

			return errors;
		} catch(kpt) {
			console.groupCollapsed('Exception: assumed reason: wrong rules format');
			console.error(kpt);
			console.groupEnd();
		}
	}

	/* rule methods */
	function is_required(selector) {
		if(! $(selector).prop('disabled')) {
			return ($(selector).val() != '');
		}
		return true;
	}

	function is_number(selector) {
		var regex = /[^0-9\.]/i
		var value = $(selector).val();
		return !regex.test(value)
	}

	/* utility methods */
	function count(ktn) {
		var count = 0;
		for (var kpt in ktn) {
			if (ktn.hasOwnProperty(kpt)) {
				++count;
			}
		}
		return count;
	}
 })
