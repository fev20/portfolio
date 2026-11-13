# 공개 예제: add-trailing-comma

`project.json`에는 [add-trailing-comma](https://github.com/asottile/add-trailing-comma)의 [v3.2.0 커밋](https://github.com/asottile/add-trailing-comma/commit/73c775a66303f25cbf03b0c2e3c14e71253f198a)에 들어 있는 패키지 Python 파일 15개를 원문 그대로 담았습니다. 배포 데이터에는 저장소의 테스트와 설정 파일을 포함하지 않습니다. 저작권과 MIT 라이선스 전문은 [LICENSE.txt](./LICENSE.txt)에 있습니다. [고정 커밋의 LICENSE](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/LICENSE)

[배포용 명령의 진입점](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/setup.cfg#L31)은 `add_trailing_comma._main.main`입니다. `python -m add_trailing_comma`도 같은 함수를 호출합니다. [모듈 실행 근거](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/__main__.py#L6)

세 경로는 모두 [main](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L85) → [fix_file](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L56) → [_fix_src](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L27)에서 시작합니다. 공통 구간의 호출 위치는 [파일 순회](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L98)와 [파일 내용 전달](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L70)입니다.

| 탐색 경로 | 호출 위치 | 대상의 정의 |
| --- | --- | --- |
| Python 소스를 AST로 변환 | [add_trailing_comma/_main.py:29](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L29) | [ast_parse](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_ast_helpers.py#L10) |
| AST를 순회해 변환 콜백 수집 | [add_trailing_comma/_main.py:33](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L33) | [visit](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_data.py#L41) |
| 괄호 주변의 줄바꿈과 들여쓰기 정리 | [add_trailing_comma/_main.py:47](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L47) | [fix_brace](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_token_helpers.py#L113) |

`_fix_src` 안의 콜백은 토큰 위치로 검색한 목록에서 꺼내 호출합니다. 이 호출의 대상은 실행 시점에 결정되므로 정적 지도에서 미해결로 표시하는 사례로도 볼 수 있습니다. [동적 콜백 호출 근거](https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L44)

원문은 GitHub에서 전체 커밋 SHA를 지정해 읽었습니다. JSON에서 복원한 모든 Python 파일과 LICENSE의 Git blob SHA를 같은 커밋의 트리와 대조했습니다.
