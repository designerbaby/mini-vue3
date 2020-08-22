## mini-vue3

### 一、简介：
- 学习vue3源码后，实现最简单的vue3,用于学习

### 二、学习思路：
- 整理整个vue3框架，然后逐个攻破。最后成为一个系统。
- TODO:
- [ ] runtime-core
    - 初始化 
        - [ ] 流程
        - [ ] 细节实现
            - [ ] hook 的触发实现
            - [ ] 标准化 vnode 的实现（与简单vnode的对比）
            - [ ] 初始化 props 逻辑
            - [ ] 初始化 slots 逻辑
            - [ ] proxy 暴露给用户的代理实现
            - [ ] 给元素设置 props
    - 更新
        - [ ] 流程
        - [ ] nextTick 的实现
        - [ ] 细节实现
            - [ ] text_children 类型的 patch
            - [ ] array_children 类型的 patch
            - [ ] props 类型的 patch

### 三、学习源码方法：
- 1、带着问题思考->将思考去看得见（写下来）->先读单元测试了解实现->切到对应源码->debugger
- 2、看下社区优秀文章帮助理解整理思路。

