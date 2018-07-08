const {splitIdAndAmounts,
  getBasicOrderDetails,
  getPrePreferentialTotal,
  preferentialModeOne,
  preferentialModeTwo,
  choosePreferentialMode,
  getFinalMoney,
  bestCharge} = require('../src/best-charge')

const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});

describe('unit test', () => {

  it('unit test of splitIdAndAmounts()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);

    let result=JSON.stringify([
      {"id":"ITEM0001","amounts":1},
      {"id":"ITEM0013","amounts":2},
			{"id":"ITEM0022","amounts":1}
    ]);
    expect(JSON.stringify(formatedIdAndAmounts)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of getBasicOrderDetails()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());

    let result=JSON.stringify([
      {"id":"ITEM0001","name":"黄焖鸡","price":18,"amounts":1,"subTotal":18},
      {"id":"ITEM0013","name":"肉夹馍","price":6,"amounts":2,"subTotal":12},
			{"id":"ITEM0022","name":"凉皮","price":8,"amounts":1,"subTotal":8}
    ]);
    expect(JSON.stringify(basicOrderDetails)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of getPrePreferentialTotal()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
    const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);

    let result=JSON.stringify(38);
    expect(JSON.stringify(prePreferentialTotal)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of preferentialModeOne()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
    const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
    const savedMoneyByModeOne=preferentialModeOne(prePreferentialTotal);

    let result=JSON.stringify(6);
    expect(JSON.stringify(savedMoneyByModeOne)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of preferentialModeTwo()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
    const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
    const savedMoneyByModeTwo=preferentialModeTwo(prePreferentialTotal,basicOrderDetails,loadPromotions());

    let result=JSON.stringify(13);
    expect(JSON.stringify(savedMoneyByModeTwo)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of choosePreferentialMode()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
    const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
    const savedMoneyByModeOne=preferentialModeOne(prePreferentialTotal);
    const savedMoneyByModeTwo=preferentialModeTwo(prePreferentialTotal,basicOrderDetails,loadPromotions());
    const savedMoneyAndMode = choosePreferentialMode(savedMoneyByModeOne,savedMoneyByModeTwo);

    let result=JSON.stringify({"savedMoney":13,"mode":2});
    expect(JSON.stringify(savedMoneyAndMode)).toBe(result)

  });
});

describe('unit test', () => {

  it('unit test of getFinalMoney()', () => {

    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    const formatedIdAndAmounts=splitIdAndAmounts(selectedItems);
    const basicOrderDetails=getBasicOrderDetails(formatedIdAndAmounts , loadAllItems());
    const prePreferentialTotal=getPrePreferentialTotal(basicOrderDetails);
    const savedMoneyByModeOne=preferentialModeOne(prePreferentialTotal);
    const savedMoneyByModeTwo=preferentialModeTwo(prePreferentialTotal,basicOrderDetails,loadPromotions());
    const savedMoneyAndMode = choosePreferentialMode(savedMoneyByModeOne,savedMoneyByModeTwo);
    const finalMoney=getFinalMoney(prePreferentialTotal ,savedMoneyAndMode);

    let result=JSON.stringify(25);
    expect(JSON.stringify(finalMoney)).toBe(result)

  });
});