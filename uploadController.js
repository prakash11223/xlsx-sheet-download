const express = require("express");
const multer = require("multer");
var Excel = require("exceljs");
var workbook = new Excel.Workbook();
const axios = require("axios");
const path = require("path");

// uisng the link provided to fetch the price of all products
const fetchCall = async (productId) => {
  let price = -1;
  await axios
    .get(`https://api.storerestapi.com/products/${productId}`)
    .then((response) => {
      price = response.data.data.price;
    })
    .catch((err) => {
      console.log("unable to fetch price");
    });
  return price === -1 ? "NA" : price;
};

// this function finds the price of each product ans updates their price in the xlsx file
exports.uploadXlsx = (req, res, next) => {
  if (req.file) {
    let fileName = req.file.originalname;
    fileName = path.parse(fileName).name;
  }
  workbook.xlsx
    .readFile(`./uploads/${req.file.originalname}`)
    .then(async function () {
      var worksheet = workbook.getWorksheet(1);
      for (var i = 2; i <= 10; i++) {
        var row = worksheet.getRow(i);
        const productId = row.getCell(1).value;
        const price = await fetchCall(productId);
        row.getCell(2).value = price;
        row.commit();
      }
      await workbook.xlsx.writeFile(
        __dirname + `/uploads/${req.file.originalname}`
      );

      // sending the file after updating it
      return res.sendFile(__dirname + `/uploads/${req.file.originalname}`);
    });
};
