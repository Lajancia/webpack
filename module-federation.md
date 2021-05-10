# **Module Federation**

**[Webpack Module Federation 원문 번역](https://webpack.js.org/concepts/module-federation/) : 황수민**

</br>

## **모듈 페더레이션(Module Federation)이란?**

모듈 페더레이션(Module Federation)은 자바스크립트 응용프로그램이 런타임에 다른 응용프로그램에서 동적으로 코드를 가져올 수 있도록 허용한다.

</br>

## **모듈 페더레이션의 사용 목적**

여러개로 분리되어있는 개별 빌드들이 하나의 어플리케이션 형태를 만들어내야 한다. 이러한 분리된 빌드들은 서로에게 의존하지 않아, 각 부분별로 독자적인 개발과 배치를 가능하게 한다.

흔히 마이크로 프론트엔드라 알려져 있지만 이것 하나에만 국한되지는 않는다.

## **Low Level Concepts**

local 모듈과 remote 모듈로 나눈다. 로컬 모듈은 일반적인 모듈들로 기존의 빌드의 일부분을 말한다. remote 모듈은 기존의 빌드 일부분이 아닌, 흔히 말하는 컨테이너에서 런타임 내에 불러오는 모듈을 말한다.

remote 모듈을 로딩하는 것은 비동기 동작으로 취급된다. remote모듈을 사용할 때 이러한 비동기 작업은 remote 모듈과 진입점 사이에 있는 다음 청크 로드 작업에 배치됩니다. 청크 로딩 작업 없이는 remote 모듈 사용이 불가능하다.

일반적으로 청크 로딩 작업은 `import()`를 통해서 부를 수 있지만, 조금 더 구 버전 개발에서 사용되는 `require.ensure`이나 `requre([......])`또한 제공된다.

</br>

**청크(chunk)란?**

> 이 웹 팩 관련 용어는 내부적으로 번들 프로세스를 관리하는 데 사용된다. 번들은 청크로 구성되며, 그 중 몇 가지 유형(예: 엔트리 및 하위 자식)이 있다. 일반적으로 청크는 출력 번들과 직접 일치하지만 일대일 관계를 제공하지 않는 구성도 있다.

</br>

**컨테이너는 container entry를 통해 생성된다. 노출된 엑세스는 두 단계로 구분한다.**

1. 모듈 불러오기(비동기)
2. 모듈 평가(동기)

1번 단계는 청크 로딩 중에 수행된다. 2번 단계는 다른 모듈(local 과 remote)과 모듈 평가를 인터리빙하는 동한 수행된다. 이러한 방식은 local에서 remote 혹은 remote에서 local 모듈로 변환해도 평가 순서는 영향을 받지 않는다.

컨테이너를 중첩시키는 것이 가능하다. 컨테이너들은 다른 컨테이너의 모듈을 사용할 수 있다. 컨테이너간의 순환 의존(circular dependencies)도 가능하다.

</br>

### **Overriding**

컨테이너는 선택된 local 모듈에 "overridable"로 플래그를 지정할 수 있다. 컨테이너의 이용자는 “overrides”를 제공하는 것이 가능한데, 이것은 컨테이너의 overridable 모듈들 중 하나를 대신한다. 모든 컨테이너의 모듈들은 소비자가 모듈을 제공할 때, local 모듈을 사용하는 것 대신, 대체된 모듈(overrides된)을 사용한다. 소비자가 대체된 모듈을 제공하지 않을 시에는, 컨테이너에 있는 모든 모듈이 local에 있는 것을 사용한다.

컨테이너는 소비자로 인해 override된 모듈들을 다운할 필요가 없는 방식으로 overridable 모듈을 관리한다. 이는 일반적으로 별개의 청크에 모듈을 배치시킬 때 발생한다.

다른 한편으로는, 대체 모듈 공급자는 비동기 로딩 함수만을 제공한다. 이것은 모듈이 꼭 필요할 때만 컨테이너가 대체 모듈을 로드할 수 있도록 허락한다. 공급자는 컨테이너의 요청이 없을 경우 다운로드가 되지 않도록 하는 방식으로 대체 모듈을 관리한다. 이는 일반적으로 별개의 청크에 모듈을 배치할 때 발생한다.

`name`은 컨테이너로부터 overridable 모듈들을 구별하기 위해 사용된다.

overrides는 컨테이너가 모듈을 노출하는 것과 유사한 방법으로 제공된다. 두 단계로 나눠진다.

1. 로딩(비동기)
2. 평가(비동기)

> 주의: 중첩이 사용될 떄, 하나의 컨테이너에 overrides를 제공하는 것은 자동적으로 중첩된 컨테이너의 같은 이름을 가진 모듈을 override한다.

> overrides는 반드시 컨테이너의 모듈들이 로드되기 전에 제공되어야 한다. 초기의 청크에서 이용된 overridables는 오로지 promise를 사용하지 않은 동기식 모듈 override로부터 재정의 될 수 있다. 한번 평가된 이후에는 더 이상 overridable(재정의) 할 수 없다.

</br>

## **High Level Concepts**

각각의 빌드는 컨테이너의 역할을 가지며, 또한 다른 빌드의 컨테이너들을 사용하기도 한다. 이러한 방법을 통해 각각의 빌드는 노출된 모듈을 컨테이너로부터 로드하는 것을 통해 모두 접근 가능하다.

공유된 모듈(shared modules)은 override 가능하고 중첩된 컨테이너에 대하여 overrides로 제공된 모듈들을 말한다. 일반적으로 각 빌드에서 동일한 모듈을 가리킨다.(예. 동일한 라이브러리)

`packageName` 옵션은 `requiredVersion`을 찾는 패키지 이름을 설정할 수 있도록 한다. 이는 자동적으로 디폴트로 지정된다. 이를 비활성화 하고 싶을 경우, `requiredVersion`을 `false`로 설정한다.

</br>

## **Building blocks**

### **`overridablesPlugin`(Low level)**

이 플러그인은 특정 모듈을 “overridable”하게 만들 수 있다. 로컬 api (\_\_webpack_override\_\_\)가 overrides를 제공할 수 있게 한다.

</br>

**webpack.config.js**

```javascript
const OverridablesPlugin = require("webpack/lib/container/OverridablesPlugin");
module.exports = {
  plugins: [
    new OverridablesPlugin([
      {
        // we define an overridable module with OverridablesPlugin
        test1: "./src/test1.js",
      },
    ]),
  ],
};
```

</br>

**src/index.js**

```javascript
__webpack_override__({
  // here we override test1 module
  test1: () => "I will override test1 module under src",
});
```

</br>

### **`containerPlugin`(Low Level)**

이 플러그인은 지정된 exposed 모듈로 추가 컨테이너 항목을 생성한다. 이것은 또한 `OverridablesPlugin`을 내부적으로 사용하고, override API를 컨테이너 소비자에게 노출한다.

</br>

### **`ContainerReferencePlugin`(Low Level)**

이 플러그인은 컨테이너에 특정 참조를 외부로 추가하고, 원격 모듈을 이 컨테이너에 가져올 수 있도록 한다. 또한 컨테이너에 override를 제공하기 위해 이러한 컨테이너의 override API를 호출한다. 로컬 overrides(빌드가 컨테이너일 경우, `__webpack_override` 또는 `override`API 통한 로컬 overrides) 와 구체적으로 명시된 overrides가 모든 참조된 컨테이너에 제공된다.

</br>

### **`ModuleFederationPlugin`(High Level)**

이 플러그인은 `ContainerPlugin` 과 `ContainerReferencePlugin`을 결합한다. overrides와 overridables는 지정된 공유 모듈(shared modules)의 단일 리스트로 결합된다.

</br>

## **개념 목표**

- 웹팩이 지원하는 모든 모듈 타입을 나타내고 사용 가능해야 한다.
- 청크 로딩은 동일선상의 필요한 모든 것들을 로드해야 한다.(예. 웹: 서버로의 단일 왕복)
- Consumer에서 컨테이너로의 제어
  - 모듈 오버라이딩은 단방향 동작이다.
  - 자매 컨테이너들은 서로의 모듈을 오버라이드 할 수 없다.
- 독립적인 환경이어야 한다.
  - web, node.js, etc에서 사용 가능해야 한다.
- Shared 된 상대적(Relative) 요청과 절대적(Absolute) 요청

  - 사용되지 않을 경우에도 제공된다.
  - `config.context` 관련 문제를 해결
  - `requiredVersion`을 디폴트로 사용하지 않는다.

- shared 된 모듈 리퀘스트

  - 사용될 경우에만 제공된다.
  - 빌드에서 사용되는 모든 동일한 모듈 요청과 일치한다.
  - 일치되는 모든 모듈을 제공한다.
  - `requiredVersion`을 package.json으로부터 추출한다.
  - node_modules를 중첩시킬 경우, 다양한 버전을 제공하고 사용할 수 있다.

- /를 포함하는 shared 된 모듈 요청은 모든 모듈 요청을 이 접두사와 일치시킨다.

</br>

## **사용 사례**

**페이지별 별도의 빌드**

SPA(Single Page Application)의 각 페이지는 별도의 빌드에 있는 컨테이너 빌드에서 노출된다. 또한 어플리케이션 셀은 모든 페이지를 remote 모듈로 참조하는 별도의 빌드이다. 이렇게 하면 각 페이지를 개별적으로 배포할 수 있다. routes기 업데이트 되거나 새로운 경로가 추가될 때 어플리케이션 셸이 배포된다. 애플리케이션 셸은 일반적으로 사용되는 라이브러리를 공유 모듈로 정의하여 페이지 빌드에서 라이브러리 중복을 방지한다.

**컨테이너와 같은 컴포넌트 라이브러리**

많은 어플리케이션들이 각 구성요소가 노출된 컨테이너로 빌드될 수 있는 공통 컴포넌트 라이브러리를 공유한다. 각각의 어플리케이션은 컴포넌트 라이브러리 컨테이너에서 컴포넌트를 소비한다. 컴포넌트 라이브러리의 변경은 모든 어플리케이션을 다시 배포할 필요 없이 별도로 배포가 가능하다. 어플리케이션은 자동적으로 최신 버전의 컴포넌트 라이브러리를 사용한다.

</br>

## **Dynamic remote containers**

컨테이너 인터페이스는 `get`와 `init` 메소드를 제공한다. `init`는 하나의 인수로 호출되는 비동기 호환 메소드이다 (공유 범위 객체). 이 객체는 remote 컨테이너에서 공유 범위로 사용되며, 호스트에서 제공되는 모듈들로 채워진다. remote 컨테이너를 런타임에 호스트 컨테이너에 동적으로 연결하는 것에 영향을 줄 수 있다.

**init.js**

```javascript
(async () => {
  // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__("default");
  const container = window.someContainer; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const module = await container.get("./module");
})();
```

컨테이너는 공유된 모듈을 제공하려 한다. 하지만 이미 공유된 모듈이 사용중이라면, 경고 및 공유된 모듈 제공은 무시된다. 컨테이너는 여전히 fallback으로 사용할 수 있다.

이 방식으로 다양한 버전을 제공하는 공유 모듈을 제공하는 A/B 테스트를 동적으로 로드할 수 있다.

> 팁: 원격 컨테이너를 동적으로 연결하기 전에 컨테이너를 로드했는지 확인한다.

</br>

**example: init.js**

```javascript
function loadComponent(scope, module) {
  return async () => {
    // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

loadComponent("abtests", "test123");
```

</br>

## **Troubleshooting**

`Uncaught Error: Shared module is not available for eager consumption`

어플리케이션은 전방위적인 호스트로 동작하는 어플리케이션을 열심히 실행시킨다. 이것과 관련하여 몇가지 옵션을 선택할 수 있다.

</br>

dependency를 Module Federation의 향상된 API에 설정할 수 있다. 이러한 방식은 모듈을 비동기식 청크에 배치하지 않고 동기식으로 제공한다. 이렇게 하면 초기 청크에 shared 모듈을 사용할 수 있다. 주의해야 할 점은, 모든 제공된 모듈들과 예비 모듈들이 항상 다운로드된다는 점이다. 따라서 오로지 어플리케이션의 한 지점에만 제공하는 것을 추천한다.(예를 들어 shell)

</br>

비동기 바운더리를 사용하는 것을 강력하게 추천한다. 이는 규모가 큰 텅크의 초기 코드를 분할하여 추가 왕복이 발생하는 것을 막고, 전반적인 성능을 향상시킨다.

</br>

예를 들어 entry가 아래와 같을 경우:

**index.js**

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

이제 `bootstrap.js파일을 만들어 entry의 컨텐트를 이곳으로 옮기고, endtry에서는 bootstrap을 import 한다.

**index.js**

```javascript
import("./bootstrap");
```

**bootstrap.js**

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

이러한 방법은 효과가 있지만, 일부 제한이 생기거나 단점이 발생할 수 있다.

`ModuleFederationPlugin`을 통해 dependency를 `eager:true`로 세팅한다.

**webpack.config.js**

```javascript
// ...
new ModuleFederationPlugin({
  shared: {
    ...deps,
    react: {
      eager: true,
    },
  },
});
```

</br>

`Uncaught Error: Module "./Button" does not exist in container.`

위의 이슈는 `'./Button'`에 대한 에러를 나타내는 것이 아닐 가능성이 높다. 이러한 이슈는 일반적으로 webpack beta 16에서 webpack beta 17로 업그레이드 할 때 발생한다.

ModuleFederationPlugin에서 exposes를 변경해야 한다.

```javascript
new ModuleFederationPlugin({
  exposes: {
  - 'Button': './src/Button'
  + './Button':'./src/Button'
  }
});
```

</br>

`Uncaught TypeError: fn is not a function`

remote 컨테이너가 없어서 발생한 에러일 가능성이 크다. 따라서 컨테이너가 추가되어있는지 확인할 필요가 있다. 만약 사용하려고 하는 remote 컨테이너가 로드되었지만 여전히 이 오류가 표시된다면, 호스트 컨테이너의 remote 컨테이너 파일도 HTML에 추가할 필요가 있다.

</br>

## **참고자료**

> [Module Federation 원문](https://webpack.js.org/concepts/module-federation/)

> [Module Federation 예제 github](https://github.com/module-federation/module-federation-examples)
