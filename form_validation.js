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
			self.rules[name] = [];
		}

		self.rules[name].push(rule);
	}

	/* main method */
	this.run = function(selector, callback) {

		try {
			var callback = callback || function() {};
			var selector = selector || 'body';
			var errors = {};

			for(var inputs in self.rules) {

				$(self.rules[inputs]).each(function(i,input){
					var input_selector = $(selector).find('[name="'+ inputs +'"]');
					var rule_object = input;
					var rule_name = input['name'];

					// console.log(self.rules);
					if(typeof rule_name == 'function') {
						rule_name = 'function';
					}

					$(input_selector).each(function(i,e){
						if(errors[inputs]) {
							return;
						}

						var result = true;
						$(e).addClass('fv-item');

						/* generate uuid for this element */
						var uuid = $(e).data('fvuuid');
						if( uuid == undefined) {
							uuid = 'fv-' + inputs.replace(/\[\]/,'') + '-' + ++fvuuid;
							$(e).data('fvuuid', uuid);
						}

						/* run the rules */
						switch(rule_name) {
							case 'required':	
								rule_object['result'] = is_required(e);
							break;
							case 'valid_date':
								rule_object['result'] = is_valid_date(e);
							break;
							case 'number':
								rule_object['result'] = is_number(e);
							break;
							case 'number_no_zero':
								rule_object['result'] = is_number_no_zero(e);
							break;
							case 'function':
								rule_object['result'] = input['name'](e);
							break;
						}

						if(typeof(rule_object['callback']) == 'function') {
							rule_object['callback'](e, rule_object, uuid);
						}

						if(! rule_object['result']) {
							var error = { 'element': e, 'rule': rule_object, 'uuid': uuid }
							errors[inputs] = error;
						}

					});
				});
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

	function is_number_no_zero(selector) {
		var regex = /[^1-9\.]/i
		var value = $(selector).val();
		return !regex.test(value)
	}

	function is_valid_date(selector) {

		return (new Date($(selector).val()) != 'Invalid Date')
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
