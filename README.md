# GooglePlayPurchaseValidator
구글 플레이 결제 검증 BOX

## 설정
```javascript
require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	CONFIG : {
		...
	},

	NODE_CONFIG : {
	
		GPPV : {
			clientEmail : '~~~@~~~.iam.gserviceaccount.com',
			privateKey : '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
			appPackageName : 'com.example.App'
		},
		
		...
	}
});
```

## 사용방법
```javascript
GPPV.validate('{{token}}', function(isValid) {
	console.log(isValid);
});
```

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)

왜 구글은 굳이 이런걸 만들도록 하는 것일까? 안타까울 따름이다.