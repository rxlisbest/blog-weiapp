let localhostDev = false;
let _host = localhostDev ? 'http://127.0.0.1:8000' : 'https://api.blog.ruixinglong.net';

export default {
  articles: {
    'index': _host + '/v1/articles',
    'view': _host + '/v1/articles/',
    'create': _host + '/v1/articles',
    'update': _host + '/v1/articles/',
    'delete': _host + '/v1/articles/'
  },
  article_categories: {
    'index': _host + '/v1/article-categories',
    'view': _host + '/v1/article-categories/',
    'create': _host + '/v1/article-categories',
    'update': _host + '/v1/article-categories/',
    'delete': _host + '/v1/article-categories/'
  },
  discussions: {
    'index': _host + '/v1/discussions',
    'create': _host + '/v1/discussions',
    'random': _host + '/v1/discussions/random',
  },
  qiniu: {
    'token': _host + '/v1/qiniu/token',
  },
  files: {
    'view': _host + '/v1/files/',
    'create': _host + '/v1/files',
  },
  statistics: {
    'index': _host + '/v1/statistics',
  },
  auth: {
    'index': _host + '/v1/auth',
  },
  user_wechat: {
    'login': _host + '/v1/user-wechat/login',
    'register': _host + '/v1/user-wechat/register',
  },
  sms_aliyun: {
    'send': _host + '/v1/sms-aliyun/send',
    'captcha': _host + '/v1/sms-aliyun/captcha/',
  }
}