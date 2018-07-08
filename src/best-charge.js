const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

function bestCharge(selectedItems) {
  //将点餐条码分割成[{id:'ITEM0001',amounts:1},...]的形式
  const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
  //得到基本订单详情
  const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
  //得到订单优惠前总价
  const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
  //优惠方式一节省的钱（满30-6）
  const savedMoneyByModeOne=preferentialModeOne(prePreferentialTotal);
  //优惠方式二节省的钱（指定菜品半价（黄焖鸡，凉皮））
  const savedMoneyByModeTwo=preferentialModeTwo(prePreferentialTotal,basicOrderDetails,loadPromotions());
  //选择优惠方式
  const savedMoneyAndMode = choosePreferentialMode(savedMoneyByModeOne,savedMoneyByModeTwo);
  //计算订单优惠后需要付的钱
  const finalMoney=getFinalMoney(prePreferentialTotal ,savedMoneyAndMode);
  //得到最终订单
  const finalOrderDetails = getFinalOrderDetails(basicOrderDetails,savedMoneyAndMode,finalMoney);
  return finalOrderDetails;
}

/*将点餐条码分割成{id: xx , amounts: xx}格式*/
function splitIdAndAmounts(selectedItems) {
  let formatedIdAndAmounts=[];
  for (let item of selectedItems){
    let formatItemNum={};
    let div=item.split(' x ');
    formatItemNum.id=div[0];
    formatItemNum.amounts=parseFloat(div[1]);
    formatedIdAndAmounts.push(formatItemNum);
  }
  return formatedIdAndAmounts;
}
/*得到基本订单详情*/
function getBasicOrderDetails(formatedIdAndAmounts , allItems){
  const basicOrderDetails=[];
  for (let formatedItem of formatedIdAndAmounts){
    let basicOrderDetailsObj={};
    for (let allItem of allItems){
      if (formatedItem.id === allItem.id){
        basicOrderDetailsObj.id = formatedItem.id;
        basicOrderDetailsObj.name = allItem.name;
        basicOrderDetailsObj.price = allItem.price;
        basicOrderDetailsObj.amounts = formatedItem.amounts;
        basicOrderDetailsObj.subTotal = basicOrderDetailsObj.price * basicOrderDetailsObj.amounts;
      }
    }
    basicOrderDetails.push(basicOrderDetailsObj);
  }
  return basicOrderDetails;
}
/*得到订单优惠前总价*/
function getPrePreferentialTotal(basicOrderDetails){
  let prePreferentialTotal=0;
  for (let basicOrderDetail of basicOrderDetails){
    prePreferentialTotal+=basicOrderDetail.subTotal;
  }
  return prePreferentialTotal;
}
/*优惠方式一节省的钱（满30-6）*/
function preferentialModeOne(prePreferentialTotal){
  let savedMoneyByModeOne = 0;
  if (prePreferentialTotal >= 30){
    savedMoneyByModeOne = 6;
  }else {
    savedMoneyByModeOne = 0;
  }
  return savedMoneyByModeOne;
}
/*优惠方式二节省的钱（指定菜品半价（黄焖鸡，凉皮））*/
function preferentialModeTwo(prePreferentialTotal,basicOrderDetails,promotions){
  let savedMoneyByModeTwo = 0;
  for(let basicOrderDetail of basicOrderDetails){
    for(let promotionItem of promotions[1].items){
      if (basicOrderDetail.id === promotionItem){
        savedMoneyByModeTwo += basicOrderDetail.subTotal/2;
      }
    }
  }
  return savedMoneyByModeTwo;
}
/*选择优惠方式*/
function choosePreferentialMode(savedMoneyByModeOne,savedMoneyByModeTwo){
  const savedMoneyAndMode={};
  if (savedMoneyByModeOne === savedMoneyByModeTwo && savedMoneyByModeOne === 0){
    savedMoneyAndMode.savedMoney = 0;
    savedMoneyAndMode.mode = 0;
  }
  else if (savedMoneyByModeOne >= savedMoneyByModeTwo){
    savedMoneyAndMode.savedMoney = savedMoneyByModeOne;
    savedMoneyAndMode.mode = 1;
  }else{
    savedMoneyAndMode.savedMoney = savedMoneyByModeTwo;
    savedMoneyAndMode.mode = 2;
  }
  return savedMoneyAndMode;
}
/*计算订单优惠后总计*/
function getFinalMoney(prePreferentialTotal ,savedMoneyAndMode){
  let finalMoney = prePreferentialTotal -savedMoneyAndMode.savedMoney;
  return finalMoney;
}
/*得到最终订单*/
function getFinalOrderDetails(basicOrderDetails,savedMoneyAndMode,finalMoney){
  let finalOrderDetails="";
  let tempStr="";
  for (let basicOrderDetail of basicOrderDetails){
    tempStr+=`\n${basicOrderDetail.name} x ${basicOrderDetail.amounts} = ${basicOrderDetail.subTotal}元`;
  }
  if (savedMoneyAndMode.mode === 0){
    finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
总计：${finalMoney}元
===================================`;
  }else if (savedMoneyAndMode.mode === 1){
    finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
使用优惠:
满30减6元，省${savedMoneyAndMode.savedMoney}元
-----------------------------------
总计：${finalMoney}元
===================================`;
  }else if (savedMoneyAndMode.mode === 2){
    finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省${savedMoneyAndMode.savedMoney}元
-----------------------------------
总计：${finalMoney}元
===================================`;
  }
  return finalOrderDetails;
}

module.exports={
  splitIdAndAmounts,
  getBasicOrderDetails,
  getPrePreferentialTotal,
  preferentialModeOne,
  preferentialModeTwo,
  choosePreferentialMode,
  getFinalMoney,
  getFinalOrderDetails,
  bestCharge
}
