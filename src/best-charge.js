const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

function bestCharge(selectedItems) {
  const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
  console.info(formatedIdAndAmounts);
  const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
  console.info(basicOrderDetails);
  const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
  console.info(prePreferentialTotal);
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

module.exports={
  splitIdAndAmounts,
  getBasicOrderDetails,
  getPrePreferentialTotal,
  bestCharge
}
