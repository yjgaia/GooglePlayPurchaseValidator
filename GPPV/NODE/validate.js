GPPV.validate = METHOD(function(m) {
	
	var
	// saved access token
	savedAccessToken,
	
	// last get token time
	lastGetTokenTime;
	
	return {
		
		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.productId
			//REQUIRED: params.purchaseToken
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success
			
			var
			// product id
			productId = params.productId,
			
			// purchase token
			purchaseToken = params.purchaseToken,
			
			// error handler.
			errorHandler,
			
			// callback.
			callback;
			
			if (callbackOrHandlers !== undefined) {
				
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}
			
			NEXT([
			function(next) {
				
				if (savedAccessToken === undefined || Date.now() - lastGetTokenTime.getTime() > 30 * 60 * 1000) {
					
					UOAUTH.GET_JWT_TOKEN({
						url : 'https://www.googleapis.com/oauth2/v4/token',
						scopes : ['https://www.googleapis.com/auth/androidpublisher'],
						clientEmail : NODE_CONFIG.GPPV.clientEmail,
						privateKey : NODE_CONFIG.GPPV.privateKey
					}, {
						error : errorHandler,
						
						success : function(result) {
							
							if (result === undefined) {
								if (errorHandler !== undefined) {
									errorHandler();
								} else {
									SHOW_ERROR('[GPPV] [UOAUTH.GET_JWT_TOKEN] result is undefined.');
								}
							} else {
								
								savedAccessToken = result.access_token;
								lastGetTokenTime = new Date();
								
								next();
							}
						}
					});
				}
				
				else {
					next();
				}
			},
			
			function() {
				return function() {
					
					GET({
						isSecure : true,
						host : 'www.googleapis.com',
						uri : 'androidpublisher/v2/applications/' + encodeURIComponent(NODE_CONFIG.GPPV.appPackageName) + '/purchases/products/' + encodeURIComponent(productId) + '/tokens/' + encodeURIComponent(purchaseToken) + '?access_token=' + encodeURIComponent(savedAccessToken)
					}, function(json) {
						
						var
						// data
						data = PARSE_STR(json);
						
						if (callback !== undefined) {
							
							if (data.error !== undefined) {
								callback(false);
							} else if (data.purchaseTimeMillis !== undefined) {
								callback(true);
							} else {
								callback(false);
							}
						}
					});
				};
			}]);
		}
	};
});
