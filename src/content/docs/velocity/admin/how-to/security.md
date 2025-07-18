---
title: 保护服务器
description: 关于如何保护你的服务器的说明
slug: velocity/security
---

保护你的后端服务器（子服）至关重要。
在设置 Velocity 的过程中，你会将服务器设置为离线模式，
这意味着理论上，有人可以伪装成你服务器上的任何玩家（不使用第三方登录插件的情况下）。
这非常危险，因此确保只有代理能够连接到你的服务器非常重要。

本指南将探讨保护后端服务器的各种选项，以确保只有你的代理能够连接到它们。
请注意，这是一个对选项的 _探讨_，旨在回顾各种选项并为你提供它们的优缺点，以便你能做出明智的决定。

这个列表没有特定的顺序，并且几乎所有的这些方法都可以根据需要组合使用。

## 操作系统防火墙

当正确配置时，使用服务器操作系统提供的防火墙功能是一种非常有效的保护服务器的方法。
Velocity **强烈推荐使用防火墙**。

不同操作系统的配置方法可能不同。主要服务器操作系统的解决方案包括：

- Windows: Windows Firewall
- Linux: iptables, nftables

**优点**:

- 如果你不给不可信的服务器访问你服务器的权限，这是万无一失的
- 不需要任何额外的 Minecraft 服务器配置
- 这是任何操作系统良好系统加固建议的一部分

**缺点**:

- 初次设置较为复杂
- 如果有多个代理，使用起来可能比较困难
- 防火墙配置必须与新服务器和代理保持同步
- 在共享主机（面板服，VPS提供商等）上可能不可行

## Velocity 现代转发

如果你的服务器只支持 Minecraft 1.13 及以上版本，
Velocity 的现代转发可以将玩家信息转发到你的服务器，
并为防止有人伪装成你的代理提供第二层保护。

:::caution[注意]

Velocity 现代转发不能替代防火墙。
我们强烈建议在任何 Minecraft 代理设置中使用防火墙。

:::

**优点**:

- 免费获得玩家信息转发
- 在共享主机上安全，前提是主机已经实施了适当的保护措施
- 如果你在多台物理服务器上托管你的服务器，也可以使用

**缺点**:

- 只适用于 Minecraft 1.13 及以上版本
- 需要 Paper 1.13 或以上版本，或者如果你使用 Fabric，则需要 FabricProxy-Lite
- 依赖于转发密（默认为 `forwarding.secret`）的保密性

## 绑定到 `localhost`

如果你的代理和你的其他服务器托管在同一台物理计算机上（并且没有人托管其他服务器），
将你的服务器绑定到 `localhost` 是一种非常简单的方法，
可以防止除代理以外的任何东西连接到它们。

对于后端服务器（子服），打开 `server.properties` 文件。
找到以 `server-ip` 开头的行，并将其更改为 `server-ip=127.0.0.1`。保存文件并重新启动服务器。

之后，打开你的 `velocity.toml` 文件，
并确保所有服务器都指向 `127.0.0.1:<端口号>`。

**优点**:

- 与其他方法相比，设置非常简单
- 如果你不给不可信的用户访问你服务器的权限，这是万无一失的（DDOS除外）

**缺点**:

- 如果你将任何服务器移动到不同的物理服务器上（使得代理端和后端服务器不在同一台物理服务器上），
  也可以指定 IP 地址
- 在共享主机上不可行

## 使用加密隧道

这是绑定到 `localhost` 的一种变体，但与将所有服务器托管在单台物理服务器上不同，
你将为每台服务器设置一个加密隧道，并确保服务器只接受来自隧道的传入连接。
有许多不同的解决方案，从 VPN 解决方案如 [WireGuard](https://www.wireguard.com)、[OpenVPN](https://openvpn.net/) 和 [tinc](https://www.tinc-vpn.org/)
到加密隧道如 [spiped](https://www.tarsnap.com/spiped.html)。
本指南不会详细说明如何设置每种解决方案（原文档就是怎么说的，国内尽量不要提及这些）。

**优点**:

- 在代理端和后端服务器之间加密流量，同时确保只有授权的客户端可以连接到你的服务器

**缺点**:

- 设置非常复杂
- 大多数的时候在共享主机上无法使用

## IP 白名单插件

作为最后一道防线，你可以选择使用像 [IPWhitelist](https://www.spigotmc.org/resources/ipwhitelist.61/) 这样的插件，
限制只有在 IP 白名单上的用户才能登录。

**优点**:

- 如果其他解决方案都无法使用（尤其是在共享主机上），这可能是你唯一的选择。

**缺点**:

- 如果攻击者能够在与你的代理相同的节点上托管服务器，则容易受到攻击。

## 其他重要的安全建议

以下是一些不言而喻的常识性通用建议：

- 经常备份你的服务器
- 在你的服务器上设置防火墙
- 以非特权用户身份运行你的服务器（对于 Linux 用户来说，这意味着不要使用 `sudo` 或以 `root` 用户身份运行！）
- 经常更新 Velocity、你的 Minecraft 服务器和服务器插件，以及你的服务器操作系统
- 使用强密码
- 在实际安装任何插件或软件之前，仔细考虑可能的影响
- 保护你在服务器上运行的任何其他服务
- 遵循你操作系统的所有系统加固建议

我们不会对上述建议进行深入探讨，因此请自行进行一些研究。
你的设置会有所不同——除了这些一般指导方针外，我们无法提供“一刀切”的建议。
