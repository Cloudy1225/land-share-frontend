import { emojiMap, emojiUrl } from './emojiMap';

/** 传入message.element（群系统消息SystemMessage，群提示消息GroupTip除外）
 * content = {
 *  type: 'TIMTextElem',
 *  content: {
 *    text: 'AAA[龇牙]AAA[龇牙]AAA[龇牙AAA]'
 *  }
 *}
 **/


// 解析小程序text, 表情信息也是[嘻嘻]文本
export function parseText(message) {
  const renderDom = [];
  let temp = message.payload;
  let left = -1;
  let right = -1;
  while (temp !== '') {
    left = temp.indexOf('[');
    right = temp.indexOf(']');
    switch (left) {
      case 0:
        if (right === -1) {
          renderDom.push({
            name: 'span',
            text: temp,
          });
          temp = '';
        } else {
          const _emoji = temp.slice(0, right + 1);
          if (emojiMap[_emoji]) {
            renderDom.push({
              name: 'img',
              src: emojiUrl + emojiMap[_emoji],
            });
            temp = temp.substring(right + 1);
          } else {
            renderDom.push({
              name: 'span',
              text: '[',
            });
            temp = temp.slice(1);
          }
        }
        break;
      case -1:
        renderDom.push({
          name: 'span',
          text: temp,
        });
        temp = '';
        break;
      default:
        renderDom.push({
          name: 'span',
          text: temp.slice(0, left),
        });
        temp = temp.substring(left);
        break;
    }
  }
  return renderDom;
}

// 解析图片消息
export function parseImage(message) {
  const renderDom = [{
    name: 'image',
    // 这里默认渲染的是 1080P 的图片
    src: message.payload,
  }];
  return renderDom;
}
// 解析视频消息
export function parseVideo(message) {
  const renderDom = [{
    name: 'video',
    src: message.payload,
  }];
  return renderDom;
}
// 解析语音消息
export function parseAudio(message) {
  const renderDom = [{
    name: 'audio',
    src: message.payload.url,
    second: 1,
  }];
  return renderDom;
}

