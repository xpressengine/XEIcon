# build
selection.json 파일을 기반으로 gh-pages 페이지 생성

## 환경 구성
### node
http://nodejs.org

### grunt
```
npm install -g grunt-cli
```

### npm install
이 디렉토리에서 실행

```
npm install
```

## Build
### 변경 사항 반영 - icons.json 생성
```
grunt
```

`generate`, `build` task가 수행되며, 이 결과로 다음과 같이 출력 된다.

```
Running "generate" task
Result: added=[], changed=[{"code":"e635","class":"power","concat_current":"e635@power-off","concat_origin":"e635@power"},{"code":"e812","class":"bulb","concat_current":"e812@idea","concat_origin":"e812@bulb"}], deleted=[]

Running "build" task
Result : dist/index.html
Done, without errors.
```

"generate" task의 'Result'에 `added`, `changed`, `deleted` 항목이 나열되며, icons.json 파일을 이 내역에 따라 변경된다.

최종 결과물로 `dist/index.html` 파일이 생성된다.


### gh-pages 생성
```
grunt deploy
```

`dist/index.html` 파일을 `gh-pages` 브랜치로 복사한 후 커밋, 푸시 과정까지 수행된다.
