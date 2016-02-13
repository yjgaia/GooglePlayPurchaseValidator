GPPV.validate = METHOD(function(m) {
	
	var
	// google jwt request
	googleJWTRequest = require('google-oauth-jwt').requestWithJWT();
	
	return {
		
		run : function(params, callback) {
			//REQUIRED: params
			//REQUIRED: params.productId
			//REQUIRED: params.purchaseToken
			//REQUIRED: callback
			
			var
			// product id
			productId = params.productId,
			
			// purchase token
			purchaseToken = params.purchaseToken;
			
			googleJWTRequest({
				url : 'https://www.googleapis.com/androidpublisher/v2/applications/' + encodeURIComponent(NODE_CONFIG.GPPV.appPackageName) + '/purchases/subscriptions/' + encodeURIComponent(productId) + '/tokens/' + encodeURIComponent(purchaseToken),
				jwt : {
					email : NODE_CONFIG.GPPV.clientEmail,
					key : NODE_CONFIG.GPPV.privateKey,
					scopes : ['https://www.googleapis.com/auth/androidpublisher']
				}
			}, function(error, response, json) {
				
				var
				// data
				data;
				
				if (error !== TO_DELETE) {
					callback(false);
				} else {
					
					data = PARSE_STR(json);
					
					if (data.error !== undefined) {
						callback(false);
					} else if (data.expiryTimeMillis !== undefined && data.startTimeMillis !== undefined) {
						callback(true);
					} else {
						callback(false);
					}
				}
			});
		}
	};
});
