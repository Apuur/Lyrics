/**
 * 解析歌词
 * 生成对象数组
 * 对象格式{time:歌词开始时间,words内容}
 */
function parseLrc() {
  let list = lrc.split("\n");
  let result = [];
  for (let i = 0; i < list.length; i++) {
    let arr = list[i].split("]");
    let time = arr[0].substring(1);
    let lrcObj = {
      time: parseTime(time),
      words: arr[1],
    };
    result.push(lrcObj);
  }
  return result;
}

/**
 * 将一个时间字符串解析为数字
 * @param {*} time string 时间字符串
 * @returns number
 */
function parseTime(time) {
  let timeArr = time.split(":");
  return +timeArr[0] * 60 + +timeArr[1] || 0;
}

let lrcData = parseLrc();
// console.log(lrcData);

/**
 * 计算出当前情况下高亮歌词下标
 */
function findLrcIndex() {
  let currentTime = doms.audio.currentTime;
  // let index = lrcData.findIndex((key, index) => {
  //   if (currentTime < key.time) return index - 1;
  // });
  for (let i = 0; i < lrcData.length; i++) {
    if (currentTime < lrcData[i].time) {
      console.log(i - 1);
      return i - 1;
    }
  }
  return lrcData.length - 1;
  // console.log(index);
  // return index;
}
// findLrcIndex();

/**
 * 创建歌词列表元素
 */
function createLrcElement() {
  var frag = document.createDocumentFragment(); // 创建文档片段
  for (let i = 0; i < lrcData.length; i++) {
    let li = document.createElement("li");
    li.innerText = lrcData[i].words;
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
}

let doms = {
  container: document.querySelector(".container"),
  ul: document.querySelector("ul"),
  audio: document.querySelector("audio"),
  li: document.querySelectorAll("li"),
};

createLrcElement();
let containerH = doms.container.clientHeight;
let liH = doms.ul.children[0].clientHeight;
let maxOffset = doms.ul.clientHeight - containerH;

/**
 * 设置ul偏移量
 */
function setOffset() {
  let index = findLrcIndex();

  let offset = liH * index + liH / 2 - containerH / 2;
  if (offset < 0) {
    offset = 0;
  }
  if (offset > maxOffset) {
    offset = maxOffset;
  }
  console.log(offset);
  doms.ul.style.transform = `translateY(-${offset}px)`;

  let oldLi = document.querySelector(".active");
  if (oldLi) {
    oldLi.classList.remove("active");
  }
  let li = doms.ul.children[index];
  if (li) {
    li.classList.add("active");
  }
}

doms.audio.addEventListener("timeupdate", setOffset);
