const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

function bestCharge(selectedItems) {
  const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
  console.info(formatedIdAndAmounts);
  const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
  console.info(basicOrderDetails);
  const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
  console.info(prePreferentialTotal);
  const savedMoneyByModeOne=preferentialModeOne(prePreferentialTotal);
  const savedMoneyByModeTwo=preferentialModeTwo(prePreferentialTotal,basicOrderDetails,loadPromotions());
  const savedMoneyAndMode = choosePreferentialMode(savedMoneyByModeOne,savedMoneyByModeTwo);
  console.info(savedMoneyAndMode);
  const finalMoney=getFinalMoney(prePreferentialTotal ,savedMoneyAndMode);
  console.info(finalMoney);
  return /*TODO*/;
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
  let savedMoneyByModeOne = 6;
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
  if (savedMoneyByModeOne >= savedMoneyByModeTwo){
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

module.exports={
  splitIdAndAmounts,
  getBasicOrderDetails,
  getPrePreferentialTotal,
  preferentialModeOne,
  preferentialModeTwo,
  choosePreferentialMode,
  getFinalMoney,
  bestCharge
}
