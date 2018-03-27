## Electron DEMO

实践实践验真理的唯一标准。

### 窗口加载

先使用一个临时窗口加载一个本地[HTML](/resources/startup.html)作为启动页，然后启动加载远程服务的窗口，
等待远程窗口加载好之后，再隐藏启动页，显示应用主页。

[参考代码](/app/index.ts)

### IPC

封装了几个IPC相关的函数，主进程中使用`on`进行监听并给对应的请求做响应、
使用`connection`建立持续事件服务；
在渲染进程中使用`send`发送单次事件，只响应一次结果；
使用`connect`建立持续事件的客户端，通过`connect`、`start`以及`stop`进行控制。

[主进程参考代码](/app/utils/ipc.ts)

[主进程使用参考](/app/ipcRegister.ts)

[渲染进程参考代码](/view/src/utils/ipc.ts)

[渲染进程使用参考](/view/src/ipc/demo.ts)

### 窗口间通信

在渲染进程中封装好一个统一的[创建窗口函数](/view/src/utils/window.ts)，
之后都使用这个函数进行窗口的创建。

但是这样有个问题，就是窗口都是在各个渲染进程中管理的，没能统一，
之后看看改成通过IPC让主进程调用，再返回pid，最后通过`remote.webContents.fromId`获取实例

使用案例：[创建窗口](/view/src/pages/Home.tsx)，[被创建的窗口](/view/src/pages/Other.tsx)
