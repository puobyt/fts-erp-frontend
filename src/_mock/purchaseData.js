import {
    _id,
    _price,
    _times,
    address,
    contact,
    NameOfTheFirm,
    Material,
    _taskNames,
    purchaseOrderNumber,
    contactPersonDetails,
    contactPersonName,
    BankDetails,
    _postTitles,
    _description,
    _productNames,
  } from './_mock';




export const _ProductOrderCreations = [...Array(24)].map((_, index) => ({
    id: _id(index),
    purchaseOrderNumber: purchaseOrderNumber(index),
    nameOfTheFirm: NameOfTheFirm(index),
    address: address(index),
    contact: contact(index),
    contactPersonName: contactPersonName(index),
    contactPersonDetails: contactPersonDetails(index),
    Material: Material(index),
    BankDetails:BankDetails(index),
  }));
  