const {splitIdAndAmounts,
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