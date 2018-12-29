var event_map = {
  'HTTP_Protocol_Validation': {
    name: 'HTTP协议违背',
    index: 0
  },
  'Web_Server_Bug': {
    name: 'Web服务器漏洞攻击',
    index: 1
  },
  'Web_Plugin_Bug': {
    name: 'Web插件漏洞攻击',
    index: 2
  },
  'Spider_Anti': {
    name: '爬虫事件',
    index: 3
  },
  'Scan_Anti': {
    name: '恶意扫描',
    index: 4
  },
  'CSRF': {
    name: '跨站请求伪造',
    index: 5
  },
  'File_Upload_Limit': {
    name: '文件非法上传',
    index: 6
  },
  'Cross_Site_Scripting': {
    name: '跨站脚本攻击',
    index: 7
  },
  'SQL_Injection': {
    name: 'SQL注入攻击',
    index: 8
  },
  'LDAP_Injection': {
    name: 'LDAP注入攻击',
    index: 9
  },
  'SSI': {
    name: 'SSI指令',
    index: 10
  },
  'XPATH': {
    name: 'XPath注入攻击',
    index: 11
  },
  'OS_CMD_Injection': {
    name: '命令注入攻击',
    index: 12
  },
  'Path_Traversal': {
    name: '路径穿越攻击',
    index: 13
  },
  'RFI': {
    name: '远程文件包含',
    index: 14
  },
  'Directory_Index': {
    name: '目录索引',
    index: 15
  },
  'Info_Leak': {
    name: '信息泄露',
    index: 16
  },
  'Content_filter': {
    name: '内容过滤',
    index: 17
  },
  'Download_limit': {
    name: '非法下载',
    index: 18
  },
  'Custom': {
    name: '自定义攻击',
    index: 19
  },
  'HTTP_ACL': {
    name: 'HTTP访问控制事件',
    index: 20
  },
  'Virtual_Patch': {
    name: '智能补丁',
    index: 21
  },
  'Anti_leech': {
    name: '资源盗链',
    index: 22
  },
  'Cookie_sec': {
    name: 'Cookie篡改',
    index: 23
  },
  'White_list': {
    name: '违背白名单',
    index: 24
  },
  'Webshell': {
    name: 'WebShell页面访问',
    index: 25
  },
  'Sensitive_Info_Filter': {
    name: '敏感信息过滤',
    index: 26
  },
  'SSL_LOAD': {
    name: 'SSL加载',
    index: 27
  },
  'Brute_force': {
    name: '暴利破解攻击',
    index: 28
  }
}
module.exports = event_map