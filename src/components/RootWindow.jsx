import React, { useState } from "react";
import { CSVReader, CSVDownloader } from "react-papaparse";
import styled from "styled-components";
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

const slangHeaders = createCsvStringifier({
  header: [
    { id: "sku_id", title: "sku_id" },
    { id: "sku_name", title: "sku_name" },
    { id: "product_type", title: "product_type" },
    { id: "brand", title: "brand" },
    { id: "sub_category", title: "sub_category" },
    { id: "category", title: "category" },
  ],
});

const buttonRef = React.createRef();
const MainWrapper = styled.div`
  display: flex;
  padding: 2rem;
  width: 50%;
  margin: auto;
`;
const MapTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: auto;
  border-radius: 10px;
  padding: 1rem;
  button {
    all: unset;
    background-color: #107415cf;
    color: white;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    padding: 10px;
    opacity: 0.7;
    transition: 1s ease;
    &:hover {
      opacity: 1;
    }
  }
`;
const MapInput = styled.div`
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  label {
    padding-bottom: 5px;
    font-family: sans-serif;
    font-size: 14px;
  }
  input {
    padding: 0.7rem;
    border-radius: 5px;
    border: 0;
    outline: 0;
    background: #e6e6e6e6;
  }
`;

const CSVWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-right: 1rem;
`;
const Aside = styled.aside`
  display: flex;
  flex-direction: row;
  margin-bottom: 10;

  #browse-btn {
    all: unset;
    background-color: #1ea725cf;
    color: white;
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
    width: 30%;
    padding: 5px;
    text-align: center;
    cursor: pointer;
  }
  #remove-btn {
    all: unset;
    background-color: #cf0a0adc;
    color: white;
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
    padding-left: 25px;
    padding-right: 25px;
    cursor: pointer;
  }
  #filename-wrapper {
    border: 1px solid #ccc;
    height: 45;
    line-height: 2.5;
    margin-top: 5;
    margin-bottom: 5;
    padding-left: 13;
    padding-top: 3;
    width: 70%;
  }
`;
function RootWindow() {
  const [columnMap, setColumnMap] = useState({
    sku_id: "sku",
    sku_name: "name",
    product_type: "name",
    brand: "mgs_brand",
    sub_category: "name",
    category: "name",
  });
  const [skuID, setSkuID] = useState(columnMap.sku_id);
  const [skuName, setSkuName] = useState(columnMap.sku_name);
  const [productType, setProductType] = useState(columnMap.product_type);
  const [brand, setBrand] = useState(columnMap.brand);
  const [category, setCategory] = useState(columnMap.category);
  const [subCategory, setSubCategory] = useState(columnMap.sub_category);
  const [csvData, setCsvData] = useState("");
  const handleValueSubmit = () => {
    alert("Values Set!");
    setColumnMap({
      sku_id: skuID,
      sku_name: skuName,
      product_type: productType,
      brand: brand,
      sub_category: subCategory,
      category: category,
    });
    console.log(columnMap);
  };

  function remapper(data) {
    const records = [];
    data.forEach((element) => {
      records.push({
        sku_id: element.data[columnMap.sku_id],
        sku_name: element.data[columnMap.sku_name],
        product_type: element.data[columnMap.product_type],
        brand: element.data[columnMap.brand],
        sub_category: element.data[columnMap.sub_category],
        category: element.data[columnMap.category],
      });
    });
    console.log(slangHeaders.stringifyRecords(records));
    setCsvData(slangHeaders.stringifyRecords(records));
  }
  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    console.log("File Loaded...");
    remapper(data);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };
  return (
    <MainWrapper>
      <CSVWrapper>
        <h1>Ranosys Converter</h1>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          noDrag
          config={{
            header: true,
            skipEmptyLines: true,
          }}
          onRemoveFile={handleOnRemoveFile}
        >
          {({ file }) => (
            <Aside>
              <button type="button" id="browse-btn" onClick={handleOpenDialog}>
                Browse file
              </button>
              <div id="filename-wrapper">{file && file.name}</div>
              <button id="remove-btn" onClick={handleRemoveFile}>
                Remove
              </button>
            </Aside>
          )}
        </CSVReader>
        <CSVDownloader
          data={csvData}
          type="button"
          filename={"slangCsv-generated"}
          bom={true}
          style={{
            padding: "10px",
            marginTop: "10px",
          }}
        >
          Download
        </CSVDownloader>
      </CSVWrapper>
      <MapTable>
        <MapInput>
          <label>SKU ID</label>
          <input value={skuID} onChange={(e) => setSkuID(e.target.value)} />
        </MapInput>
        <MapInput>
          <label>SKU NAME</label>
          <input value={skuName} onChange={(e) => setSkuName(e.target.value)} />
        </MapInput>
        <MapInput>
          <label>PRODUCT TYPE</label>
          <input
            value={productType}
            onInput={(e) => setProductType(e.target.value)}
          />
        </MapInput>
        <MapInput>
          <label>BRAND</label>
          <input value={brand} onInput={(e) => setBrand(e.target.value)} />
        </MapInput>
        <MapInput>
          <label>CATEGORY</label>
          <input
            value={category}
            onInput={(e) => setCategory(e.target.value)}
          />
        </MapInput>
        <MapInput>
          <label>SUB CATEGORY</label>
          <input
            value={subCategory}
            onInput={(e) => setSubCategory(e.target.value)}
          />
        </MapInput>
        <button onClick={handleValueSubmit}>SET VALUES</button>
      </MapTable>
    </MainWrapper>
  );
}

export default RootWindow;
