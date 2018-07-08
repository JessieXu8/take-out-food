function bestCharge(selectedItems) {
  const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
  console.info(formatedIdAndAmounts);
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
module.exports={
  splitIdAndAmounts,
  bestCharge
}
