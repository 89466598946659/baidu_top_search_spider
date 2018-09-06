const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

module.exports = () => {
  // any url, eg: wd=a
  const url = 'http://www.baidu.com/s?wd=a';
  const date = new Date();
  const time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' :'+date.getHours()+':'+date.getMinutes();
  const top_data = {
    day: time,
    top_list: []
  };
  const top_list = [];

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      logger('Request success.');
      const html = body.toString();
      const $ = cheerio.load(html);
      const $list = $('.opr-toplist-table tbody tr');

      for (let i = 0; i < 10; i++) {
        let $item = $list.eq(i);
        let top = {
          name: $item.find('a').text(),
          value: $item.find('.opr-toplist-right').text(),
          url: 'http://www.baidu.com'+$item.find('a').attr('href')
        };
        top_list.push(top);
      }
      top_data.top_list = top_list;
      logger(top_data);
      const path = __dirname + '/baidu_top.txt';

      // write the top ten to file
      logger('Write file start...');
      fs.writeFile(path, top_data.day + '\n', {flag: 'a'}, () => {});
      top_data.top_list.forEach((it, index) => {
        fs.writeFile(path, '名称: ' + it.name + '\t\t\t搜索指数: ' + it.value + '\turl: ' + it.url + '\n', {flag: 'a' }, () => {});
        if (index === top_data.top_list.length - 1) {
          fs.writeFile(path, '\n', {flag: 'a'});
        }
      });
      logger('Write file end...');
    } else {
      logger('Request error.');
    }
  });

  function logger() {
    console.log(new Date() + ':---');
    console.log.apply(console, arguments);
  }

};