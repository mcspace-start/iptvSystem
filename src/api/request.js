export default {
  get(url, options = { params: {} }) {
    const time = 1500;
    // #region
    // 以/分割url
    const [, path] = url.split("/");
    if (!path) {
      throw new Error("url格式错误");
    }
    // 外部使用resolve和reject
    let resolve1;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve1 = res;
      reject = rej;
    });
    const resolve = (data = {}, pr = 0.4) => {
      const rand = Math.random();
      setTimeout(() => {
        if (rand > pr) {
          if (Object.keys(options.params).length) {
            console.log("模拟数据接受参数-start");
            console.table(options.params)
            console.log("模拟数据接受参数-end");
          };
          resolve1({
            code: 200,
            msg: "请求成功",
            data: data,
          }); // 返回成功
        } else {
          // 返回权限不够
          resolve1({ code: 403, msg: `权限不够 rand: ${rand.toFixed(1)} < ${pr}` });
        }
      }, time);
    };
    // #endregion
    switch (path) {
      // #region
      case "login":
        resolve({ token: "123456" }, 0);
        break;
      // 更新
      case "update":
        const rand3 = Math.random()
        if (rand3 < 0.5) {
          resolve({
            "logs": [
              "开始更新EPG节目指南...",
              "输出: [2025-07-24 19:49:53] ========== EPG采集开始 ==========",
              "输出: [2025-07-24 19:49:59] 处理失败: 无法获取EPG数据",
              "输出: [2025-07-24 19:49:59] 处理失败: 无法获取EPG数据",
              "更新EPG节目指南失败，退出码: 1，耗时: 6秒"
            ]
          })
        } else {
          resolve({
            "logs": [
              "开始更新IPTV直播源...",
              "输出: 🔄 从数据库加载配置...",
              "输出: ✅ 成功加载 19 项配置",
              "输出: ✅ 启用 RTSP输出",
              "输出: ✅ 启用 IGMP输出",
              "输出: ✅ 启用 组合输出",
              "输出: ✅ 启用 TXT输出",
              "输出: ✅ 启用 RTSP简化",
              "输出: ✅ 启用 用户信息替换",
              "输出: ❌ 禁用 RTSP IP替换",
              "输出: ✅ 启用 RTP格式",
              "输出: ✅ 启用 调整顺序",
              "输出: 📁 文件配置:",
              "输出: ┣━ 额外频道文件: /opt/iptv/data/sh.html",
              "输出: ┣━ 追加M3U文件: /opt/iptv/data/custom.m3u",
              "输出: 开始生成 RTSP M3U 文件: /app/src/public/files/iptv.m3u",
              "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
              "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
              "输出: 📺 广东: 70个频道",
              "输出: 📺 央视: 39个频道",
              "输出: 📺 卫视: 34个频道",
              "输出: 📺 付费: 4个频道",
              "输出: 📺 4K超高清: 4个频道",
              "输出: 📺 其他: 29个频道",
              "输出: ✅ 已生成 RTSP M3U 文件，共包含 98 个频道",
              "输出: 💾 准备保存RTSP频道信息到数据库...",
              "输出: ✅ 已保存98个RTSP频道到数据库 (链接简化: 99个 (平均减少306字符/链接))",
              "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
              "输出: ⚠️ 额外M3U文件不存在，跳过追加",
              "输出: 📝 开始处理文件: /app/src/public/files/iptv.m3u",
              "输出: ✅ 文件处理完成: /app/src/public/files/iptv.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
              "输出: 开始生成 IGMP M3U 文件: /app/src/public/files/igmp.m3u",
              "输出: 📊 正在从数据库获取igmp模式的频道信息和分组排序...",
              "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
              "输出: 📺 广东: 70个频道",
              "输出: 📺 央视: 39个频道",
              "输出: 📺 卫视: 34个频道",
              "输出: 📺 付费: 4个频道",
              "输出: 📺 4K超高清: 4个频道",
              "输出: 📺 其他: 29个频道",
              "输出: ✅ 已生成 IGMP M3U 文件，共包含 98 个频道",
              "输出: 💾 准备保存IGMP频道信息到数据库...",
              "输出: ✅ 已保存98个IGMP频道到数据库 (RTP格式转换: 98个)",
              "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
              "输出: ⚠️ 额外M3U文件不存在，跳过追加",
              "输出: 📝 开始处理文件: /app/src/public/files/igmp.m3u",
              "输出: ✅ 文件处理完成: /app/src/public/files/igmp.m3u (替换了用户认证信息)",
              "输出: 开始生成组合 M3U 文件: /app/src/public/files/rtsp+igmp.m3u",
              "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
              "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
              "输出: 📺 广东: 70个频道",
              "输出: 📺 央视: 39个频道",
              "输出: 📺 卫视: 34个频道",
              "输出: 📺 付费: 4个频道",
              "输出: 📺 4K超高清: 4个频道",
              "输出: 📺 其他: 29个频道",
              "输出: 📊 正在从数据库获取igmp模式的频道信息和分组排序...",
              "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
              "输出: 📺 广东: 70个频道",
              "输出: 📺 央视: 39个频道",
              "输出: 📺 卫视: 34个频道",
              "输出: 📺 付费: 4个频道",
              "输出: 📺 4K超高清: 4个频道",
              "输出: 📺 其他: 29个频道",
              "输出: ✅ 已生成组合 M3U 文件，共包含 98 个频道",
              "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
              "输出: ⚠️ 额外M3U文件不存在，跳过追加",
              "输出: 📝 开始处理文件: /app/src/public/files/rtsp+igmp.m3u",
              "输出: ✅ 文件处理完成: /app/src/public/files/rtsp+igmp.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
              "输出: 开始生成 TXT 格式频道列表: /app/src/public/files/iptv.txt",
              "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
              "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
              "输出: 📺 广东: 70个频道",
              "输出: 📺 央视: 39个频道",
              "输出: 📺 卫视: 34个频道",
              "输出: 📺 付费: 4个频道",
              "输出: 📺 4K超高清: 4个频道",
              "输出: 📺 其他: 29个频道",
              "输出: ✅ 已生成 TXT 频道列表，共包含 98 个频道，分组 5 个",
              "输出: 📝 开始处理文件: /app/src/public/files/iptv.txt",
              "输出: ✅ 文件处理完成: /app/src/public/files/iptv.txt (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
              "更新IPTV直播源成功，耗时: 4秒",
            ]
          });
        }

        break;
      // 更新日志
      case "updateLogs":
        resolve({
          logs: [
            {
              id: 45,
              update_type: "iptv",
              status: "success",
              start_time: "2025-07-10T18:55:03.000Z",
              end_time: "2025-07-10T18:55:07.000Z",
              duration: 4,
              logs: [
                "开始更新IPTV直播源...",
                "输出: 🔄 从数据库加载配置...",
                "输出: ✅ 成功加载 19 项配置",
                "输出: ✅ 启用 RTSP输出",
                "输出: ✅ 启用 IGMP输出",
                "输出: ✅ 启用 组合输出",
                "输出: ✅ 启用 TXT输出",
                "输出: ✅ 启用 RTSP简化",
                "输出: ✅ 启用 用户信息替换",
                "输出: ❌ 禁用 RTSP IP替换",
                "输出: ✅ 启用 RTP格式",
                "输出: ✅ 启用 调整顺序",
                "输出: 📁 文件配置:",
                "输出: ┣━ 额外频道文件: /opt/iptv/data/sh.html",
                "输出: ┣━ 追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: 开始生成 RTSP M3U 文件: /app/src/public/files/iptv.m3u",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 RTSP M3U 文件，共包含 98 个频道",
                "输出: 💾 准备保存RTSP频道信息到数据库...",
                "输出: ✅ 已保存98个RTSP频道到数据库 (链接简化: 99个 (平均减少306字符/链接))",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/iptv.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/iptv.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "输出: 开始生成 IGMP M3U 文件: /app/src/public/files/igmp.m3u",
                "输出: 📊 正在从数据库获取igmp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 IGMP M3U 文件，共包含 98 个频道",
                "输出: 💾 准备保存IGMP频道信息到数据库...",
                "输出: ✅ 已保存98个IGMP频道到数据库 (RTP格式转换: 98个)",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/igmp.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/igmp.m3u (替换了用户认证信息)",
                "输出: 开始生成组合 M3U 文件: /app/src/public/files/rtsp+igmp.m3u",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: 📊 正在从数据库获取igmp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成组合 M3U 文件，共包含 98 个频道",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/rtsp+igmp.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/rtsp+igmp.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "输出: 开始生成 TXT 格式频道列表: /app/src/public/files/iptv.txt",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 TXT 频道列表，共包含 98 个频道，分组 5 个",
                "输出: 📝 开始处理文件: /app/src/public/files/iptv.txt",
                "输出: ✅ 文件处理完成: /app/src/public/files/iptv.txt (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "更新IPTV直播源成功，耗时: 4秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T18:55:20.000Z",
            },
            {
              id: 44,
              update_type: "epg",
              status: "error",
              start_time: "2025-07-10T14:36:12.000Z",
              end_time: "2025-07-10T14:36:17.000Z",
              duration: 5,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:36:12] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:36:17] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:36:17] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 5秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:36:29.000Z",
            },
            {
              id: 43,
              update_type: "epg",
              status: "pending",
              start_time: "2025-07-10T14:35:55.000Z",
              end_time: "2025-07-10T14:36:01.000Z",
              duration: 6,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:35:55] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:36:00] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:36:00] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 6秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:36:11.000Z",
            },
            {
              id: 42,
              update_type: "epg",
              status: "error",
              start_time: "2025-07-10T14:35:15.000Z",
              end_time: "2025-07-10T14:35:20.000Z",
              duration: 5,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:35:15] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:35:20] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:35:20] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 5秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:35:31.000Z",
            },
            {
              id: 41,
              update_type: "epg",
              status: "error",
              start_time: "2025-07-10T14:34:36.000Z",
              end_time: "2025-07-10T14:34:43.000Z",
              duration: 7,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:34:36] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:34:42] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:34:42] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 7秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:34:52.000Z",
            },
            {
              id: 40,
              update_type: "epg",
              status: "pending",
              start_time: "2025-07-10T14:33:52.000Z",
              end_time: "2025-07-10T14:33:58.000Z",
              duration: 7,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:33:52] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:33:58] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:33:58] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 7秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:34:08.000Z",
            },
            {
              id: 39,
              update_type: "tvb",
              status: "error",
              start_time: "2025-07-10T14:33:12.000Z",
              end_time: "2025-07-10T14:33:14.000Z",
              duration: 1,
              logs: [
                "开始更新TVB直播源...",
                "错误: 2025-07-10 22:33:12,946 - __main__ - INFO - 已从环境变量加载数据库配置",
                "错误: 2025-07-10 22:33:12,951 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,047 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,057 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,057 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,057 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,057 - mysql.connector - INFO - package: mysql.connector.plugins",
                "错误: 2025-07-10 22:33:13,057 - mysql.connector - INFO - plugin_name: caching_sha2_password",
                "错误: 2025-07-10 22:33:13,058 - mysql.connector - INFO - AUTHENTICATION_PLUGIN_CLASS: MySQLCachingSHA2PasswordAuthPlugin",
                "错误: 2025-07-10 22:33:13,060 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,060 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,064 - __main__ - INFO - 数据库连接测试成功",
                "错误: 2025-07-10 22:33:13,066 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,154 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,163 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,163 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,163 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,165 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,165 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,178 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,263 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,273 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,273 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,273 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,275 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,275 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,287 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,373 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,382 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,382 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,382 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,384 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,384 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,397 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,481 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,490 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,490 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,491 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,492 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,492 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,502 - __main__ - INFO - 输出目录: /app/src/public/files",
                "错误: 2025-07-10 22:33:13,503 - __main__ - INFO - 输出文件配置: {'rtsp': 'iptv.m3u', 'igmp': 'igmp.m3u', 'combined': 'rtsp+igmp.m3u'}",
                "错误: 2025-07-10 22:33:13,505 - mysql.connector - DEBUG - Building SSL context",
                "错误: 2025-07-10 22:33:13,590 - mysql.connector - DEBUG - Switching to SSL",
                "错误: 2025-07-10 22:33:13,599 - mysql.connector - DEBUG - SSL has been enabled",
                "错误: 2025-07-10 22:33:13,599 - mysql.connector - DEBUG - Starting authorization phase",
                "错误: 2025-07-10 22:33:13,599 - mysql.connector - DEBUG - The provided initial strategy is caching_sha2_password",
                "错误: 2025-07-10 22:33:13,601 - mysql.connector - DEBUG - Exchanging further packets",
                "错误: 2025-07-10 22:33:13,601 - mysql.connector - DEBUG - caching_sha2_password completed succesfully",
                "错误: 2025-07-10 22:33:13,610 - __main__ - ERROR - 未能从数据库获取API_TOKEN",
                "输出: 数据库配置: 192.168.2.9:3306, 用户: shenzhen, 数据库: shenzhen",
                "输出: 未找到配置: API_TOKEN",
                "更新TVB直播源失败，退出码: 1，耗时: 1秒",
                "总处理时间: 1秒",
                "状态: error",
                "完成时间: 2025-07-10T14:33:13.694Z",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:33:29.000Z",
            },
            {
              id: 38,
              update_type: "epg",
              status: "error",
              start_time: "2025-07-10T14:33:03.000Z",
              end_time: "2025-07-10T14:33:10.000Z",
              duration: 7,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-10 22:33:03] ========== EPG采集开始 ==========",
                "输出: [2025-07-10 22:33:09] 处理失败: 无法获取EPG数据",
                "输出: [2025-07-10 22:33:09] 处理失败: 无法获取EPG数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 7秒",
              ],
              created_by: "test",
              created_at: "2025-07-10T14:33:20.000Z",
            },
            {
              id: 37,
              update_type: "static_iptv",
              status: "success",
              start_time: "2025-07-09T10:12:58.000Z",
              end_time: "2025-07-09T10:12:59.000Z",
              duration: 2,
              logs: [
                "开始静态更新IPTV直播源...",
                "输出: 🔄 从数据库加载配置...",
                "输出: ✅ 成功加载 19 项配置",
                "输出: ✅ 启用 RTSP输出",
                "输出: ✅ 启用 IGMP输出",
                "输出: ✅ 启用 组合输出",
                "输出: ✅ 启用 TXT输出",
                "输出: ✅ 启用 RTSP简化",
                "输出: ✅ 启用 用户信息替换",
                "输出: ❌ 禁用 RTSP IP替换",
                "输出: ✅ 启用 RTP格式",
                "输出: ✅ 启用 调整顺序",
                "输出: 📁 文件配置:",
                "输出: ┣━ 额外频道文件: /opt/iptv/data/sh.html",
                "输出: ┣━ 追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ┗━ 本地频道文件: 未配置",
                "输出: 📂 正在读取本地频道列表文件: /app/src/public/files/channel_list.html",
                "输出: ✅ 成功读取本地频道列表文件: channel_list.html (339.9KB)",
                "输出: 🔍 正在解析频道数据...",
                "输出: ✅ 成功提取 147 个频道",
                "输出: ℹ️ 没有配置额外频道文件或文件不存在",
                "输出: ✅ 成功获取用户认证信息: Yr9U5pxbFBM6IJc81Y-r2v4d2wpWiIGgqJS9oLANkqzgWfftqcC6bYmJXMVweG2njhLfodOqNWfHYJsWeqoOnOc45aoNWy2I8rX6_crSLq4",
                "输出: 开始生成 RTSP M3U 文件: /app/src/public/files/iptv.m3u",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 RTSP M3U 文件，共包含 98 个频道",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/iptv.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/iptv.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "输出: 开始生成 IGMP M3U 文件: /app/src/public/files/igmp.m3u",
                "输出: 📊 正在从数据库获取igmp模式的频道信息...",
                "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 IGMP M3U 文件，共包含 98 个频道",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/igmp.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/igmp.m3u (替换了用户认证信息)",
                "输出: 开始生成组合 M3U 文件: /app/src/public/files/rtsp+igmp.m3u",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: 📊 正在从数据库获取igmp模式的频道信息...",
                "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成组合 M3U 文件，共包含 98 个频道",
                "输出: 📂 准备追加M3U文件: /opt/iptv/data/custom.m3u",
                "输出: ⚠️ 额外M3U文件不存在，跳过追加",
                "输出: 📝 开始处理文件: /app/src/public/files/rtsp+igmp.m3u",
                "输出: ✅ 文件处理完成: /app/src/public/files/rtsp+igmp.m3u (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "输出: 开始生成 TXT 格式频道列表: /app/src/public/files/iptv.txt",
                "输出: 📊 正在从数据库获取rtsp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个rtsp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: 📊 正在从数据库获取igmp模式的频道信息和分组排序...",
                "输出: ✅ 成功获取180个igmp模式频道，分组情况:",
                "输出: 📺 广东: 70个频道",
                "输出: 📺 央视: 39个频道",
                "输出: 📺 卫视: 34个频道",
                "输出: 📺 付费: 4个频道",
                "输出: 📺 4K超高清: 4个频道",
                "输出: 📺 其他: 29个频道",
                "输出: ✅ 已生成 TXT 频道列表，共包含 98 个频道，分组 5 个",
                "输出: 📝 开始处理文件: /app/src/public/files/iptv.txt",
                "输出: ✅ 文件处理完成: /app/src/public/files/iptv.txt (简化了 98 个RTSP链接 (平均减少 306 字符/链接), 替换了用户认证信息)",
                "静态更新IPTV直播源成功，耗时: 2秒",
              ],
              created_by: "test",
              created_at: "2025-07-09T10:13:13.000Z",
            },
            {
              id: 36,
              update_type: "epg",
              status: "pending",
              start_time: "2025-07-06T09:23:24.000Z",
              end_time: "2025-07-06T09:23:25.000Z",
              duration: 1,
              logs: [
                "开始更新EPG节目指南...",
                "输出: [2025-07-06 17:23:24] ========== EPG采集开始 ==========",
                "输出: [2025-07-06 17:23:25] 错误: 无法获取认证数据",
                "更新EPG节目指南失败，退出码: 1，耗时: 1秒",
              ],
              created_by: "test",
              created_at: "2025-07-06T09:23:38.000Z",
            },
          ],
          total: 103,
        }, 0);
        break;
      case "deletelog":
        resolve();
        break;
      case "deletelogs":
        resolve();
        break;
      case "deleteRangelogs":
        resolve();
        break;
      // EPG
      case "getServerConfig":
        resolve({
          server_url: "http://125.88.95.8:33200",
        }, 0)
        break;
      case "saveServerConfig":
        resolve();
        break;
      case "defaultServerAuth":
        resolve({
          area_name: "区域名称",
          user_id: "07551205809577",
          lang: "zh-CN",
          support_hd: "1",
          net_user_id: "07551205809577@iptv.gd",
          dhcp_user_id: "07551205809577@iptv.gd",
          authenticator:
            "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
          stb_type: "ZTE_B860AV1_toEPG",
          stb_version: "V80711333.1032",
          conn_type: "4",
          stb_id: "BE100499007034400000D071C447942B",
          template_name: "iptvsnmv3",
          area_id: "",
          user_token: "E529BD027A65F113AAC50512C47199C9",
          user_group_id: "",
          product_package_id: "-1",
          mac: "28:41:C6:38:62:E8",
          user_field: "0",
          software_version: "",
          desktop_id: "",
          is_smart_stb: false,
          stb_maker: "ZTE",
          vip: "",
        }, 0)
        break;
      case "saveDefaultServerAuth":
        resolve()
        break;
      case "regionAuth":
        resolve([
          {
            id: 1,
            area_name: "区域名称A",
            user_id: "07551205809577",
            lang: "zh-CN",
            support_hd: "1",
            net_user_id: "07551205809577@iptv.gd",
            dhcp_user_id: "07551205809577@iptv.gd",
            authenticator:
              "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
            stb_type: "ZTE_B860AV1_toEPG",
            stb_version: "V80711333.1032",
            conn_type: "4",
            stb_id: "BE100499007034400000D071C447942B",
            template_name: "iptvsnmv3",
            area_id: "",
            user_token: "E529BD027A65F113AAC50512C47199C9",
            user_group_id: "",
            product_package_id: "-1",
            mac: "28:41:C6:38:62:E8",
            user_field: "0",
            software_version: "",
            desktop_id: "",
            is_smart_stb: false,
            stb_maker: "ZTE",
            vip: "",
          }, {
            id: 2,
            area_name: "区域名称B",
            user_id: "07551205809577",
            lang: "zh-CN",
            support_hd: "1",
            net_user_id: "07551205809577@iptv.gd",
            dhcp_user_id: "07551205809577@iptv.gd",
            authenticator:
              "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
            stb_type: "ZTE_B860AV1_toEPG",
            stb_version: "V80711333.1032",
            conn_type: "4",
            stb_id: "BE100499007034400000D071C447942B",
            template_name: "iptvsnmv3",
            area_id: "",
            user_token: "E529BD027A65F113AAC50512C47199C9",
            user_group_id: "",
            product_package_id: "-1",
            mac: "28:41:C6:38:62:E8",
            user_field: "0",
            software_version: "",
            desktop_id: "",
            is_smart_stb: false,
            stb_maker: "ZTE",
            vip: "",
          }, {
            id: 3,
            area_name: "区域名称C",
            user_id: "07551205809577",
            lang: "zh-CN",
            support_hd: "1",
            net_user_id: "07551205809577@iptv.gd",
            dhcp_user_id: "07551205809577@iptv.gd",
            authenticator:
              "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
            stb_type: "ZTE_B860AV1_toEPG",
            stb_version: "V80711333.1032",
            conn_type: "4",
            stb_id: "BE100499007034400000D071C447942B",
            template_name: "iptvsnmv3",
            area_id: "",
            user_token: "E529BD027A65F113AAC50512C47199C9",
            user_group_id: "",
            product_package_id: "-1",
            mac: "28:41:C6:38:62:E8",
            user_field: "0",
            software_version: "",
            desktop_id: "",
            is_smart_stb: false,
            stb_maker: "ZTE",
            vip: "",
          }, {
            id: 4,
            area_name: "区域名称D",
            user_id: "07551205809577",
            lang: "zh-CN",
            support_hd: "1",
            net_user_id: "07551205809577@iptv.gd",
            dhcp_user_id: "07551205809577@iptv.gd",
            authenticator:
              "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
            stb_type: "ZTE_B860AV1_toEPG",
            stb_version: "V80711333.1032",
            conn_type: "4",
            stb_id: "BE100499007034400000D071C447942B",
            template_name: "iptvsnmv3",
            area_id: "",
            user_token: "E529BD027A65F113AAC50512C47199C9",
            user_group_id: "",
            product_package_id: "-1",
            mac: "28:41:C6:38:62:E8",
            user_field: "0",
            software_version: "",
            desktop_id: "",
            is_smart_stb: false,
            stb_maker: "ZTE",
            vip: "",
          }], 0)
        break;
      case "regionAuthSearch":
        resolve([{
          id: 6,
          area_name: "区域名称E",
          user_id: "07551205809577",
          lang: "zh-CN",
          support_hd: "1",
          net_user_id: "07551205809577@iptv.gd",
          dhcp_user_id: "07551205809577@iptv.gd",
          authenticator:
            "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
          stb_type: "ZTE_B860AV1_toEPG",
          stb_version: "V80711333.1032",
          conn_type: "4",
          stb_id: "BE100499007034400000D071C447942B",
          template_name: "iptvsnmv3",
          area_id: "",
          user_token: "E529BD027A65F113AAC50512C47199C9",
          user_group_id: "",
          product_package_id: "-1",
          mac: "28:41:C6:38:62:E8",
          user_field: "0",
          software_version: "",
          desktop_id: "",
          is_smart_stb: false,
          stb_maker: "ZTE",
          vip: "",
        }])
        break;
      case "deleteRegionAuth":
        resolve();
        break;
      case "editRegionAuth":
        resolve();
        break;
      case "addRegionAuth":
        resolve();
        break;
      case "mappings":
        if (options.params.dondition === "area_name") {
          resolve([
            {
              id: 0,
              channel_id: "1001",
              area_name: "IPTV直播源",
            },
            {
              id: 1,

              channel_id: "1002",
              area_name: "EPG节目指南",
            },
            {
              id: 2,

              channel_id: "1003",
              area_name: "静态IPTV源",
            },
            {
              id: 3,

              channel_id: "1004",
              area_name: "TVB直播源",
            },
          ], 0);
        } else {
          resolve([
            {
              id: 4,

              channel_id: "1003",
              area_name: "静态IPTV源",
            },
            {
              id: 5,

              channel_id: "1004",
              area_name: "TVB直播源",
            },
          ], 0);
        }

        break;
      case "editMappings":
        resolve()
        break;
      case "addMappings":
        resolve()
        break;
      case "deleteMappings":
        resolve()
        break;
      // 认证数据
      case "authData":
        resolve({
          user_id: "07551205809577",
          lang: "zh-CN",
          support_hd: "1",
          net_user_id: "07551205809577@iptv.gd",
          dhcp_user_id: "07551205809577@iptv.gd",
          authenticator:
            "10C28BC59BF8A416DDE95D0FC43C59BE24CA5563B4C12431254B593769422B44AFCEF5D3021262B86A928D31E64356F01B8A281CB54CF51FCAF851A28D4C2D43944B64C8A000CD6BC13F687F0A89D9207E9DAA3C44991890D9E40D6647CA925920047915457A495891C41B494F264FADB39473B44295E76765D46F5A5384AE16",
          stb_type: "ZTE_B860AV1_toEPG",
          stb_version: "V80711333.1032",
          conn_type: "4",
          stb_id: "BE100499007034400000D071C447942B",
          template_name: "iptvsnmv3",
          area_id: "",
          user_token: "E529BD027A65F113AAC50512C47199C9",
          user_group_id: "",
          product_package_id: "-1",
          mac: "28:41:C6:38:62:E8",
          user_field: "0",
          software_version: "",
          desktop_id: "",
          is_smart_stb: false,
          stb_maker: "ZTE",
          vip: "",
        }, 0)
        break;
      case "saveAuthData":
        resolve()
        break;
      // tvb配置
      case "tvbConfig":
        resolve({ apiToken: "abcdefg123456" }, 0)
        break;
      case "alterTvbConfig":
        resolve()
        break;
      case "scheduledTasks":
        resolve([
          {
            id: 1,
            command: "/opt/iptv/scripts/python/iptv",
            day: "*",
            enabled: false,
            hour: "1",
            minute: "30",
            month: "*",
            period: "weekly",
            task_name: "iptv",
            week: "0"
          },
          {
            id: 2,
            task_name: "epg",
            minute: "30",
            hour: "8",
            day: "*",
            month: "*",
            week: "*",
            command: "/opt/iptv/scripts/python/epg",
            enabled: true,
            period: "daily"
          },
          {
            id: 3,
            task_name: "tvb",
            minute: "01",
            hour: "12",
            day: "*",
            month: "*",
            week: "*",
            command: "/opt/iptv/scripts/python/tvb",
            enabled: false,
            period: "daily"
          }
        ], 0)
        break;
      // 定时任务
      case "alterTask":
        resolve()
        break;
      case "deleteTask":
        resolve()
        break;
      case "addTask":
        resolve([
          options.params
        ])
        break;
      case "syncTask":
        resolve()
        break;
      case "taskToogle":
        resolve()
        break;
      // iptv配置
      case "iptvConfig":
        resolve({
          iptvServer: "http://125.88.95.8:33200",
          multicastServer: "http://192.168.2.1:4022",
        }, 0)
        break;
      case "outputConfig":
        resolve({
          outputCombined: "rtsp+igmp.m3u",
          outputIgmp: "igmp.m3u",
          outputRtsp: "iptv.m3u",
          outputTxt: "iptv.txt",
        }, 0)
        break;
      case "dataFiles":
        resolve({
          extraChannelsFile: "/opt/iptv/data/sh.html",
          extraAppendM3uFile: "/opt/iptv/data/custom.m3u",
        }, 0)
        break;
      case "features":
        resolve({
          enableRtsp: true,
          enableIgmp: true,
          enableCombined: false,
          enableTxt: false,
          enableRtpFormat: true,
          enableRtspSimplify: true,
          enableUserinfoReplace: false,
          enableHttpUrl: true,
        }, 0)
        break;
      case "updateIptvConfig":
        resolve();
        break;
      case "updateOutputConfig":
        resolve();
        break;
      case "updateDataFiles":
        resolve();
        break;
      case "updateFeatures":
        resolve();
        break;
      // #endregion
      // rtsp代理
      case "rtspProxy":
        resolve({
          rtspProxyUrl: "rtsp://admin:12345@192.168.1.100:554/streaming/channels/1", enableRtspIpReplace: true
        }, 0)
        break;
      case "updateRtspProxy":
        resolve()
        break;
      case "rtspProxyServer":
        resolve({
          serverAddress: "183.59.156.166",
          serverPort: 554,
          listenAddress: "0.0.0.0",
          listenPort: 554,
          bufferSize: 16384,
          timeout: 10,
          keepAliveInterval: 25,
          keepAliveMethod: "OPTIONS",
          keepAliveCseqStart: 1000,
          retryDelay: 1,
          connectionCheckInterval: 30,
          maxRetries: 3,
          selectTimeout: 0.1,
          maxRedirects: 10,
        }, 0)
        break;
      case "updateRtspProxyServer":
        resolve()
        break;
      case "servers":
        resolve([
          {
            id: 1,
            serverName: "广州地区入口",
            serverAddress: "rtsp://192.168.1.1:554",
          },
          {
            id: 2,
            serverName: "深圳地区入口",
            serverAddress: "rtsp://192.168.1.2:554",
          },
          {
            id: 3,
            serverName: "北京地区入口",
            serverAddress: "rtsp://192.168.1.3:554",
          },
        ], 0)
        break;
      case "deleteServers":
        resolve()
        break;
      case "addServers":
        resolve()
        break;
      case "updateServers":
        resolve()
        break;
      // 仪表盘
      case "systemResources":
        resolve(
          {
            "cpu": {
              "usage": Math.min(((Math.random() * (100 - 0 + 1)) + 0).toFixed(2), 100),
              "cores": 4
            },
            "memory": {
              "total": "3.83GB",
              "used": "852.07MB",
              "percent": Math.min(((Math.random() * (100 - 0 + 1)) + 0).toFixed(2), 100)
            },
            "disk": {
              "total": "44.7G",
              "used": "10.0G",
              "percent": Math.min(((Math.random() * (100 - 0 + 1)) + 0).toFixed(2), 100)
            },
            "system": {
              "os": "Alpine Linux v3.18",
              "node": "v16.20.2",
              "uptime": "33天 0小时 56分钟"
            }
          }, 0)
        break;
      case "iptvStatus":
        const rand = Math.random()
        let s = "";
        if (rand > 0.8) {
          s = "normal"
        } else if (rand > 0.6) {
          s = "abnormal"
        } else {
          s = "failed"
        }

        resolve({
          status: s, // normal  abnormal failed
          configFile: s, // normal  abnormal failed
          channelList: Math.floor((Math.random() * (300 - 100 + 1)) + 100),
          trafficStats: Math.floor((Math.random() * (200 - 0 + 1)) + 0),
        }, 0)
        break;
      case "recentLogs":
        const list = [
          {
            "id": 45,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-10T18:55:03.000Z",
            "end_time": "2025-07-10T18:55:07.000Z",
            "duration": 4,
            "created_by": "test",
            "created_at": "2025-07-10T18:55:20.000Z"
          },
          {
            "id": 405,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-10T18:55:03.000Z",
            "end_time": "2025-07-10T18:55:07.000Z",
            "duration": 4,
            "created_by": "test",
            "created_at": "2025-07-10T18:55:20.000Z"
          },
          {
            "id": 12,
            "update_type": "epg",
            "status": "failed",
            "start_time": "2025-07-05T14:22:11.000Z",
            "end_time": "2025-07-05T14:22:45.000Z",
            "duration": 34,
            "created_by": "user123",
            "created_at": "2025-07-05T14:23:00.000Z"
          },
          {
            "id": 78,
            "update_type": "tvb",
            "status": "success",
            "start_time": "2025-07-08T09:30:00.000Z",
            "end_time": "2025-07-08T09:30:15.000Z",
            "duration": 15,
            "created_by": "admin",
            "created_at": "2025-07-08T09:30:30.000Z"
          },
          {
            "id": 34,
            "update_type": "static_iptv",
            "status": "pending",
            "start_time": "2025-07-03T11:45:00.000Z",
            "end_time": "2025-07-03T11:45:30.000Z",
            "duration": 30,
            "created_by": "user456",
            "created_at": "2025-07-03T11:46:00.000Z"
          },
          {
            "id": 56,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-12T16:00:00.000Z",
            "end_time": "2025-07-12T16:00:20.000Z",
            "duration": 20,
            "created_by": "test",
            "created_at": "2025-07-12T16:00:40.000Z"
          },
          {
            "id": 90,
            "update_type": "epg",
            "status": "failed",
            "start_time": "2025-07-01T08:15:00.000Z",
            "end_time": "2025-07-01T08:15:45.000Z",
            "duration": 45,
            "created_by": "user789",
            "created_at": "2025-07-01T08:16:00.000Z"
          },
          {
            "id": 23,
            "update_type": "tvb",
            "status": "success",
            "start_time": "2025-07-06T10:00:00.000Z",
            "end_time": "2025-07-06T10:00:30.000Z",
            "duration": 30,
            "created_by": "admin",
            "created_at": "2025-07-06T10:01:00.000Z"
          },
          {
            "id": 67,
            "update_type": "static_iptv",
            "status": "pending",
            "start_time": "2025-07-04T12:30:00.000Z",
            "end_time": "2025-07-04T12:30:45.000Z",
            "duration": 45,
            "created_by": "user101",
            "created_at": "2025-07-04T12:31:00.000Z"
          },
          {
            "id": 89,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-09T14:45:00.000Z",
            "end_time": "2025-07-09T14:45:25.000Z",
            "duration": 25,
            "created_by": "test",
            "created_at": "2025-07-09T14:45:50.000Z"
          },
          {
            "id": 43,
            "update_type": "epg",
            "status": "failed",
            "start_time": "2025-07-02T09:00:00.000Z",
            "end_time": "2025-07-02T09:00:35.000Z",
            "duration": 35,
            "created_by": "user202",
            "created_at": "2025-07-02T09:01:00.000Z"
          },
          {
            "id": 76,
            "update_type": "tvb",
            "status": "success",
            "start_time": "2025-07-07T11:15:00.000Z",
            "end_time": "2025-07-07T11:15:40.000Z",
            "duration": 40,
            "created_by": "admin",
            "created_at": "2025-07-07T11:16:00.000Z"
          },
          {
            "id": 14,
            "update_type": "static_iptv",
            "status": "pending",
            "start_time": "2025-07-05T13:00:00.000Z",
            "end_time": "2025-07-05T13:00:25.000Z",
            "duration": 25,
            "created_by": "user303",
            "created_at": "2025-07-05T13:01:00.000Z"
          },
          {
            "id": 57,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-11T15:30:00.000Z",
            "end_time": "2025-07-11T15:30:30.000Z",
            "duration": 30,
            "created_by": "test",
            "created_at": "2025-07-11T15:31:00.000Z"
          },
          {
            "id": 29,
            "update_type": "epg",
            "status": "failed",
            "start_time": "2025-07-03T10:45:00.000Z",
            "end_time": "2025-07-03T10:45:50.000Z",
            "duration": 50,
            "created_by": "user404",
            "created_at": "2025-07-03T10:46:00.000Z"
          },
          {
            "id": 81,
            "update_type": "tvb",
            "status": "success",
            "start_time": "2025-07-08T12:00:00.000Z",
            "end_time": "2025-07-08T12:00:45.000Z",
            "duration": 45,
            "created_by": "admin",
            "created_at": "2025-07-08T12:01:00.000Z"
          },
          {
            "id": 36,
            "update_type": "static_iptv",
            "status": "pending",
            "start_time": "2025-07-06T14:15:00.000Z",
            "end_time": "2025-07-06T14:15:30.000Z",
            "duration": 30,
            "created_by": "user505",
            "created_at": "2025-07-06T14:16:00.000Z"
          },
          {
            "id": 68,
            "update_type": "iptv",
            "status": "success",
            "start_time": "2025-07-12T13:30:00.000Z",
            "end_time": "2025-07-12T13:30:25.000Z",
            "duration": 25,
            "created_by": "test",
            "created_at": "2025-07-12T13:31:00.000Z"
          },
          {
            "id": 92,
            "update_type": "epg",
            "status": "failed",
            "start_time": "2025-07-04T09:15:00.000Z",
            "end_time": "2025-07-04T09:15:45.000Z",
            "duration": 45,
            "created_by": "user606",
            "created_at": "2025-07-04T09:16:00.000Z"
          },
          {
            "id": 24,
            "update_type": "tvb",
            "status": "success",
            "start_time": "2025-07-09T10:30:00.000Z",
            "end_time": "2025-07-09T10:30:50.000Z",
            "duration": 50,
            "created_by": "admin",
            "created_at": "2025-07-09T10:31:00.000Z"
          }
        ]
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            // 生成一个 0 到 i 的随机索引
            const j = Math.floor(Math.random() * (i + 1));
            // 交换当前元素与随机索引处的元素
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }
        shuffleArray(list);
        resolve(list, 0)
        break;
      case "proxyControl":
        const r = Math.random()
        resolve({
          status: r > 0.5 ? "running" : "stopped", // stoppend running
          serverAddress: "127.0.0.1", // 服务器地址
          serverPort: 554, // 服务器端口
          listenAddress: "0.0.0.0", // 监听地址
          listenPort: 554, // 监听端口
          uptime: "33天 5小时 43分钟",
        }, 0)
        break
      case "startProxy":
        resolve()
        break;
      case "stopProxy":
        resolve()
        break;
      case "restartProxy":
        resolve()
        break;
      case "rtspProxyConfig":
        resolve({
          serverAddress: "127.0.0.1",
          serverPort: 554,
          listenAddress: "0.0.0.0",
          listenPort: 554,
          bufferSize: 16384,
          timeout: 10,
        }, 0);
        break;
      case "saveProxySettigs":
        resolve();
        break;
      case "serverAddressList":
        resolve([
          {
            serverName: "广州市地区入口",
            serverAddress: "183.59.156.166",
          },
          {
            serverName: "深圳市地区入口",
            serverAddress: "183.59.160.198",
          },
          {
            serverName: "中山市地区入口",
            serverAddress: "125.88.52.199",
          },
          {
            serverName: "汕头市地区入口",
            serverAddress: "125.88.53.199",
          },
          {
            serverName: "肇庆市地区入口",
            serverAddress: "125.88.54.199",
          },
          {
            serverName: "河源市地区入口",
            serverAddress: "125.88.55.199",
          },
        ], 0)
        break;
      // iptv管理
      case "iptvChannels":
        resolve({
          total: 30,
          data: [
            {
              "id": 1,
              "channel_id": "90000013",
              "channel_name": "北京卫视",
              "channel_number": "1",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "北京",
              "igmp_group": "北京",
              "epg_id": "10",
              "epg_name": "北京卫视",
              "epg_number": "11001",
              "rtsp_url": "rtsp://192.168.1.100:554/live/beijing_tv",
              "igmp_url": "igmp://239.1.1.1:5000"
            },
            {
              "id": 2,
              "channel_id": "90000014",
              "channel_name": "湖南卫视",
              "channel_number": "2",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "湖南",
              "igmp_group": "湖南",
              "epg_id": "11",
              "epg_name": "湖南卫视",
              "epg_number": "11002",
              "rtsp_url": "rtsp://192.168.1.100:554/live/hunan_tv",
              "igmp_url": "igmp://239.1.1.2:5000"
            },
            {
              "id": 3,
              "channel_id": "90000015",
              "channel_name": "浙江卫视",
              "channel_number": "3",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "浙江",
              "igmp_group": "浙江",
              "epg_id": "12",
              "epg_name": "浙江卫视",
              "epg_number": "11003",
              "rtsp_url": "rtsp://192.168.1.100:554/live/zhejiang_tv",
              "igmp_url": "igmp://239.1.1.3:5000"
            },
            {
              "id": 4,
              "channel_id": "90000016",
              "channel_name": "东方卫视",
              "channel_number": "4",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "上海",
              "igmp_group": "上海",
              "epg_id": "13",
              "epg_name": "东方卫视",
              "epg_number": "11004",
              "rtsp_url": "rtsp://192.168.1.100:554/live/shanghai_tv",
              "igmp_url": "igmp://239.1.1.4:5000"
            },
            {
              "id": 5,
              "channel_id": "90000017",
              "channel_name": "江苏卫视",
              "channel_number": "5",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "江苏",
              "igmp_group": "江苏",
              "epg_id": "14",
              "epg_name": "江苏卫视",
              "epg_number": "11005",
              "rtsp_url": "rtsp://192.168.1.100:554/live/jiangsu_tv",
              "igmp_url": "igmp://239.1.1.5:5000"
            },
            {
              "id": 6,
              "channel_id": "90000018",
              "channel_name": "广东卫视",
              "channel_number": "6",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "广东",
              "igmp_group": "广东",
              "epg_id": "15",
              "epg_name": "广东卫视",
              "epg_number": "11006",
              "rtsp_url": "rtsp://192.168.1.100:554/live/guangdong_tv",
              "igmp_url": "igmp://239.1.1.6:5000"
            },
            {
              "id": 7,
              "channel_id": "90000019",
              "channel_name": "深圳卫视",
              "channel_number": "7",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "广东",
              "igmp_group": "广东",
              "epg_id": "16",
              "epg_name": "深圳卫视",
              "epg_number": "11007",
              "rtsp_url": "rtsp://192.168.1.100:554/live/shenzhen_tv",
              "igmp_url": "igmp://239.1.1.7:5000"
            },
            {
              "id": 8,
              "channel_id": "90000020",
              "channel_name": "四川卫视",
              "channel_number": "8",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "四川",
              "igmp_group": "四川",
              "epg_id": "17",
              "epg_name": "四川卫视",
              "epg_number": "11008",
              "rtsp_url": "rtsp://192.168.1.100:554/live/sichuan_tv",
              "igmp_url": "igmp://239.1.1.8:5000"
            },
            {
              "id": 9,
              "channel_id": "90000021",
              "channel_name": "重庆卫视",
              "channel_number": "9",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "重庆",
              "igmp_group": "重庆",
              "epg_id": "18",
              "epg_name": "重庆卫视",
              "epg_number": "11009",
              "rtsp_url": "rtsp://192.168.1.100:554/live/chongqing_tv",
              "igmp_url": "igmp://239.1.1.9:5000"
            },
            {
              "id": 10,
              "channel_id": "90000022",
              "channel_name": "天津卫视",
              "channel_number": "10",
              "insert_position": null,
              "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
              "rtsp_group": "天津",
              "igmp_group": "天津",
              "epg_id": "19",
              "epg_name": "天津卫视",
              "epg_number": "11010",
              "rtsp_url": "rtsp://192.168.1.100:554/live/tianjin_tv",
              "igmp_url": "igmp://239.1.1.10:5000"
            }
            // 继续添加其他频道...
          ],
        }, 0)
        break;
      case "searchIptvChannels":
        let rand1 = Math.random()
        if (rand1 > 0.5) {
          resolve({
            total: 30,
            data: [
              {
                "id": 1,
                "channel_id": "90000013",
                "channel_name": "北京卫视-搜索",
                "channel_number": "1",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "北京",
                "igmp_group": "北京",
                "epg_id": "10",
                "epg_name": "北京卫视",
                "epg_number": "11001",
                "rtsp_url": "rtsp://192.168.1.100:554/live/beijing_tv",
                "igmp_url": "igmp://239.1.1.1:5000"
              },
              {
                "id": 2,
                "channel_id": "90000014",
                "channel_name": "湖南卫视-搜索",
                "channel_number": "2",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "湖南",
                "igmp_group": "湖南",
                "epg_id": "11",
                "epg_name": "湖南卫视",
                "epg_number": "11002",
                "rtsp_url": "rtsp://192.168.1.100:554/live/hunan_tv",
                "igmp_url": "igmp://239.1.1.2:5000"
              },
              {
                "id": 3,
                "channel_id": "90000015",
                "channel_name": "浙江卫视-搜索",
                "channel_number": "3",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "浙江",
                "igmp_group": "浙江",
                "epg_id": "12",
                "epg_name": "浙江卫视",
                "epg_number": "11003",
                "rtsp_url": "rtsp://192.168.1.100:554/live/zhejiang_tv",
                "igmp_url": "igmp://239.1.1.3:5000"
              },
              {
                "id": 4,
                "channel_id": "90000016",
                "channel_name": "东方卫视-搜索",
                "channel_number": "4",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "上海",
                "igmp_group": "上海",
                "epg_id": "13",
                "epg_name": "东方卫视",
                "epg_number": "11004",
                "rtsp_url": "rtsp://192.168.1.100:554/live/shanghai_tv",
                "igmp_url": "igmp://239.1.1.4:5000"
              },
              {
                "id": 5,
                "channel_id": "90000017",
                "channel_name": "江苏卫视-搜索",
                "channel_number": "5",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "江苏",
                "igmp_group": "江苏",
                "epg_id": "14",
                "epg_name": "江苏卫视",
                "epg_number": "11005",
                "rtsp_url": "rtsp://192.168.1.100:554/live/jiangsu_tv",
                "igmp_url": "igmp://239.1.1.5:5000"
              },

            ],
          })
        } else {
          resolve({
            total: 30,
            data: [
              {
                "id": 1,
                "channel_id": "90000013",
                "channel_name": "北京卫视-搜索1",
                "channel_number": "1",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "北京",
                "igmp_group": "北京",
                "epg_id": "10",
                "epg_name": "北京卫视",
                "epg_number": "11001",
                "rtsp_url": "rtsp://192.168.1.100:554/live/beijing_tv",
                "igmp_url": "igmp://239.1.1.1:5000"
              },
              {
                "id": 2,
                "channel_id": "90000014",
                "channel_name": "湖南卫视-搜索1",
                "channel_number": "2",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "湖南",
                "igmp_group": "湖南",
                "epg_id": "11",
                "epg_name": "湖南卫视",
                "epg_number": "11002",
                "rtsp_url": "rtsp://192.168.1.100:554/live/hunan_tv",
                "igmp_url": "igmp://239.1.1.2:5000"
              },
              {
                "id": 3,
                "channel_id": "90000015",
                "channel_name": "浙江卫视-搜索1",
                "channel_number": "3",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "浙江",
                "igmp_group": "浙江",
                "epg_id": "12",
                "epg_name": "浙江卫视",
                "epg_number": "11003",
                "rtsp_url": "rtsp://192.168.1.100:554/live/zhejiang_tv",
                "igmp_url": "igmp://239.1.1.3:5000"
              },
              {
                "id": 4,
                "channel_id": "90000016",
                "channel_name": "东方卫视-搜索",
                "channel_number": "4",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "上海",
                "igmp_group": "上海",
                "epg_id": "13",
                "epg_name": "东方卫视",
                "epg_number": "11004",
                "rtsp_url": "rtsp://192.168.1.100:554/live/shanghai_tv",
                "igmp_url": "igmp://239.1.1.4:5000"
              },
              {
                "id": 5,
                "channel_id": "90000017",
                "channel_name": "江苏卫视-搜索",
                "channel_number": "5",
                "insert_position": null,
                "logo_url": "http://192.168.2.9:50000/logo/TVB 星河.png",
                "rtsp_group": "江苏",
                "igmp_group": "江苏",
                "epg_id": "14",
                "epg_name": "江苏卫视",
                "epg_number": "11005",
                "rtsp_url": "rtsp://192.168.1.100:554/live/jiangsu_tv",
                "igmp_url": "igmp://239.1.1.5:5000"
              },

            ],
          })
        }
        break;
      case "deleteIptvChannels":
        resolve()
        break;
      case "deleteIptvChannel":
        resolve()
        break;
      case "epgData":
        resolve({
          "success": true,
          "channelInfo": {
            "id": 4,
            "name": "广东民生",
            "epgId": "4"
          },
          "programs": [
            {
              "id": 834,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "国歌",
              "start_time": "2025-07-18T23:00:00.000Z",
              "end_time": "2025-07-18T23:05:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 835,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "DV现场",
              "start_time": "2025-07-18T23:05:00.000Z",
              "end_time": "2025-07-19T01:10:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 836,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T01:10:00.000Z",
              "end_time": "2025-07-19T02:20:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 837,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T02:20:00.000Z",
              "end_time": "2025-07-19T02:43:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 838,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T02:43:00.000Z",
              "end_time": "2025-07-19T04:00:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 839,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "DV现场",
              "start_time": "2025-07-19T04:00:00.000Z",
              "end_time": "2025-07-19T06:29:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 840,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T06:29:00.000Z",
              "end_time": "2025-07-19T06:56:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 841,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T06:56:00.000Z",
              "end_time": "2025-07-19T07:31:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 842,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "民生休闲剧场：前夜",
              "start_time": "2025-07-19T07:31:00.000Z",
              "end_time": "2025-07-19T08:57:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 843,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T08:57:00.000Z",
              "end_time": "2025-07-19T10:01:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 844,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "外来媳妇本地郎",
              "start_time": "2025-07-19T10:01:00.000Z",
              "end_time": "2025-07-19T10:48:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 845,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "DV严选",
              "start_time": "2025-07-19T10:48:00.000Z",
              "end_time": "2025-07-19T11:00:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 846,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "DV现场(5133)",
              "start_time": "2025-07-19T11:00:00.000Z",
              "end_time": "2025-07-19T12:10:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 847,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "最紧要健康(1748)",
              "start_time": "2025-07-19T12:10:00.000Z",
              "end_time": "2025-07-19T12:32:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 848,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "宜居大湾区(119)",
              "start_time": "2025-07-19T12:32:00.000Z",
              "end_time": "2025-07-19T13:07:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 849,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "快乐长门人",
              "start_time": "2025-07-19T13:07:00.000Z",
              "end_time": "2025-07-19T13:13:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 850,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "民生休闲剧场：前夜(15-16）",
              "start_time": "2025-07-19T13:13:00.000Z",
              "end_time": "2025-07-19T14:40:00.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            },
            {
              "id": 851,
              "channel_id": "10001723",
              "epg_id": "广东民生",
              "title": "DV现场",
              "start_time": "2025-07-19T14:40:00.000Z",
              "end_time": "2025-07-19T15:59:59.000Z",
              "update_time": "2025-07-20T12:12:19.000Z"
            }
          ]
        })
        break;
      case "iptvAddChannel":
        resolve();
        break;
      case "iptvEditChannel":
        resolve();
        break;
      case "iptvRefreshLogo":
        resolve()
        break;
      // tbb管理
      case "tvbChannels":
        resolve({
          total: 66,
          data: [
            {
              "id": 1,
              "channel_code": "J",
              "name": "翡翠台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/翡翠台.png",
              "channel_group": "香港"
            },
            {
              "id": 2,
              "channel_code": "K",
              "name": "明珠台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/明珠台.png",
              "channel_group": "香港"
            },
            {
              "id": 3,
              "channel_code": "L",
              "name": "J2台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/J2台.png",
              "channel_group": "香港"
            },
            {
              "id": 4,
              "channel_code": "M",
              "name": "无线新闻台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线新闻台.png",
              "channel_group": "香港"
            },
            {
              "id": 5,
              "channel_code": "N",
              "name": "无线财经台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线财经台.png",
              "channel_group": "香港"
            },
            {
              "id": 6,
              "channel_code": "O",
              "name": "无线体育台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线体育台.png",
              "channel_group": "香港"
            },
            {
              "id": 7,
              "channel_code": "P",
              "name": "无线电影台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影台.png",
              "channel_group": "香港"
            },
            {
              "id": 8,
              "channel_code": "Q",
              "name": "无线音乐台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线音乐台.png",
              "channel_group": "香港"
            },
            {
              "id": 9,
              "channel_code": "R",
              "name": "无线儿童台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线儿童台.png",
              "channel_group": "香港"
            },
            {
              "id": 10,
              "channel_code": "S",
              "name": "无线生活台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线生活台.png",
              "channel_group": "香港"
            },
            {
              "id": 11,
              "channel_code": "T",
              "name": "无线旅游台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线旅游台.png",
              "channel_group": "香港"
            },
            {
              "id": 12,
              "channel_code": "U",
              "name": "无线教育台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线教育台.png",
              "channel_group": "香港"
            },
            {
              "id": 13,
              "channel_code": "V",
              "name": "无线卡通台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线卡通台.png",
              "channel_group": "香港"
            },
            {
              "id": 14,
              "channel_code": "W",
              "name": "无线戏剧台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线戏剧台.png",
              "channel_group": "香港"
            },
            {
              "id": 15,
              "channel_code": "X",
              "name": "无线电影2台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影2台.png",
              "channel_group": "香港"
            },
            {
              "id": 16,
              "channel_code": "Y",
              "name": "无线电影3台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影3台.png",
              "channel_group": "香港"
            },
            {
              "id": 17,
              "channel_code": "Z",
              "name": "无线电影4台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影4台.png",
              "channel_group": "香港"
            },
            {
              "id": 18,
              "channel_code": "A",
              "name": "无线电影5台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影5台.png",
              "channel_group": "香港"
            },
            {
              "id": 19,
              "channel_code": "B",
              "name": "无线电影6台",
              "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影6台.png",
              "channel_group": "香港"
            },
            {
              "id": 20,
              "channel_code": "C",
              "name": "无线电影7台",
              "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
              "logo": "http://192.168.2.9:50000/hk-logo/无线电影7台.png",
              "channel_group": "香港"
            }
          ],
        }, 0)
        break;
      case "searchTvbChannels":
        let rand2 = Math.random()
        if (rand2 > 0.5) {
          resolve({
            total: 30,
            data: [
              {
                "id": 1,
                "channel_code": "J",
                "name": "搜索-翡翠台",
                "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
                "logo": "http://192.168.2.9:50000/hk-logo/翡翠台.png",
                "channel_group": "香港"
              },
              {
                "id": 2,
                "channel_code": "K",
                "name": "搜索-明珠台",
                "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
                "logo": "http://192.168.2.9:50000/hk-logo/明珠台.png",
                "channel_group": "香港"
              },
              {
                "id": 3,
                "channel_code": "L",
                "name": "搜索-J2台",
                "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
                "logo": "http://192.168.2.9:50000/hk-logo/J2台.png",
                "channel_group": "香港"
              },
              {
                "id": 4,
                "channel_code": "M",
                "name": "搜索-无线新闻台",
                "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
                "logo": "http://192.168.2.9:50000/hk-logo/无线新闻台.png",
                "channel_group": "香港"
              },
            ]
          })
        } else {
          resolve({
            total: 30,
            data: [
              {
                "id": 10,
                "channel_code": "S",
                "name": "搜索-无线生活台",
                "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
                "logo": "http://192.168.2.9:50000/hk-logo/无线生活台.png",
                "channel_group": "香港"
              },
              {
                "id": 11,
                "channel_code": "T",
                "name": "搜索-无线旅游台",
                "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
                "logo": "http://192.168.2.9:50000/hk-logo/无线旅游台.png",
                "channel_group": "香港"
              },
              {
                "id": 12,
                "channel_code": "U",
                "name": "搜索-无线教育台",
                "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
                "logo": "http://192.168.2.9:50000/hk-logo/无线教育台.png",
                "channel_group": "香港"
              },
              {
                "id": 13,
                "channel_code": "V",
                "name": "搜索-无线卡通台",
                "license": "0958b9c657622c465a6205eb2252b8ed:2d2fd7b1661b1e28de38268872b48480",
                "logo": "http://192.168.2.9:50000/hk-logo/无线卡通台.png",
                "channel_group": "香港"
              },
              {
                "id": 14,
                "channel_code": "W",
                "name": "搜索-无线戏剧台",
                "license": "2d2fd7b1661b1e28de38268872b48480:0958b9c657622c465a6205eb2252b8ed",
                "logo": "http://192.168.2.9:50000/hk-logo/无线戏剧台.png",
                "channel_group": "香港"
              },
            ],
          })
        }
        break;
      case "deleteTvbChannels":
        resolve()
        break;
      case "deleteTvbChannel":
        resolve()
        break;
      case "tvbRefreshLogo":
        resolve()
        break;
      case "tvbEditChannel":
        resolve()
        break;
      default:
        // 访问错误路径返回404
        reject({
          code: 404,
          msg: "访问路径错误:/" + path,
        }); // 返回成功
    }
    return promise;
  },
};
