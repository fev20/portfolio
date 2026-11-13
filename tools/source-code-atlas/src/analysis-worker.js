import { analyzeProject } from './analyzer.js';

self.onmessage = ({ data: { token, files } }) => {
  try {
    self.postMessage({ token, graph: analyzeProject(files) });
  } catch (error) {
    self.postMessage({ token, error: error instanceof RangeError ? '분석할 수 있는 구문 깊이를 넘었습니다.' : '이 프로젝트를 분석하지 못했습니다.' });
  }
};
