---
title: 常见陷阱
description: 如何避免 Velocity 中的常见陷阱
slug: velocity/dev/pitfalls
---

尽管我们努力让 API 使用起来令人愉悦，
但偶尔仍有一些不尽人意的地方，你应该对此有所了解。

## 在构造时访问 API

在 Velocity 中，插件加载分为两个阶段：构造和初始化。
你插件构造函数中的代码属于构造阶段。
在构造期间，你可以安全地做的事情非常有限，尤其是因为 API 并没有指定哪些操作在构造期间是安全的。
值得注意的是，你不能在构造函数中注册事件监听器，因为你需要有一个有效的插件注册，
但 Velocity 在插件构造完成之前无法注册插件。

为了打破这个循环，你应该始终等待初始化，
这可以通过 Velocity 触发的 [`ProxyInitializeEvent`](jd:velocity:com.velocitypowered.api.event.proxy.ProxyInitializeEvent) 来标识。
我们可以通过为这个事件添加监听器来在初始化时执行操作，如下所示。
请注意，Velocity 会自动将你的插件主类注册为监听器。

```java
@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    // 在这里执行需要访问 Velocity API 的某些操作。
    // 例如，我们可以注册一个事件：
    server.getEventManager().register(this, new PluginListener());
}
```

## Audience 操作尚未完全支持

Velocity 目前不支持 Adventure API 的所有 Audience 操作，因此这些操作应该在后端处理。
此外，播放声音在 1.19.3 以下版本被认为是不可行的，需要一个硬编码的声音 ID 注册表。

| 操作          | 是否支持            |
|-------------|-----------------|
| 聊天消息        | 是               |
| 动作条消息       | 是               |
| 标题          | 是               |
| 老板条         | 是               |
| 选项卡列表的头部和尾部 | 是               |
| 资源包         | 是               |
| 声音          | 是[^sounds-note] |
| 书籍          | 否               |
| 对话框         | 否               |

[^sounds-note]: 播放声音仅在 1.19.3+ 版本中有效，并需要一个发射器（ [`Sound.Emitter#self()`](https://jd.advntr.dev/api/latest/net/kyori/adventure/sound/Sound.Emitter.html#self()) 或来自同一服务器的其他玩家）。[`Player#playSound(Sound)`](jd:velocity:com.velocitypowered.api.proxy.Player#playSound(net.kyori.adventure.sound.Sound))尚未实现，因为 Adventure 的协议要求声音在播放时必须位于玩家的当前位置。
