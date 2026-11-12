// Artwork and lettering are separate. A story supplies ordered episodes;
// groups are read vertically, and an optional choice adds a branch of groups.
const ink = 'https://jaychtw.github.io/zero-sum/art/';
const taipei = 'https://jaychtw.github.io/the-hours-between/';
const panel = (id, image, alt, words, crop) => ({id,image,alt,words,crop});
const stories = [
 {id:'zero-sum',title:['Zero Sum','Zero Sum'],kind:['Interactive manga · Excerpt','互動漫畫 · 節選'],theme:'noir',
  cover:ink+'city7.webp',coverAlt:['Jacque holds on to the broken bridge.','賈克用手攀住斷橋。'],
  description:['Karl’s taillights are disappearing. Jacque has one hand on the broken span. Alex can reach only one of them.','卡爾的車尾燈漸行漸遠。賈克只剩一隻手攀著斷橋。艾力克斯只能趕到其中一人身邊。'],
  full:'https://jaychtw.github.io/zero-sum/',episodes:[{id:'bridge',title:['The broken span','斷橋'],groups:[
   [panel('transfer',ink+'city5.webp',['Two squad cars at the transfer bay.','兩輛警車停在轉乘區。'],['Alex trades seats with Pete. Misaki gives him a small nod before their cars part.','艾力克斯和彼特交換座位。兩輛車分開前，美咲朝他輕輕點了頭。']),
    panel('flight',ink+'city6.webp',['Jacque launches into the rain.','賈克飛進雨幕。'],['Alex · “The car has the road. I’ve got you.”','艾力克斯：「路交給車子。你交給我。」'])],
   [panel('rail',ink+'city7.webp',['Jacque hangs from the fractured rail.','賈克攀住破裂的護欄。'],['Jacque · “I’m holding on. Not for long.”','賈克：「我還抓得住。撐不了多久。」'])]
  ],choices:[
   {id:'rescue',label:['Pull Jacque up','拉賈克上來'],groups:[[panel('grip',ink+'city8.webp',['Alex grips Jacque’s arm.','艾力克斯抓住賈克的手臂。'],['The first time, their hands miss. The second time, Alex holds on.','第一次，兩隻手錯過了。第二次，艾力克斯抓住了。'])]],continueURL:'https://jaychtw.github.io/zero-sum/#start/bridge/rescue'},
   {id:'pursue',label:['Keep Karl in sight','繼續追卡爾'],groups:[[panel('mirror',ink+'city9.webp',['The bridge reflected in the mirror.','後照鏡映著斷橋。'],['Jacque calls his name once. In the mirror, the edge is empty.','賈克喊了他一聲。後照鏡裡，斷橋邊已經沒有人了。'])]],continueURL:'https://jaychtw.github.io/zero-sum/#start/bridge/hangar'}
  ]}]},
 {id:'rain',title:['Across the Street','街的另一邊'],kind:['Linear layout study','線性排版習作'],theme:'rain',
  cover:taipei+'taipei.webp',coverAlt:['Rain along a row of Taipei shopfronts.','雨中的臺北街屋。'],
  description:['Three views of one rainy street. A short reader study using the painted setting from The Hours Between.','同一條雨街的三個視角。這篇短短的閱讀習作取景自《雨停之間》。'],
  episodes:[{id:'one',title:['Under the arcade','騎樓下'],groups:[
    [panel('street',taipei+'taipei.webp',['A street seen from beneath a Taipei arcade.','從騎樓下望向對街。'],['From here, the shops across the road look close enough to touch.','從這裡望去，對街的店面彷彿伸手就碰得到。'])],
    [panel('awning',taipei+'taipei.webp',['A closer view of the awnings opposite.','對街遮雨棚的近景。'],['I could make a run for the red awning.','跑幾步，應該就能躲到那頂紅雨棚下。'],'awning')],
    [panel('water',taipei+'taipei.webp',['Rain caught in the reflected light on the road.','路面倒影裡的雨。'],['I stay for the reflections.','可我還想看看水裡的倒影。'],'water')]
  ]}]}
];
