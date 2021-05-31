# Fruit Box Game Solve
* https://en.gamesaien.com/game/fruit_box/

# 숫자 10을 만드는 박스를 Guid 할 수있는 Tool을 만들어보자

# 프로젝트 순서
1. 게임화면을 Canvas로 가져오기
2. Canvas 데이터를 분석하여 숫자로 인식하기
3. 숫자 배열을 Guide Box Data로 변환하기
4. Canvas에 Guide Box를 그려 주기

# 1차 시도
* OpenCV JS의 Template 매칭을 사용하여 이미지를 분석하려고 하였으나 매칭이 하나밖에 나오지 않아서 포기함
* https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html
* https://github.com/TechStark/opencv-js

# 2차 시도
* Tesseractjs를 사용하여 숫자를 인식하려 하였으나 생각 보다 느리고 정확도가 떨여져서 포기함
* https://github.com/naptha/tesseract.js#tesseractjs


# 3차 시도
* TensorFlow js를 통하여 인식을 진행함
* 정확한 숫자 분리가 되지 않아서 인식율이 떨어짐

# 4차 시도(진행중)
* 좀더 정확한 인식을 위하여 시스템 개선이 필요함
