# **Module Federation**

## **모듈 페더레이션(Module Federation)이란?**

모듈 페더레이션(Module Federation)은 자바스크립트 응용프로그램이 런타임에 다른 응용프로그램에서 동적으로 코드를 가져올 수 있도록 허용한다.

</br>

## **모듈 페더레이션의 사용 목적**

여러개로 분리되어있는 개별 빌드들이 하나의 어플리케이션 형태를 만들어내야 한다. 이러한 분리된 빌드들은 서로에게 의존하지 않아, 각 부분별로 독자적인 개발과 배치를 가능하게 한다.

흔히 마이크로 프론트엔드라 알려져 있지만 이것 하나에만 국한되지는 않는다.

## **Low Level Concepts**

local 모듈과 remote 모듈로 나눈다. 로컬 모듈은 일반적인 모듈들로 기존의 빌드의 일부분을 말한다. remote 모듈은 기존의 빌드 일부분이 아닌, 흔히 말하는 컨테이너에서 런타임 내에 불러오는 모듈을 말한다.

remote 모듈을 로딩하는 것은 비동기 동작으로 취급된다. remote모듈을 사용할 때 이러한 비동기 작업은 remote 모듈과 진입점 사이에 있는 다음 청크 로드 작업에 배치됩니다. 청크 로딩 작업 없이는 remote 모듈 사용이 불가능하다

일반적으로 청크 로딩 작업은 import()를 통해서 부를 수 있지만, 조금 더 구 버전 개발에서 사용되는 require.ensure이나 requre([......])또한 제공된다.

</br>

**컨테이너는 container entry를 통해 생성된다. 노출된 엑세스는 두 단계로 구분한다.**

1. 모듈 불러오기(비동기)
2. 모듈 평가(동기)

1번 단계는 청크 로딩 중에 수행된다. 2번 단계는 다른 모듈(local 과 remote)과 모듈 평가를 인터리빙하는 동한 수행된다. 이러한 방식은 local에서 remote 혹은 remote에서 local 모듈로 변환해도 평가 순서는 영향을 받지 않는다.

컨테이너를 중첩시키는 것이 가능하다. 컨테이너들은 다른 컨테이너의 모듈을 사용할 수 있다. 컨테이너간의 순환 의존(circular dependencies)도 가능하다.

</br>

### **Overriding**

컨테이너는 선택된 local 모듈에 “overridable”로 플래그를 지정할 수 있다. 컨테이너의 이용자는 “overrides”를 제공하는 것이 가능한데, 이것은 컨테이너의 overridable 모듈들 중 하나를 대신한다. 모든 컨테이너의 모듈들은 소비자가 모듈을 제공할 때, local 모듈을 사용하는 것 대신, 대체된 모듈(overrides된)을 사용한다. 소비자가 대체된 모듈을 제공하지 않을 시에는, 컨테이너에 있는 모든 모듈이 local에 있는 것을 사용한다.

컨테이너는 소비자로 인해 override된 모듈들을 다운할 필요가 없는 방식으로 overridable 모듈을 관리한다. 이는 일반적으로 별개의 청크에 모듈을 배치시킬 때 발생한다.

다른 한편으로는, 대체 모듈 공급자는 비동기 로딩 함수만을 제공한다. 이것은 모듈이 꼭 필요할 때만 컨테이너가 대체 모듈을 로드할 수 있도록 허락한다. 공급자는 컨테이너의 요청이 없을 경우 다운로드가 되지 않도록 하는 방식으로 대체 모듈을 관리한다. 이는 일반적으로 별개의 청크에 모듈을 배치할 때 발생한다.

“name”은 컨테이너로부터 overridable 모듈들을 구별하기 위해 사용된다.

overrides는 컨테이너가 모듈을 노출하는 것과 유사한 방법으로 제공된다. 두 단계로 나눠진다.

1. 로딩(비동기)
2. 평가(비동기)

> 주의: 중첩이 사용될 떄, 하나의 컨테이너에 oveerides를 제공하는 것은 자동적으로 중첩된 컨테이너의 같은 이름을 가진 모듈을 override한다.

> overrides는 반드시 컨테이너의 모듈들이 로드되기 전에 제공되어야 한다. 초기의 청크에서 이용된 overridables는 오로지 promise를 사용하지 않은 동기식 모듈 override로부터 overriden 될 수 있다. 한번 평가된 이후에는 더 이상 overridable(재정의) 할 수 없다.

</br>

## **High Level Concepts**

각각의 빌드는 컨테이너의 역할을 가지며, 또한 다른 빌드의 컨테이너들을 사용하기도 한다. 이러한 방법을 통해 각각의 빌드는 노출된 모듈을 컨테이너로부터 로드하는 것을 통해 모두 접근 가능하다.

공유된 모듈(shared modules)은 override 가능하고 중첩괸 컨테이너에 대하여 overrides로 제공된 모듈들을 말한다. 일반적으로 각 빌드에서 동일한 모듈을 가리킨다.(예. 동일한 라이브러리)

packageName 옵션은 requredVersion을 찾는 패키지 이름을 설정할 수 있도록 한다. 이는 자동적으로 디폴트로 지정된다. 이를 비활성화 하고 싶을 경우, requiredVersion을 false로 설정한다.

</br>

## **Building blocks**

### **overridablesPlugin(Low level)**

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

### **containerPlugin(Low Level)**

이 플러그인은 지정된 exposed 모듈로 추가 컨테이너 항목을 생성한다. 이것은 또한 OverridablesPlugin을 내부적으로 사용하고, override API를 컨테이너 소비자에게 노출한다.

</br>

### **ContainerReferencePlugin(Low Level)**

이 플러그인은 컨테이너에 특정 참조를 외부로 추가하고, 원격 모듈을 이 컨테이너에 가져올 수 있도록 한다. 또한 컨테이너에 override를 제공하기 위해 이러한 컨테이너의 override API를 호출한다.

</br>

### **ModuleFederationPlugin(High Level)**

이 플러그인은 ContainerPlugin 과 ContainerReferencePlugin을 결합한다. overrides와 overridables는 지정된 공유 모듈(shared modules)의 단일 리스트로 결합된다.
