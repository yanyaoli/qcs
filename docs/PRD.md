建议技术栈：

```yaml
Frontend:
  Vue3
  TypeScript
  Vite
  Pinia
  Vue Router
  Element Plus

Desktop:
  Tauri 2.x

Backend:
  Node.js
  Fastify

Database:
  SQLite（单机版）
  后续可升级 MySQL

Face Recognition:
  调用第三方接口
```

---

# 工厂品管系统（QCS）

版本：V1.0

项目名称：

```text
Polyunion QCS
Quality Control System
```

---

# 一、项目定位

## 项目目标

用于工厂品管部门进行：

* 人员登录
* 首件确认
* 车间巡检
* 不良记录
* 机台管理
* 历史追溯

系统部署于：

* Windows工位机
* 平板设备
* 后续Android设备

---

# 二、UI设计规范

## 整体风格

参考：

* Netflix
* Apple VisionOS
* 企业级 MES 系统

关键词：

```text
深色
玻璃拟态
圆角
大卡片
触屏友好
```

主题色：

```css
Primary:
#E50914

Background:
#0F1115

Panel:
#1A1D24

Text:
#FFFFFF

Secondary Text:
#9CA3AF
```

---

# 三、登录页面

Route：

```text
/login
```

---

## 页面布局

```text
+--------------------------------+
|            Logo                |
|         Polyunion QCS          |
|                                |
|      登录方式选择区域           |
|                                |
+--------------------------------+
```

---

## 登录方式

### 1. 选择登录

步骤：

#### 第一步

选择部门

例如：

```json
[
  "品管部",
  "生产部",
  "工程部"
]
```

---

#### 第二步

选择人员

示例：

```json
[
  {
    "name":"张三",
    "shift":"A班"
  },
  {
    "name":"李四",
    "shift":"B班"
  }
]
```

显示效果：

```text
张三
[A班]

李四
[B班]
```

---

#### 第三步

自拍

调用摄像头：

```javascript
navigator.mediaDevices.getUserMedia()
```

用途：

```text
仅记录登录照片
不做人脸比对
```

保存：

```json
{
  "employeeId":"001",
  "photo":"xxx.jpg",
  "loginTime":"2026-06-18 08:00:00"
}
```

---

### 2. 人脸识别登录

点击：

```text
人脸识别登录
```

流程：

```text
打开摄像头
↓
拍照
↓
调用识别接口
↓
返回员工信息
↓
自动登录
```

接口：

```http
POST /api/face/recognize
```

返回：

```json
{
  "employeeId":"001",
  "employeeName":"张三",
  "department":"品管部"
}
```

---

# 四、主页框架

Route：

```text
/
```

---

## 顶部 Header

高度：

```text
80px
```

布局：

```text
+---------------------------------------------------+
|Logo      DynamicIsland       UserInfo     Setting |
+---------------------------------------------------+
```

---

### 左侧

主标题：

```text
Polyunion QCS
```

副标题：

```text
深圳市小化互联网信息技术有限公司
```

---

### 中间

Dynamic Island

默认：

```text
2026-06-18 09:30:00
```

后续扩展：

```text
待确认首件：3
待巡检设备：5
系统通知
异常报警
```

---

### 右侧

主标题：

```text
张三
```

副标题：

```text
品管部
```

按钮：

```text
⚙ 设置
```

菜单：

```text
个人信息
退出登录
系统设置
关于系统
```

---

# 五、导航栏规范

每个业务页面统一：

```text
← 返回

页面标题

功能按钮
```

例如：

```text
← 返回      首件确认      新增
```

---

# 六、左侧菜单

宽度：

```text
260px
```

菜单：

```text
0 数据看板
1 首件确认
2 车间巡检
3 历史台账
4 机台管理
5 不良原因
```

---

## 菜单交互

首页：

```text
菜单显示
```

进入业务页面：

```text
菜单自动隐藏
```

例如：

```text
首页
↓
点击首件确认
↓
菜单收起
↓
全屏展示业务内容
```

返回：

```text
恢复菜单
```

---

# 七、数据看板

Route：

```text
/dashboard
```

默认登录后进入。

---

## 顶部欢迎区

布局：

```text
早上好，张三
品管部主管
```

根据时间动态显示：

```text
05:00-11:59
早上好

12:00-17:59
下午好

18:00-23:59
晚上好
```

---

## 任务统计卡片

第一排

### 首件待确认

```json
{
  "count":12
}
```

---

### 待巡检设备

```json
{
  "count":8
}
```

---

### 待签字

```json
{
  "count":5
}
```

---

布局：

```text
+------+ +------+ +------+
| 12   | |  8   | |  5   |
|首件  | |巡检  | |签字  |
+------+ +------+ +------+
```

---

## 品质统计区域

第二排

### 总不良数

```json
{
  "totalNg":156
}
```

---

### 不良原因统计

例如：

```json
[
  {
    "reason":"刮花",
    "count":50
  },
  {
    "reason":"毛刺",
    "count":30
  },
  {
    "reason":"尺寸异常",
    "count":20
  }
]
```

展示：

```text
柱状图
饼图
排行榜
```

---

# 八、数据库设计（V1）

## Department

```sql
id
name
```

---

## Employee

```sql
id
employee_no
name
department_id
position
shift
face_id
status
```

---

## LoginRecord

```sql
id
employee_id
photo
login_time
login_type
```

login_type：

```text
select
face
```

---

## DefectReason

```sql
id
name
product_type
status
```

---

# 九、后续预留模块

V2：

```text
首件确认流程
电子签名
巡检记录
PDF报告
机台二维码
异常预警
MES对接
ERP对接
```

---
